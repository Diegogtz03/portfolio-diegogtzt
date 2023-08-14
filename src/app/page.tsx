'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { PointLight } from 'three'
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { useState, useEffect, useRef, Suspense } from 'react'

const Scene = () => {
  const { scene, camera } = useThree();
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  // const intersectedObjects = useRef([]);

  const renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const loadingManager = new THREE.LoadingManager();

  // loadingManager.onProgress = (url, loaded, total) => {
  //   setLoadingPercentage((loaded / total) * 100);
  // };

  loadingManager.onLoad = () => {
    console.log('LOADED!');
    // setSceneLoaded(true);
  };

  const loader = new GLTFLoader(loadingManager);

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/decoders/');
  loader.setDRACOLoader(dracoLoader);

  // const raycaster = new THREE.Raycaster();
  // const mouse = new THREE.Vector2();


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
    // intersectedObjects.current.push(retroTV);
  });

  // Load => Room Radio Model
  loader.load('/models/RoomRadio.gltf', (gltf) => {
    const radio = gltf.scene;
    scene.add(radio);
    // intersectedObjects.current.push(radio);
  });

  // Load => Room Computer Model
  loader.load('/models/RetroComputer.gltf', (gltf) => {
    const retroComputer = gltf.scene;
    scene.add(retroComputer);
    // intersectedObjects.current.push(retroComputer);
  });

  
  // SCENE LIGHTS 
  const ceilingLight1 = new PointLight(0xFFECD4, 0.05, 100);
  ceilingLight1.position.set(-16.195, 23.247, -0.209);
  scene.add(ceilingLight1);

  const ceilingLight2 = new PointLight(0xFFECD4, 0.05, 100);
  ceilingLight2.position.set(17.772, 23.247, -0.176);
  scene.add(ceilingLight2);

  const lampLight = new PointLight(0xFFFCF9, 0.05, 50);
  lampLight.position.set(-1.862, 19.715, -19.263);
  lampLight.castShadow = true;
  scene.add(lampLight);

  const lavaLampLight = new PointLight(0x66F5FF, 0.05, 50);
  lavaLampLight.position.set(20.106, 13.306, -17.307);
  scene.add(lavaLampLight);

  const ceilingLight = new THREE.RectAreaLight(0xFFECD4, 0.01, 70, 39);
  ceilingLight.position.set( 0, 24.2, 0 );
  ceilingLight.lookAt( 0, 50, 0 );
  scene.add( ceilingLight )

  // CLOSET LIGHT
  // const closetLight = new THREE.RectAreaLight(0xFFEAD6, 8, 6, 6);
  // closetLight.position.set( -24.192, 37.925, -36.484 );
  // closetLight.castShadow = true;
  // closetLight.lookAt( -24.226, 0.938, -13.679 );
  // scene.add( closetLight )

  // const closetLightHelper = new RectAreaLightHelper( closetLight );
  // closetLight.add( closetLightHelper );

  // CLOSET LIGHT
  // const closetLight = new THREE.SpotLight(0xFFEAD6, 0.5, 100, Math.PI / 4, 0.5, 1);
  // closetLight.position.set(-45.192, 37.925, -36.484);
  // closetLight.lookAt(-24.226, 0.938, -13.679);
  // closetLight.castShadow = true;
  // scene.add( closetLight );


  // const handleMouseMove = (event) => {
  //   const { clientX, clientY } = event;
  //   const rect = event.target.getBoundingClientRect();
  //   mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  //   mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

  //   raycaster.setFromCamera(mouse, camera);

  //   const intersects = raycaster.intersectObjects(intersectedObjects.current);

  //   if (intersects.length > 0) {
  //     const intersectObject = intersects[0].object;
  //     const targetPosition = new THREE.Vector3();
  //     intersectObject.getWorldPosition(targetPosition);

  //     camera.position.lerp(targetPosition, 0.1);
  //     camera.lookAt(targetPosition);
  //   }
  // }

  // useEffect(() => {
  //   window.addEventListener('mousemove', handleMouseMove);

  //   return () => {
  //     window.removeEventListener('mousemove', handleMouseMove);
  //   };
  // }, [camera]);

  renderer.render(scene, camera);

  return null;
};


export default () => (
  <Canvas style={{height: '100vh'}}>
    <Scene />
    <OrbitControls />
  </Canvas>
);