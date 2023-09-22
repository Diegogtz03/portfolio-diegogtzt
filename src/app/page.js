'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { CameraControls, Stats } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import * as TWEEN from '@tweenjs/tween.js'
import addLightsToScene from '../app/Lighting/lightsHandler.js'
import addCameraFocusPoints from './Camera/cameraHandler.js';
import { useEffect, useRef, useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen.js';
import RadioControls from '@/components/RadioControls.js';

function Scene({ setIsDoneLoading }) {
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

  const loadingManager = new THREE.LoadingManager();

  // Create video texture for TV
  const tvVideo = document.getElementById('tvVideo');
  const tvVideoTexture = new THREE.VideoTexture(tvVideo);
  tvVideoTexture.colorSpace = THREE.SRGBColorSpace;
  tvVideoTexture.generateMipmaps = true;

  // Create video texture for Computer
  const monitorVideo = document.getElementById('monitorVideo');
  const monitorVideoTexture = new THREE.VideoTexture(monitorVideo);
  monitorVideoTexture.colorSpace = THREE.SRGBColorSpace;
  monitorVideoTexture.generateMipmaps = true;

  // Set up loading manager on load
  loadingManager.onLoad = () => {
    setIsDoneLoading(true);
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

    // Traverse through the children to find the screen mesh (where the video will be displayed)
    let tvScreenMesh;

    retroTV.traverse((child) => {
      if (child.name === 'defaultMaterial005') {
        tvScreenMesh = child;
      }
    });

    // Set the video texture to the screen mesh
    if (tvScreenMesh) {
      const tvScreenMaterial = new THREE.MeshBasicMaterial({ map: tvVideoTexture, side: THREE.FrontSide, toneMapped: false });
      tvScreenMesh.material = tvScreenMaterial;
    }
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

    // Traverse through the children to find the screen mesh (where the video will be displayed)
    let computerScreenMesh;

    retroComputer.traverse((child) => {
      if (child.name === 'Cube_screen_0') {
        computerScreenMesh = child;
      }
    });

    // Set the video texture to the screen mesh
    if (computerScreenMesh) {
      const computerScreenMaterial = new THREE.MeshBasicMaterial({ map: monitorVideoTexture, side: THREE.FrontSide, toneMapped: false });
      computerScreenMesh.material = computerScreenMaterial;
    }
  });

  // Add lights to scene
  addLightsToScene(scene, camera, cameraController);

  // Add camera focus points
  addCameraFocusPoints(camera, cameraController, intersectedObjects);

  function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
  }

  renderer.render(scene, camera);

  return (
    <>
      <Stats />
      <CameraControls ref={ cameraController }> </CameraControls>
    </>
  );
};

export default function Home() {
  const [isDoneLoading, setIsDoneLoading] = useState(false);
  const tvVideoRef = useRef();
  const monitorVideoRef = useRef();
  const musicHandler = useRef();

  return (
    <>
      <RadioControls ref={musicHandler} />
      <video ref={tvVideoRef} id="tvVideo" src="/media/videos/TVvideo.mp4" loop muted></video>
      <video ref={monitorVideoRef} id="monitorVideo" src="/media/videos/MonitorScreen.mp4" loop muted></video>
      <LoadingScreen doneLoading={isDoneLoading} musicHandler={musicHandler} tvVideoRef={tvVideoRef} monitorVideoRef={monitorVideoRef} />
      <Canvas style={{height: '100vh'}}>
        <Scene setIsDoneLoading={setIsDoneLoading} />
      </Canvas>
    </>
  )
}