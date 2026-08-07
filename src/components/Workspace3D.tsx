import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sun, Moon, RotateCcw, Compass, Eye } from 'lucide-react';
import type { CADElement } from './CADCanvas2D';

interface Workspace3DProps {
  elements: CADElement[];
  onAutoSave?: () => void;
  speak: (text: string) => void;
}

export const Workspace3D: React.FC<Workspace3DProps> = ({ elements, onAutoSave, speak }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dayMode, setDayMode] = useState(true);
  const [viewMode, setViewMode] = useState<'walkthrough' | 'flythrough' | 'orbit'>('orbit');
  const [activeMaterial, setActiveMaterial] = useState<'concrete' | 'oak' | 'marble'>('concrete');
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const lightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const structuresGroupRef = useRef<THREE.Group | null>(null);

  // Materials map
  const materials = {
    concrete: new THREE.MeshPhysicalMaterial({
      color: 0x8e8e93,
      roughness: 0.6,
      metalness: 0.1,
    }),
    oak: new THREE.MeshPhysicalMaterial({
      color: 0xc19a6b,
      roughness: 0.45,
      metalness: 0.05,
    }),
    marble: new THREE.MeshPhysicalMaterial({
      color: 0xe5e5ea,
      roughness: 0.12,
      metalness: 0.01,
      clearcoat: 1.0,
    }),
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Dark high tech gradient skyboxes simulated
    scene.background = new THREE.Color(dayMode ? 0x141829 : 0x05060b);
    if (!dayMode) {
      scene.fog = new THREE.FogExp2(0x05060b, 0.08);
    }

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(20, 25, 45);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1; // Limit under ground plane
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, dayMode ? 0.8 : 0.25);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight = new THREE.DirectionalLight(0xffffff, dayMode ? 2.5 : 0.6);
    dirLight.position.set(40, 60, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    lightRef.current = dirLight;

    // Blue/Cyan environmental rim light for tech aesthetic
    const pointLight = new THREE.PointLight(0x00f0ff, dayMode ? 2 : 4, 100);
    pointLight.position.set(0, 15, 0);
    scene.add(pointLight);

    // Grid helper
    const gridHelper = new THREE.GridHelper(100, 50, 0x00f0ff, 0x222533);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Ground plane
    const groundGeom = new THREE.PlaneGeometry(200, 200);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0d0f19,
      roughness: 0.9,
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Group for building walls & geometry
    const structuresGroup = new THREE.Group();
    scene.add(structuresGroup);
    structuresGroupRef.current = structuresGroup;

    // Build solid 3D assets from 2D coordinate elements
    const scale = 0.06; // Translate 2D canvas pixel coordinates to 3D Three.js space
    const centerOffset = { x: 360, z: 210 }; // Center on origin

    elements.forEach((el) => {
      // Scale positions relative to center origin
      const x1 = (el.x1 - centerOffset.x) * scale;
      const z1 = (el.y1 - centerOffset.z) * scale;
      const x2 = (el.x2 - centerOffset.x) * scale;
      const z2 = (el.y2 - centerOffset.z) * scale;

      const currentMaterial = materials[activeMaterial];

      if (el.type === 'wall') {
        // Calculate wall angle and length
        const dx = x2 - x1;
        const dz = z2 - z1;
        const wallLen = Math.sqrt(dx * dx + dz * dz) || 0.01;
        const angle = -Math.atan2(dz, dx);

        const wallHeight = 4.2;
        const wallThickness = 0.4;

        const wallGeom = new THREE.BoxGeometry(wallLen, wallHeight, wallThickness);
        const wallMesh = new THREE.Mesh(wallGeom, currentMaterial);

        // Position at midpoint of vector segment
        wallMesh.position.set((x1 + x2) / 2, wallHeight / 2, (z1 + z2) / 2);
        wallMesh.rotation.y = angle;
        wallMesh.castShadow = true;
        wallMesh.receiveShadow = true;

        structuresGroup.add(wallMesh);
      } else if (el.type === 'door') {
        const dx = x2 - x1;
        const dz = z2 - z1;
        const doorLen = Math.sqrt(dx * dx + dz * dz) || 1.2;
        const angle = -Math.atan2(dz, dx);

        // Two side pillars and thin opening representing frame
        const doorHeight = 4.0;
        const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.3 });

        const frameGeom = new THREE.BoxGeometry(doorLen, doorHeight, 0.4);
        const frameMesh = new THREE.Mesh(frameGeom, doorFrameMat);
        frameMesh.position.set((x1 + x2) / 2, doorHeight / 2, (z1 + z2) / 2);
        frameMesh.rotation.y = angle;
        frameMesh.castShadow = true;
        structuresGroup.add(frameMesh);
      } else if (el.type === 'window') {
        const dx = x2 - x1;
        const dz = z2 - z1;
        const winLen = Math.sqrt(dx * dx + dz * dz) || 1.5;
        const angle = -Math.atan2(dz, dx);

        const winHeight = 2.0;
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0x00f0ff,
          transparent: true,
          opacity: 0.6,
          roughness: 0.1,
          transmission: 0.9,
          ior: 1.5,
        });

        const glassGeom = new THREE.BoxGeometry(winLen, winHeight, 0.2);
        const glassMesh = new THREE.Mesh(glassGeom, glassMat);
        // Elevate window off floor ground
        glassMesh.position.set((x1 + x2) / 2, 2.5, (z1 + z2) / 2);
        glassMesh.rotation.y = angle;
        structuresGroup.add(glassMesh);
      } else if (el.type === 'furniture') {
        // Place a custom representative primitive (e.g. bed, chair, couch)
        let furnitureGeom: THREE.BufferGeometry;
        const furnMat = new THREE.MeshStandardMaterial({ color: 0xffa500, roughness: 0.5 });

        if (el.name === 'bed') {
          furnitureGeom = new THREE.BoxGeometry(3, 1, 4);
        } else if (el.name === 'sofa') {
          furnitureGeom = new THREE.BoxGeometry(4, 1.5, 1.8);
        } else if (el.name === 'table') {
          furnitureGeom = new THREE.CylinderGeometry(1.5, 1.5, 1.2, 16);
        } else {
          furnitureGeom = new THREE.BoxGeometry(1.2, 1.8, 1.2);
        }

        const furnMesh = new THREE.Mesh(furnitureGeom, furnMat);
        furnMesh.position.set(x1, 0.75, z1);
        furnMesh.castShadow = true;
        structuresGroup.add(furnMesh);
      }
    });

    // Auto save simulation
    const autoSaveTimer = setInterval(() => {
      if (onAutoSave) onAutoSave();
    }, 15000);

    // Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (viewMode === 'walkthrough') {
        // Walk orbit camera bobbing
        const time = Date.now() * 0.002;
        camera.position.y = 4.2 + Math.sin(time) * 0.15;
      } else if (viewMode === 'flythrough') {
        // Continuous aerial flight path orbiting scene center
        const r = 35;
        const speed = Date.now() * 0.0003;
        camera.position.x = Math.sin(speed) * r;
        camera.position.z = Math.cos(speed) * r;
        camera.position.y = 18 + Math.sin(speed * 2) * 4;
        camera.lookAt(0, 2, 0);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(autoSaveTimer);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [elements, dayMode, viewMode, activeMaterial]);

  const handleDayNightToggle = () => {
    const nextMode = !dayMode;
    setDayMode(nextMode);
    speak(`Toggling workspace environment cycle to ${nextMode ? 'daylight mode' : 'nightmode twilight rendering'}.`);
  };

  const handleViewMode = (mode: 'walkthrough' | 'flythrough' | 'orbit') => {
    setViewMode(mode);
    speak(`Camera flight system set to ${mode} mode.`);
  };

  return (
    <div className="w-full h-full relative flex flex-col" id="three">
      {/* Top 3D Menu HUD */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
        <button
          onClick={handleDayNightToggle}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md border shadow-lg transition duration-300 ${
            dayMode ? 'bg-dark/80 border-white/10 text-white' : 'bg-accent-cyan/20 border-accent-cyan/40 text-accent-cyan glow-border-cyan'
          }`}
        >
          {dayMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-accent-cyan animate-pulse" />}
          <span>{dayMode ? 'Daytime Simulation' : 'Night-time Lighting'}</span>
        </button>

        <button
          onClick={() => handleViewMode('orbit')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md border shadow-lg transition duration-300 ${
            viewMode === 'orbit' ? 'bg-accent-cyan text-dark' : 'bg-dark/80 border-white/10 text-white'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Orbit Mode</span>
        </button>

        <button
          onClick={() => handleViewMode('walkthrough')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md border shadow-lg transition duration-300 ${
            viewMode === 'walkthrough' ? 'bg-accent-cyan text-dark' : 'bg-dark/80 border-white/10 text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Walkthrough Mode</span>
        </button>

        <button
          onClick={() => handleViewMode('flythrough')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md border shadow-lg transition duration-300 ${
            viewMode === 'flythrough' ? 'bg-accent-cyan text-dark' : 'bg-dark/80 border-white/10 text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Flythrough Mode</span>
        </button>
      </div>

      {/* Material select panel HUD */}
      <div className="absolute bottom-4 left-4 z-20 glass-card rounded-xl px-4 py-3 border-white/10 flex items-center gap-3 shadow-2xl">
        <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">Extruded material:</span>
        <div className="flex gap-1.5">
          {(['concrete', 'oak', 'marble'] as const).map((mat) => (
            <button
              key={mat}
              onClick={() => { setActiveMaterial(mat); speak(`Material changed to polished ${mat}.`); }}
              className={`px-2.5 py-1 rounded text-[10px] font-semibold capitalize transition ${
                activeMaterial === mat ? 'bg-accent-cyan text-dark font-bold' : 'bg-white/5 hover:bg-white/10 text-white'
              }`}
            >
              {mat}
            </button>
          ))}
        </div>
      </div>

      {/* Main viewport frame */}
      <div ref={containerRef} className="w-full flex-1 min-h-[440px] bg-dark/60 rounded-3xl overflow-hidden border border-white/5 relative" />
    </div>
  );
};
export default Workspace3D;
