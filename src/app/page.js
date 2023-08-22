'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, SpotLight } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { PointLight } from 'three'
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

function Scene() {
  const { scene, camera } = useThree();
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
  const ceilingLight1 = new PointLight(0xFFECD4, 0.07, 100, 0.05);
  ceilingLight1.position.set(-16.195, 23.247, -0.209);
  scene.add(ceilingLight1);

  const ceilingLight2 = new PointLight(0xFFECD4, 0.07, 100, 0.05);
  ceilingLight2.position.set(17.772, 23.247, -0.176);
  scene.add(ceilingLight2);

  const lampLight = new PointLight(0xFFFCF9, 0.08, 50, 0);
  lampLight.position.set(-1.862, 19.715, -19.263);
  lampLight.castShadow = true;
  scene.add(lampLight);

  const lavaLampLight = new PointLight(0x66F5FF, 0.1, 50, 0.3);
  lavaLampLight.position.set(20.106, 13.306, -17.307);
  scene.add(lavaLampLight);

  const ceilingLight = new THREE.RectAreaLight(0xFFECD4, 0.02, 71.4, 43);
  ceilingLight.position.set( 0, 25.35, 0 );
  ceilingLight.lookAt( 0, 50, -0.07 );
  scene.add( ceilingLight )


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



  // RADIO LIGHT -> Only to be used when radio is focused on
  const radioLight = new THREE.SpotLight(0xFFECD4, 8, 12.8, Math.PI / 6, 0.1, 0.05);
  radioLight.position.set(3, 14.715, -8.263);
  const radioLightHelper = new THREE.SpotLightHelper( radioLight );
  radioLight.target.position.set(1, 7.315, -19.263);
  scene.add( radioLight.target )
  scene.add( radioLightHelper );
  scene.add( radioLight );
  if (radioLightHelper) radioLightHelper.update();


  // TV LIGHT -> Only to be used when TV is focused on
  const tvLight = new THREE.SpotLight(0xFFECD4, 7, 16, Math.PI / 8, 0.1, 0.05);
  tvLight.position.set(-17.195, 17.247, 15);
  const tvLightHelper = new THREE.SpotLightHelper( tvLight );
  tvLight.target.position.set(-20, 15.8, 15);
  scene.add( tvLight.target )
  scene.add( tvLightHelper );
  scene.add( tvLight );
  if (tvLightHelper) tvLightHelper.update();


  // COMPUTER LIGHT -> Only to be used when computer is focused on
  const computerLight = new THREE.SpotLight(0xFFECD4, 5, 12, Math.PI / 7, 0.1, 0.05);
  computerLight.position.set(29.106, 18.306, -8.307);
  const computerLightHelper = new THREE.SpotLightHelper( computerLight );
  computerLight.target.position.set(29.606, 9.8, -17.307);
  scene.add( computerLight.target )
  scene.add( computerLightHelper );
  scene.add( computerLight );
  if (computerLightHelper) computerLightHelper.update();

  renderer.render(scene, camera);

  return null;
};

export default function Home() {
  return (
    <Canvas style={{height: '100vh'}}>
      <Scene />
      <OrbitControls />
    </Canvas>
  )
}
