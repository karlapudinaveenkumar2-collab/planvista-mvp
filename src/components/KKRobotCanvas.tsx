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
  const headRef = useRef<THREE.Group | null>(null);
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

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Dynamic 2D Canvas for Pixar-Style Animated Face Screen
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = 512;
    faceCanvas.height = 512;
    const faceCtx = faceCanvas.getContext('2d')!;

    // Create Canvas Texture
    const faceTexture = new THREE.CanvasTexture(faceCanvas);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x00f0ff, 4, 6);
    blueLight.position.set(0, 0.5, 1.2);
    scene.add(blueLight);

    // Robot master group
    const robotGroup = new THREE.Group();
    robotGroup.position.y = -0.5;
    scene.add(robotGroup);
    robotRef.current = robotGroup;

    // Materials - Highly polished, ultra-glossy materials
    const glossyWhiteMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    const darkAccentMat = new THREE.MeshPhysicalMaterial({
      color: 0x18181c,
      roughness: 0.2,
      metalness: 0.4,
      clearcoat: 0.5,
    });

    const screenGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x030305,
      roughness: 0.05,
      metalness: 0.95,
      clearcoat: 1.0,
      emissive: 0xffffff,
      emissiveMap: faceTexture,
      emissiveIntensity: 2.2, // Strong, vivid glow
    });

    const jetFlameMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
    });

    // 1. Torso/Body (Super cute, round capsule/pod shape)
    const torsoGeom = new THREE.SphereGeometry(0.56, 36, 36);
    torsoGeom.scale(1.0, 1.15, 0.95);
    const torso = new THREE.Mesh(torsoGeom, glossyWhiteMat);
    torso.castShadow = true;
    torso.receiveShadow = true;
    robotGroup.add(torso);

    // Cute dark circular chest glass/accent plate
    const chestPlateGeom = new THREE.BoxGeometry(0.35, 0.35, 0.12, 4, 4, 4);
    const chestPlate = new THREE.Mesh(chestPlateGeom, darkAccentMat);
    chestPlate.position.set(0, -0.05, 0.44);
    chestPlate.rotation.x = 0.15;
    robotGroup.add(chestPlate);

    // Glowing KK Core logo on chest
    const logoGeom = new THREE.BoxGeometry(0.12, 0.03, 0.02);
    const logoMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const logoMesh = new THREE.Mesh(logoGeom, logoMat);
    logoMesh.position.set(0, -0.05, 0.51);
    robotGroup.add(logoMesh);

    // 2. Head (Large, rounded cubic screen enclosure - adorable EVE/WALL-E style)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.8, 0);
    robotGroup.add(headGroup);
    headRef.current = headGroup;

    // Casing
    const outerHeadGeom = new THREE.BoxGeometry(0.88, 0.74, 0.68, 12, 12, 12);
    const outerHead = new THREE.Mesh(outerHeadGeom, glossyWhiteMat);
    outerHead.castShadow = true;
    outerHead.receiveShadow = true;
    headGroup.add(outerHead);

    // Curved Front Glass Screen
    const screenGeom = new THREE.BoxGeometry(0.72, 0.58, 0.1, 8, 8);
    const screen = new THREE.Mesh(screenGeom, screenGlassMat);
    screen.position.set(0, 0, 0.3);
    headGroup.add(screen);

    // Cute Ears with Glowing cyan ring lights
    const earLGeom = new THREE.CylinderGeometry(0.13, 0.13, 0.14, 32);
    earLGeom.rotateZ(Math.PI / 2);
    const earL = new THREE.Mesh(earLGeom, darkAccentMat);
    earL.position.set(-0.48, 0, 0);
    headGroup.add(earL);

    const earR = earL.clone();
    earR.position.x = 0.48;
    headGroup.add(earR);

    // Glowing status indicators on ears
    const earLightLGeom = new THREE.SphereGeometry(0.035, 16, 16);
    const earLightL = new THREE.Mesh(earLightLGeom, logoMat);
    earLightL.position.set(-0.55, 0, 0);
    headGroup.add(earLightL);

    const earLightR = earLightL.clone();
    earLightR.position.x = 0.55;
    headGroup.add(earLightR);

    // 3. Arms (Chubby segments, organic ball-jointed flow)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.64, 0.2, 0);
    robotGroup.add(leftArmGroup);
    leftArmRef.current = leftArmGroup;

    const shoulderLGeom = new THREE.SphereGeometry(0.11, 24, 24);
    const shoulderL = new THREE.Mesh(shoulderLGeom, darkAccentMat);
    leftArmGroup.add(shoulderL);

    const upperArmLGeom = new THREE.CylinderGeometry(0.075, 0.07, 0.22, 24);
    upperArmLGeom.translate(0, -0.1, 0);
    const upperArmL = new THREE.Mesh(upperArmLGeom, glossyWhiteMat);
    leftArmGroup.add(upperArmL);

    const handLGeom = new THREE.SphereGeometry(0.085, 24, 24);
    const handL = new THREE.Mesh(handLGeom, darkAccentMat);
    handL.position.set(0, -0.26, 0);
    leftArmGroup.add(handL);

    // Right Arm Group
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.64, 0.2, 0);
    robotGroup.add(rightArmGroup);
    rightArmRef.current = rightArmGroup;

    const shoulderR = shoulderL.clone();
    rightArmGroup.add(shoulderR);

    const upperArmR = upperArmL.clone();
    rightArmGroup.add(upperArmR);

    const handR = handL.clone();
    rightArmGroup.add(handR);

    // 4. Legs (Short, chubby organic leg pegs)
    const legLGeom = new THREE.CylinderGeometry(0.09, 0.08, 0.32, 24);
    const legL = new THREE.Mesh(legLGeom, glossyWhiteMat);
    legL.position.set(-0.24, -0.62, 0);
    robotGroup.add(legL);
    leftLegRef.current = legL;

    const legR = legL.clone();
    legR.position.x = 0.24;
    robotGroup.add(legR);
    rightLegRef.current = legR;

    // Jet nozzles
    const jetLGeom = new THREE.CylinderGeometry(0.11, 0.08, 0.12, 24);
    const jetL = new THREE.Mesh(jetLGeom, darkAccentMat);
    jetL.position.set(-0.24, -0.82, 0);
    robotGroup.add(jetL);

    const jetR = jetL.clone();
    jetR.position.x = 0.24;
    robotGroup.add(jetR);

    // Jet Fire Boosters (conical flames)
    const flameGeom = new THREE.ConeGeometry(0.08, 0.25, 16);
    flameGeom.translate(0, -0.125, 0);
    const flameL = new THREE.Mesh(flameGeom, jetFlameMat);
    flameL.position.set(-0.24, -0.88, 0);
    flameL.visible = false;
    robotGroup.add(flameL);

    const flameR = flameL.clone();
    flameR.position.x = 0.24;
    robotGroup.add(flameR);

    // Thruster Particle Engine
    const particleCount = 60;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.4;
      positions[i * 3 + 1] = -0.9 - Math.random() * 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      velocities.push((Math.random() - 0.5) * 0.06, -0.12 - Math.random() * 0.15, (Math.random() - 0.5) * 0.06);
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.09,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const jetParticles = new THREE.Points(particleGeom, particleMat);
    jetParticles.visible = false;
    robotGroup.add(jetParticles);
    jetParticlesRef.current = jetParticles;

    // Shadow Floor
    const planeGeom = new THREE.PlaneGeometry(10, 10);
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.25 });
    const shadowPlane = new THREE.Mesh(planeGeom, planeMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Mouse positions
    let targetMouseX = 0;
    let targetMouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (!lookAtMouse) return;
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Anim configuration
    const clock = new THREE.Clock();
    let blinkTimer = 0;
    let isBlinking = false;
    let blinkFactor = 1.0;

    // Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Clear dynamic face canvas with dark glossy color
      faceCtx.fillStyle = '#05050a';
      faceCtx.fillRect(0, 0, 512, 512);

      // Draw high-tech blueprint lines on screen
      faceCtx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
      faceCtx.lineWidth = 1;
      for (let i = 32; i < 512; i += 32) {
        faceCtx.beginPath();
        faceCtx.moveTo(i, 0);
        faceCtx.lineTo(i, 512);
        faceCtx.stroke();
        faceCtx.beginPath();
        faceCtx.moveTo(0, i);
        faceCtx.lineTo(512, i);
        faceCtx.stroke();
      }

      // 1. Calculate Eye positions with mouse tracking/look-at
      const eyeOffsetX = targetMouseX * 18;
      const eyeOffsetY = -targetMouseY * 12;

      const leftEyeCenter = { x: 170 + eyeOffsetX, y: 220 + eyeOffsetY };
      const rightEyeCenter = { x: 342 + eyeOffsetX, y: 220 + eyeOffsetY };

      // Blinking calculation
      blinkTimer += 0.015;
      if (blinkTimer > 3.2) {
        isBlinking = true;
        blinkTimer = 0;
      }
      if (isBlinking) {
        blinkFactor -= 0.22;
        if (blinkFactor <= 0) {
          isBlinking = false;
        }
      } else {
        blinkFactor = Math.min(1.0, blinkFactor + 0.16);
      }

      // Draw Cyan Glowing Eyes
      const drawEye = (center: { x: number; y: number }) => {
        faceCtx.save();
        faceCtx.translate(center.x, center.y);
        faceCtx.scale(1, blinkFactor);

        // Outer glow
        const glowGrad = faceCtx.createRadialGradient(0, 0, 10, 0, 0, 50);
        glowGrad.addColorStop(0, 'rgba(0, 240, 255, 0.9)');
        glowGrad.addColorStop(0.4, 'rgba(0, 240, 255, 0.45)');
        glowGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
        faceCtx.fillStyle = glowGrad;
        faceCtx.beginPath();
        faceCtx.arc(0, 0, 50, 0, Math.PI * 2);
        faceCtx.fill();

        // Eye core depending on expression
        faceCtx.fillStyle = '#ffffff';
        faceCtx.shadowColor = '#00f0ff';
        faceCtx.shadowBlur = 15;

        if (expression === 'happy') {
          // Beautiful happy arches (WALL-E / Pixar smile)
          faceCtx.beginPath();
          faceCtx.arc(0, 10, 32, Math.PI * 1.15, Math.PI * 1.85);
          faceCtx.lineWidth = 14;
          faceCtx.strokeStyle = '#00f0ff';
          faceCtx.lineCap = 'round';
          faceCtx.stroke();
        } else if (expression === 'focused') {
          // Cute slanted focused slots
          faceCtx.beginPath();
          faceCtx.ellipse(0, 0, 30, 8, -0.15, 0, Math.PI * 2);
          faceCtx.fill();
        } else if (expression === 'thinking') {
          // Looking upward sideways
          faceCtx.beginPath();
          faceCtx.arc(0, 0, 25, 0, Math.PI * 2);
          faceCtx.fill();
        } else { // excited
          // Perfect glowing big circles
          faceCtx.beginPath();
          faceCtx.arc(0, 0, 32, 0, Math.PI * 2);
          faceCtx.fill();
        }
        faceCtx.restore();
      };

      drawEye(leftEyeCenter);
      drawEye(rightEyeCenter);

      // Draw Glowing Mouth
      faceCtx.save();
      faceCtx.shadowColor = '#00f0ff';
      faceCtx.shadowBlur = 12;
      faceCtx.strokeStyle = '#00f0ff';
      faceCtx.lineWidth = 8;
      faceCtx.lineCap = 'round';

      const mouthCenterY = 360;

      if (speaking) {
        // Dynamic bouncing/talking waveform
        const speakingHeight = Math.abs(Math.sin(elapsedTime * 15)) * 18 + 4;
        faceCtx.beginPath();
        faceCtx.moveTo(216, mouthCenterY);
        faceCtx.bezierCurveTo(
          236, mouthCenterY - speakingHeight,
          276, mouthCenterY - speakingHeight,
          296, mouthCenterY
        );
        faceCtx.bezierCurveTo(
          276, mouthCenterY + speakingHeight,
          236, mouthCenterY + speakingHeight,
          216, mouthCenterY
        );
        faceCtx.fillStyle = 'rgba(0, 240, 255, 0.8)';
        faceCtx.fill();
        faceCtx.stroke();
      } else {
        // Natural happy smiling curved mouth
        faceCtx.beginPath();
        faceCtx.arc(256, mouthCenterY - 15, 34, 0.08 * Math.PI, 0.92 * Math.PI);
        faceCtx.stroke();
      }
      faceCtx.restore();

      // Trigger Three.js to upload face canvas changes to GPU
      faceTexture.needsUpdate = true;

      // 2. Bobbing/Breathing Actions
      if (robotGroup) {
        if (action === 'fly') {
          robotGroup.position.y = -0.1 + Math.sin(elapsedTime * 3.2) * 0.14;
          robotGroup.rotation.z = THREE.MathUtils.lerp(robotGroup.rotation.z, 0, 0.1);
          robotGroup.rotation.y = THREE.MathUtils.lerp(robotGroup.rotation.y, 0, 0.1);
          jetParticles.visible = true;
          flameL.visible = true;
          flameR.visible = true;
          flameL.scale.setScalar(1 + Math.sin(elapsedTime * 25) * 0.15);
          flameR.scale.setScalar(1 + Math.sin(elapsedTime * 25) * 0.15);

          // Update jet particles
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
          jetParticles.visible = false;
          flameL.visible = false;
          flameR.visible = false;
        } else {
          robotGroup.position.y = -0.5 + Math.sin(elapsedTime * 1.8) * 0.05;
          robotGroup.rotation.z = THREE.MathUtils.lerp(robotGroup.rotation.z, 0, 0.1);
          robotGroup.rotation.y = THREE.MathUtils.lerp(robotGroup.rotation.y, 0, 0.1);
          jetParticles.visible = false;
          flameL.visible = false;
          flameR.visible = false;
        }
      }

      // Mouse tracking head look-at
      if (headGroup && lookAtMouse) {
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetMouseX * 0.38, 0.1);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetMouseY * 0.22, 0.1);
      }

      // Reset leg offsets smoothly when not walking
      if (action !== 'walk' && leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.position.z = THREE.MathUtils.lerp(leftLegRef.current.position.z, 0, 0.1);
        rightLegRef.current.position.z = THREE.MathUtils.lerp(rightLegRef.current.position.z, 0, 0.1);
        leftLegRef.current.position.y = THREE.MathUtils.lerp(leftLegRef.current.position.y, -0.62, 0.1);
        rightLegRef.current.position.y = THREE.MathUtils.lerp(rightLegRef.current.position.y, -0.62, 0.1);
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
      }

      // Apply dynamic actions
      switch (action) {
        case 'wave':
          if (leftArmGroup) {
            leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -1.8, 0.12);
            leftArmGroup.rotation.x = Math.sin(elapsedTime * 8) * 0.25;
          }
          if (rightArmGroup) {
            rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.2, 0.12);
            rightArmGroup.rotation.x = 0;
          }
          break;
        case 'point':
          if (rightArmGroup) {
            rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 1.45, 0.12);
            rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, -0.65, 0.12);
          }
          if (leftArmGroup) {
            leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.22, 0.12);
            leftArmGroup.rotation.x = 0;
          }
          break;
        case 'explain':
          if (rightArmGroup && leftArmGroup) {
            rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.82 + Math.sin(elapsedTime * 4) * 0.15, 0.1);
            leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.82 - Math.sin(elapsedTime * 4) * 0.15, 0.1);
            rightArmGroup.rotation.x = Math.sin(elapsedTime * 3) * 0.2;
            leftArmGroup.rotation.x = -Math.sin(elapsedTime * 3) * 0.2;
          }
          break;
        case 'clap':
          if (rightArmGroup && leftArmGroup) {
            rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.62, 0.15);
            leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.62, 0.15);
            rightArmGroup.rotation.y = Math.abs(Math.sin(elapsedTime * 14)) * -0.55;
            leftArmGroup.rotation.y = Math.abs(Math.sin(elapsedTime * 14)) * 0.55;
          }
          break;
        case 'walk':
          if (leftLegRef.current && rightLegRef.current && leftArmGroup && rightArmGroup && robotGroup) {
            const walkSpeed = 8.0;
            // Leg swing rotation (hip rotation)
            leftLegRef.current.rotation.x = Math.sin(elapsedTime * walkSpeed) * 0.44;
            rightLegRef.current.rotation.x = -Math.sin(elapsedTime * walkSpeed) * 0.44;

            // Lift knees/feet slightly on forward steps
            leftLegRef.current.position.y = -0.62 + Math.max(0, Math.sin(elapsedTime * walkSpeed)) * 0.09;
            rightLegRef.current.position.y = -0.62 + Math.max(0, -Math.sin(elapsedTime * walkSpeed)) * 0.09;

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
