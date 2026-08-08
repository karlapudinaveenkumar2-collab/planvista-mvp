import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface KKRobotCanvasProps {
  action: 'idle' | 'blink' | 'tilt' | 'wave' | 'point' | 'fly' | 'clap' | 'walk' | 'explain';
  expression: 'happy' | 'thinking' | 'focused' | 'excited';
  speaking: boolean;
  lookAtMouse?: boolean;
}

export const KKRobotCanvas: React.FC<KKRobotCanvasProps> = ({
  action = 'idle',
  expression = 'happy',
  speaking = false,
  lookAtMouse = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<THREE.Group | null>(null);
  const headRef = useRef<THREE.Mesh | null>(null);
  const screenRef = useRef<THREE.Mesh | null>(null);
  const leftEyeRef = useRef<THREE.Mesh | null>(null);
  const rightEyeRef = useRef<THREE.Mesh | null>(null);
  const mouthRef = useRef<THREE.Mesh | null>(null);
  const leftArmRef = useRef<THREE.Group | null>(null);
  const rightArmRef = useRef<THREE.Group | null>(null);
  const leftLegRef = useRef<THREE.Mesh | null>(null);
  const rightLegRef = useRef<THREE.Mesh | null>(null);
  const jetParticlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create scene, camera, renderer
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;
    const scene = new THREE.Scene();

    // Transparent background
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x00f0ff, 3, 5);
    blueLight.position.set(0, 1, 1);
    scene.add(blueLight);

    // Robot group
    const robotGroup = new THREE.Group();
    robotGroup.position.y = -0.5;
    scene.add(robotGroup);
    robotRef.current = robotGroup;

    // Materials
    // Glossy white metal for body parts
    const whitePlasticMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5f5f7,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    // Dark grey/black carbon fiber accent
    const darkAccentMat = new THREE.MeshPhysicalMaterial({
      color: 0x2c2d30,
      roughness: 0.3,
      metalness: 0.2,
    });

    // Black glass screen for face
    const screenMat = new THREE.MeshPhysicalMaterial({
      color: 0x050508,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0,
    });

    // Glowing cyan emissive for eyes and mouth
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
    });

    // 1. Torso/Body (futuristic rounded pod with chest plate)
    const torsoGeom = new THREE.SphereGeometry(0.55, 32, 32);
    torsoGeom.scale(1, 1.1, 0.9);
    const torso = new THREE.Mesh(torsoGeom, whitePlasticMat);
    torso.castShadow = true;
    torso.receiveShadow = true;
    robotGroup.add(torso);

    // Chest Panel
    const chestPlateGeom = new THREE.BoxGeometry(0.48, 0.42, 0.1, 4, 4, 4);
    const chestPlate = new THREE.Mesh(chestPlateGeom, darkAccentMat);
    chestPlate.position.set(0, 0.05, 0.4);
    chestPlate.rotation.x = 0.1;
    robotGroup.add(chestPlate);

    // KK screen text
    const logoGeom = new THREE.BoxGeometry(0.18, 0.04, 0.02);
    const logoMesh = new THREE.Mesh(logoGeom, glowMat);
    logoMesh.position.set(0, -0.05, 0.46);
    robotGroup.add(logoMesh);

    // 2. Head (large rounded cubic screen enclosure)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.8, 0);
    robotGroup.add(headGroup);

    const outerHeadGeom = new THREE.BoxGeometry(0.85, 0.72, 0.65, 8, 8, 8);
    const outerHead = new THREE.Mesh(outerHeadGeom, whitePlasticMat);
    outerHead.castShadow = true;
    outerHead.receiveShadow = true;
    headGroup.add(outerHead);
    headRef.current = headGroup as any;

    // Face screen (curved insert)
    const screenGeom = new THREE.BoxGeometry(0.68, 0.55, 0.1, 4, 4);
    const screen = new THREE.Mesh(screenGeom, screenMat);
    screen.position.set(0, 0, 0.29);
    headGroup.add(screen);
    screenRef.current = screen;

    // Ears / Headsets
    const earLGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.12, 24);
    earLGeom.rotateZ(Math.PI / 2);
    const earL = new THREE.Mesh(earLGeom, darkAccentMat);
    earL.position.set(-0.46, 0, 0);
    headGroup.add(earL);

    const earR = earL.clone();
    earR.position.x = 0.46;
    headGroup.add(earR);

    // Ear lights
    const earLightLGeom = new THREE.SphereGeometry(0.04, 16, 16);
    const earLightL = new THREE.Mesh(earLightLGeom, glowMat);
    earLightL.position.set(-0.53, 0, 0);
    headGroup.add(earLightL);

    const earLightR = earLightL.clone();
    earLightR.position.x = 0.53;
    headGroup.add(earLightR);

    // 3. Eyes (cyan glowing rings or circles)
    const eyeGeom = new THREE.RingGeometry(0.06, 0.09, 32);
    const eyeLeft = new THREE.Mesh(eyeGeom, glowMat);
    eyeLeft.position.set(-0.16, 0.05, 0.35);
    headGroup.add(eyeLeft);
    leftEyeRef.current = eyeLeft;

    const eyeRight = eyeLeft.clone();
    eyeRight.position.x = 0.16;
    headGroup.add(eyeRight);
    rightEyeRef.current = eyeRight;

    // Expression Mouth
    const mouthGeom = new THREE.BoxGeometry(0.12, 0.02, 0.01);
    const mouth = new THREE.Mesh(mouthGeom, glowMat);
    mouth.position.set(0, -0.12, 0.35);
    headGroup.add(mouth);
    mouthRef.current = mouth;

    // 4. Arms
    // Left Shoulder joint
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.62, 0.2, 0);
    robotGroup.add(leftArmGroup);
    leftArmRef.current = leftArmGroup;

    const shoulderLGeom = new THREE.SphereGeometry(0.1, 16, 16);
    const shoulderL = new THREE.Mesh(shoulderLGeom, darkAccentMat);
    leftArmGroup.add(shoulderL);

    const upperArmLGeom = new THREE.CylinderGeometry(0.07, 0.07, 0.24, 16);
    upperArmLGeom.translate(0, -0.12, 0);
    const upperArmL = new THREE.Mesh(upperArmLGeom, whitePlasticMat);
    leftArmGroup.add(upperArmL);

    const handLGeom = new THREE.SphereGeometry(0.08, 16, 16);
    const handL = new THREE.Mesh(handLGeom, darkAccentMat);
    handL.position.set(0, -0.28, 0);
    leftArmGroup.add(handL);

    // Right Arm
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.62, 0.2, 0);
    robotGroup.add(rightArmGroup);
    rightArmRef.current = rightArmGroup;

    const shoulderR = shoulderL.clone();
    rightArmGroup.add(shoulderR);

    const upperArmR = upperArmL.clone();
    rightArmGroup.add(upperArmR);

    const handR = handL.clone();
    rightArmGroup.add(handR);

    // 5. Legs / Jets
    const legLGeom = new THREE.CylinderGeometry(0.09, 0.08, 0.35, 16);
    const legL = new THREE.Mesh(legLGeom, whitePlasticMat);
    legL.position.set(-0.25, -0.65, 0);
    robotGroup.add(legL);
    leftLegRef.current = legL;

    const legR = legL.clone();
    legR.position.x = 0.25;
    robotGroup.add(legR);
    rightLegRef.current = legR;

    // Jet Thruster caps on feet
    const jetLGeom = new THREE.CylinderGeometry(0.11, 0.08, 0.12, 16);
    const jetL = new THREE.Mesh(jetLGeom, darkAccentMat);
    jetL.position.set(-0.25, -0.85, 0);
    robotGroup.add(jetL);

    const jetR = jetL.clone();
    jetR.position.x = 0.25;
    robotGroup.add(jetR);

    // Blue Jet Thruster Particles for Flying
    const particleCount = 40;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.4;
      positions[i * 3 + 1] = -0.9 - Math.random() * 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      velocities.push((Math.random() - 0.5) * 0.05, -0.1 - Math.random() * 0.1, (Math.random() - 0.5) * 0.05);
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const jetParticles = new THREE.Points(particleGeom, particleMat);
    jetParticles.visible = false;
    robotGroup.add(jetParticles);
    jetParticlesRef.current = jetParticles;

    // Shadow plane
    const planeGeom = new THREE.PlaneGeometry(10, 10);
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.2 });
    const shadowPlane = new THREE.Mesh(planeGeom, planeMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Handle mouse tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (!lookAtMouse) return;
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation variables
    const clock = new THREE.Clock();
    let blinkTimer = 0;
    let isBlinking = false;

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Idle bobbing / Breathing
      if (robotGroup) {
        if (action === 'fly') {
          robotGroup.position.y = -0.1 + Math.sin(elapsedTime * 3) * 0.12;
          robotGroup.rotation.z = THREE.MathUtils.lerp(robotGroup.rotation.z, 0, 0.1);
          robotGroup.rotation.y = THREE.MathUtils.lerp(robotGroup.rotation.y, 0, 0.1);
          jetParticles.visible = true;
          // Update particles
          const posArr = jetParticles.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < particleCount; i++) {
            posArr[i * 3 + 1] += velocities[i * 3 + 1];
            posArr[i * 3] += velocities[i * 3];
            if (posArr[i * 3 + 1] < -1.8) {
              posArr[i * 3 + 1] = -0.9;
              posArr[i * 3] = (Math.random() - 0.5) * 0.4;
            }
          }
          jetParticles.geometry.attributes.position.needsUpdate = true;
        } else if (action === 'walk') {
          // Handled inside walk case dynamically
          jetParticles.visible = false;
        } else {
          robotGroup.position.y = -0.5 + Math.sin(elapsedTime * 1.8) * 0.04;
          robotGroup.rotation.z = THREE.MathUtils.lerp(robotGroup.rotation.z, 0, 0.1);
          robotGroup.rotation.y = THREE.MathUtils.lerp(robotGroup.rotation.y, 0, 0.1);
          jetParticles.visible = false;
        }
      }

      // Voice speaking jitter / eye scale pulse
      if (speaking && elapsedTime % 0.15 < 0.08) {
        if (mouthRef.current) {
          mouthRef.current.scale.set(1.4, 3, 1);
        }
      } else {
        if (mouthRef.current) {
          mouthRef.current.scale.set(1, 1, 1);
        }
      }

      // Blink cycle
      blinkTimer += clock.getDelta();
      if (blinkTimer > 3.5) {
        isBlinking = true;
        blinkTimer = 0;
      }
      if (isBlinking) {
        if (leftEyeRef.current && rightEyeRef.current) {
          leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, 0.05, 0.4);
          rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, 0.05, 0.4);
          if (leftEyeRef.current.scale.y < 0.08) {
            isBlinking = false;
          }
        }
      } else {
        if (leftEyeRef.current && rightEyeRef.current) {
          leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, 1, 0.25);
          rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, 1, 0.25);
        }
      }

      // Mouse tracking head look-at
      if (headGroup && lookAtMouse) {
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetMouseX * 0.35, 0.1);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetMouseY * 0.2, 0.1);
      }

      // Smoothly reset legs when not walking
      if (action !== 'walk' && leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.position.z = THREE.MathUtils.lerp(leftLegRef.current.position.z, 0, 0.1);
        rightLegRef.current.position.z = THREE.MathUtils.lerp(rightLegRef.current.position.z, 0, 0.1);
        leftLegRef.current.position.y = THREE.MathUtils.lerp(leftLegRef.current.position.y, -0.65, 0.1);
        rightLegRef.current.position.y = THREE.MathUtils.lerp(rightLegRef.current.position.y, -0.65, 0.1);
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
      }

      // Apply dynamic actions
      switch (action) {
        case 'wave':
          if (leftArmGroup) {
            leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -1.8, 0.1);
            leftArmGroup.rotation.x = Math.sin(elapsedTime * 8) * 0.25;
          }
          if (rightArmGroup) {
            rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.2, 0.1);
            rightArmGroup.rotation.x = 0;
          }
          break;
        case 'point':
          if (rightArmGroup) {
            rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 1.4, 0.1);
            rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, -0.6, 0.1);
          }
          if (leftArmGroup) {
            leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.2, 0.1);
            leftArmGroup.rotation.x = 0;
          }
          break;
        case 'explain':
          if (rightArmGroup && leftArmGroup) {
            rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.8 + Math.sin(elapsedTime * 4) * 0.15, 0.1);
            leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.8 - Math.sin(elapsedTime * 4) * 0.15, 0.1);
            rightArmGroup.rotation.x = Math.sin(elapsedTime * 3) * 0.2;
            leftArmGroup.rotation.x = -Math.sin(elapsedTime * 3) * 0.2;
          }
          break;
        case 'clap':
          if (rightArmGroup && leftArmGroup) {
            rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.6, 0.15);
            leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.6, 0.15);
            rightArmGroup.rotation.y = Math.abs(Math.sin(elapsedTime * 12)) * -0.5;
            leftArmGroup.rotation.y = Math.abs(Math.sin(elapsedTime * 12)) * 0.5;
          }
          break;
        case 'walk':
          if (leftLegRef.current && rightLegRef.current && leftArmGroup && rightArmGroup && robotGroup) {
            const walkSpeed = 7.5;
            // Leg swing rotation (hip rotation)
            leftLegRef.current.rotation.x = Math.sin(elapsedTime * walkSpeed) * 0.42;
            rightLegRef.current.rotation.x = -Math.sin(elapsedTime * walkSpeed) * 0.42;

            // Lift knees/feet slightly on forward steps
            leftLegRef.current.position.y = -0.65 + Math.max(0, Math.sin(elapsedTime * walkSpeed)) * 0.08;
            rightLegRef.current.position.y = -0.65 + Math.max(0, -Math.sin(elapsedTime * walkSpeed)) * 0.08;

            // Arm swings opposite to leg swing
            leftArmGroup.rotation.x = -Math.sin(elapsedTime * walkSpeed) * 0.55;
            rightArmGroup.rotation.x = Math.sin(elapsedTime * walkSpeed) * 0.55;

            // Keep arm swing looking natural/outward
            leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.28, 0.15);
            rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.28, 0.15);

            // Vertical hip bobbing (bob up twice per stride cycle)
            robotGroup.position.y = -0.5 + Math.abs(Math.sin(elapsedTime * walkSpeed)) * 0.08;
            // Hip sway side-to-side (roll)
            robotGroup.rotation.z = Math.sin(elapsedTime * walkSpeed) * 0.05;
            // Spine twist (yaw)
            robotGroup.rotation.y = Math.cos(elapsedTime * walkSpeed) * 0.06;
          }
          break;
        case 'tilt':
          if (headGroup) {
            headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0.22, 0.1);
          }
          break;
        default: // idle
          if (leftArmGroup && rightArmGroup) {
            leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.15, 0.08);
            rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.15, 0.08);
            leftArmGroup.rotation.x = THREE.MathUtils.lerp(leftArmGroup.rotation.x, Math.sin(elapsedTime * 1.5) * 0.08, 0.08);
            rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, -Math.sin(elapsedTime * 1.5) * 0.08, 0.08);
          }
          break;
      }

      // Expressions configuration
      if (leftEyeRef.current && rightEyeRef.current && mouthRef.current) {
        if (expression === 'happy') {
          mouthRef.current.scale.set(1.5, 1, 1);
        } else if (expression === 'thinking') {
          leftEyeRef.current.rotation.z = 0;
          rightEyeRef.current.rotation.z = 0;
          mouthRef.current.scale.set(0.6, 1, 1);
        } else if (expression === 'focused') {
          leftEyeRef.current.rotation.z = -0.2;
          rightEyeRef.current.rotation.z = 0.2;
          mouthRef.current.scale.set(0.8, 0.5, 1);
        } else if (expression === 'excited') {
          mouthRef.current.scale.set(2, 2.5, 1);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [action, expression, speaking, lookAtMouse]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[250px] flex items-center justify-center relative cursor-pointer">
      <div className="absolute inset-0 bg-radial-gradient from-accent-cyan/10 to-transparent pointer-events-none rounded-full blur-2xl"></div>
    </div>
  );
};
