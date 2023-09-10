'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import * as TWEEN from '@tweenjs/tween.js'
import addLightsToScene from '../app/Lighting/lightsHandler.js'
import addCameraFocusPoints from './Camera/cameraHandler.js';
import { useEffect, useRef } from 'react';

function Scene() {
  const cameraController = useRef();
  const { scene, camera } = useThree();
  const intersectedObjects = useRef([]);

  const renderer = new THREE.WebGLRenderer();

  camera.position.set(3, 13, 8);

  useEffect(() => {
    // Update camera controller parameters to initial values
    cameraController.current.smoothTime = 0.8;
    cameraController.current.setTarget(5, 13, -20);
    cameraController.current.setOrbitPoint(0, 0, 0);
    cameraController.current.moveTo(3, 12, 0, false);
    cameraController.current.truckSpeed = 0;
    cameraController.current.minDistance = Number.EPSILON;
    cameraController.current.maxDistance = 10;
  }, []);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const loadingManager = new THREE.LoadingManager();

  loadingManager.onLoad = () => {
    // ALLOW USER TO ENTER THE SCENE once all models are loaded
    animate();
  };

  const loader = new GLTFLoader(loadingManager);
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/decoders/');
  loader.setDRACOLoader(dracoLoader);

  // Load => Room Shell Model
  loader.load('/models/RoomShell.gltf', (gltf) => {
    const roomShell = gltf.scene;
    scene.add(roomShell);
  });

  // Load => Room Decoration Model
  loader.load('/models/RoomDecoration.gltf', (gltf) => {
    const roomDecoration = gltf.scene;
    scene.add(roomDecoration);
  });

  // Load => Room TV Model
  loader.load('/models/RoomTV.gltf', (gltf) => {
    const retroTV = gltf.scene;
    scene.add(retroTV);
    retroTV.name = 'retroTV';
    retroTV.userData.isContainer = true;
    intersectedObjects.current.push(retroTV);
  });

  // Load => Room Radio Model
  loader.load('/models/RoomRadio.gltf', (gltf) => {
    const radio = gltf.scene;
    scene.add(radio);
    radio.name = 'radio';
    radio.userData.isContainer = true;
    intersectedObjects.current.push(radio);
  });

  // Load => Room Computer Model
  loader.load('/models/RetroComputer.gltf', (gltf) => {
    const retroComputer = gltf.scene;
    scene.add(retroComputer);
    retroComputer.name = 'retroComputer';
    retroComputer.userData.isContainer = true;
    intersectedObjects.current.push(retroComputer);
  });

  // Add lights to scene
  addLightsToScene(scene);

  // Add camera focus points
  addCameraFocusPoints(camera, cameraController, intersectedObjects);

  function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
  }

  renderer.render(scene, camera);

  return (
    <CameraControls ref={ cameraController }> </CameraControls>
  );
};

export default function Home() {
  return (
    <Canvas style={{height: '100vh'}}>
      <Scene />
    </Canvas>
  )
}
