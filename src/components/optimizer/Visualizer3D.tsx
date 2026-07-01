import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useOptimizer } from './OptimizerContext';
import { OptimizerEngine } from '../../lib/optimizerEngine';

export default function Visualizer3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { 
    engine, setEngine,
    activeAlgorithm, lr, momentum, beta,
    history, currentStepIndex, setHistory, setCurrentStepIndex, setIsPlaying 
  } = useOptimizer();

  const [isReady, setIsReady] = useState(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const surfaceMeshRef = useRef<THREE.Mesh | null>(null);
  const ballMeshRef = useRef<THREE.Mesh | null>(null);
  const trailLineRef = useRef<THREE.Line | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 500;
    const height = mountRef.current.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#05070e');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(6, 4, 8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x22d3ee, 0.6, 20);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    // Ball
    const ballGeo = new THREE.SphereGeometry(0.1, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({ 
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.8
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    scene.add(ball);
    ballMeshRef.current = ball;

    // Trail
    const trailMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, linewidth: 2, opacity: 0.8, transparent: true });
    const trailGeo = new THREE.BufferGeometry();
    const trail = new THREE.Line(trailGeo, trailMat);
    scene.add(trail);
    trailLineRef.current = trail;

    setIsReady(true);

    // Animation loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      setIsReady(false);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Surface Geometry when ready or surface changes
  useEffect(() => {
    if (!isReady || !sceneRef.current) return;

    // Remove old surface
    if (surfaceMeshRef.current) {
      sceneRef.current.remove(surfaceMeshRef.current);
      surfaceMeshRef.current.geometry.dispose();
      if (Array.isArray(surfaceMeshRef.current.material)) {
        surfaceMeshRef.current.material.forEach(m => m.dispose());
      } else {
        surfaceMeshRef.current.material.dispose();
      }
    }

    const segments = 80; // High density for smooth gradients
    const size = 10;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    
    const pos = geometry.attributes.position;
    const colors = [];
    const color = new THREE.Color();

    let minZ = Infinity;
    let maxZ = -Infinity;

    // First pass to calculate Z and find min/max
    const zValues = [];
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      
      const mathX = x;
      const mathY = -y; 
      const zHeight = isNaN(engine.surface.f(mathX, mathY)) ? 0 : engine.surface.f(mathX, mathY);
      
      zValues.push(zHeight);
      minZ = Math.min(minZ, zHeight);
      maxZ = Math.max(maxZ, zHeight);
    }

    // Second pass to apply Z and colors
    for (let i = 0; i < pos.count; i++) {
      const zHeight = zValues[i];
      pos.setZ(i, zHeight);

      // Color mapping: Blue/Purple (valleys) to Gold/Red (peaks)
      const normZ = maxZ > minZ ? (zHeight - minZ) / (maxZ - minZ) : 0;
      
      if (normZ < 0.5) {
        // Deep blue/purple for valleys
        color.setHSL(0.66 - normZ * 0.2, 0.9, 0.25 + normZ * 0.35);
      } else {
        // Golden/orange/red for peaks
        const t = (normZ - 0.5) * 2;
        color.setHSL(0.6 - t * 0.6, 0.95, 0.6 - t * 0.2);
      }
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    // Standard material with lighting support for realistic contours
    const solidMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9
    });

    // Wireframe overlay for mathematical feel
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });

    const mesh = new THREE.Mesh(geometry, solidMat);
    // Rotate to lie flat on XZ plane
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -0.01; // Avoid exact z-fighting with axes
    sceneRef.current.add(mesh);
    surfaceMeshRef.current = mesh;

    // Add wireframe over it
    const wire = new THREE.Mesh(geometry, wireMat);
    mesh.add(wire);

  }, [isReady, engine]);

  // Update Ball & Trail based on History / Current Step
  useEffect(() => {
    if (!isReady) return;
    
    const currentState = history[currentStepIndex];
    if (currentState && ballMeshRef.current) {
      // Map math (x, y, z) to ThreeJS (x, y, -z) since Plane was rotated
      ballMeshRef.current.position.set(currentState.x, currentState.z, -currentState.y);
    }

    if (trailLineRef.current && history.length > 0) {
      const points = history.slice(0, currentStepIndex + 1).map(s => new THREE.Vector3(s.x, s.z, -s.y));
      trailLineRef.current.geometry.setFromPoints(points);
      trailLineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  }, [isReady, history, currentStepIndex]);

  // Handle Clicks (Raycaster)
  useEffect(() => {
    if (!isReady) return;

    const handleMouseClick = (event: MouseEvent) => {
      if (!mountRef.current || !cameraRef.current || !surfaceMeshRef.current) return;
      
      // Don't trigger if dragging controls
      if (event.movementX > 2 || event.movementY > 2) return;

      const rect = mountRef.current.getBoundingClientRect();
      // Ensure click is inside canvas
      if (event.clientX < rect.left || event.clientX > rect.right || 
          event.clientY < rect.top || event.clientY > rect.bottom) {
        return;
      }

      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const intersects = raycaster.intersectObject(surfaceMeshRef.current);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        // Map ThreeJS (x, y, z) back to Math (x, -z, y)
        const mathX = point.x;
        const mathY = -point.z;

        setIsPlaying(false);
        const newEngine = new OptimizerEngine(activeAlgorithm, engine.surface.type, mathX, mathY);
        newEngine.lr = lr;
        newEngine.momentum = momentum;
        newEngine.beta = beta;
        setEngine(newEngine);
        setHistory([newEngine.state]);
        setCurrentStepIndex(0);
      }
    };

    window.addEventListener('click', handleMouseClick);
    return () => window.removeEventListener('click', handleMouseClick);
  }, [isReady, engine.surface.type, activeAlgorithm, lr, momentum, beta]);

  return <div ref={mountRef} className="w-full h-full cursor-crosshair" />;
}
