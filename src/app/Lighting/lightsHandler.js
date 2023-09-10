import * as THREE from 'three';
import { PointLight } from 'three'
import * as TWEEN from '@tweenjs/tween.js'

// State Variables
var sceneLights = {};
const LIGHT_TRANSITION_TIME = 1500;
const roomLightNames = ["ceilingLight1", "ceilingLight2", "lampLight", "lavaLampLight", "ceilingLight"];

// Function to add lights to the scene
// Each light is added to the scene and stored in the sceneLights object to be used as a reference when lights are off
export default function addLightsToScene(scene) {
  // Ceiling Light 1
  const ceilingLight1 = new PointLight(0xFFECD4, 0.07, 100, 0.05);
  ceilingLight1.position.set(-16.195, 23.247, -0.209);
  scene.add(ceilingLight1);
  sceneLights["ceilingLight1"]= {"light": ceilingLight1, "intensity": 0.07};

  // Ceiling Light 2
  const ceilingLight2 = new PointLight(0xFFECD4, 0.07, 100, 0.05);
  ceilingLight2.position.set(17.772, 23.247, -0.176);
  scene.add(ceilingLight2);
  sceneLights["ceilingLight2"] = {"light": ceilingLight2, "intensity": 0.07};

  // Lamp Light
  const lampLight = new PointLight(0xFFFCF9, 0.08, 50, 0);
  lampLight.position.set(-1.862, 19.715, -19.263);
  lampLight.castShadow = true;
  scene.add(lampLight);
  sceneLights["lampLight"] = {"light": lampLight, "intensity": 0.08};

  // Lava Lamp Light
  const lavaLampLight = new PointLight(0x66F5FF, 0.1, 50, 0.3);
  lavaLampLight.position.set(20.106, 13.306, -17.307);
  scene.add(lavaLampLight);
  sceneLights["lavaLampLight"] = {"light": lavaLampLight, "intensity": 0.1};

  // Ceiling Light (Rectangular)
  const ceilingLight = new THREE.RectAreaLight(0xFFECD4, 0.02, 71.4, 43);
  ceilingLight.position.set( 0, 25.35, 0 );
  ceilingLight.lookAt( 0, 50, -0.07 );
  scene.add( ceilingLight )
  sceneLights["ceilingLight"] = {"light": ceilingLight, "intensity": 0.02};


  // RADIO FOCUS LIGHT -> Only to be used when radio is focused on
  const radioLight = new THREE.SpotLight(0xFFECD4, 0, 12.8, Math.PI / 6, 0.1, 0.05);
  radioLight.position.set(3, 14.715, -8.263);
  radioLight.target.position.set(1, 7.315, -19.263);
  scene.add( radioLight.target )
  scene.add( radioLight );
  sceneLights["radioLight"] = {"light": radioLight, "intensity": 8};


  // TV FOCUS LIGHT -> Only to be used when TV is focused on
  const tvLight = new THREE.SpotLight(0xFFECD4, 0, 16, Math.PI / 8, 0.1, 0.05);
  tvLight.position.set(-17.195, 17.247, 15);
  tvLight.target.position.set(-20, 15.8, 15);
  scene.add( tvLight.target )
  scene.add( tvLight );
  sceneLights["tvLight"] = {"light": tvLight, "intensity": 7};


  // COMPUTER FOCUS LIGHT -> Only to be used when computer is focused on
  const computerLight = new THREE.SpotLight(0xFFECD4, 0, 12, Math.PI / 7, 0.1, 0.05);
  computerLight.position.set(29.106, 18.306, -8.307);
  computerLight.target.position.set(29.606, 9.8, -17.307);
  scene.add( computerLight.target )
  scene.add( computerLight );
  sceneLights["computerLight"] = {"light": computerLight, "intensity": 5};
}

// Function to focus lights on a specific object
export function focusLight(state, lightName) {
  // Get the light object
  let selectedLight = sceneLights[lightName];

  // Create a tween to animate the light
  var lightAnimator = new TWEEN.Tween(selectedLight.light)

  // Animate the light
  if (state == "on") {
    lightAnimator.to({intensity: selectedLight.intensity}, LIGHT_TRANSITION_TIME).start()
    roomLightsToggle("off");
  } else {
    lightAnimator.to({intensity: 0}, LIGHT_TRANSITION_TIME).start()
    roomLightsToggle("on");
  }
}

// Function to toggle the room lights
function roomLightsToggle(state) {
  let selectedLight;
  var lightAnimator;

  // Animate the light
  if (state == "on") {
    roomLightNames.forEach(lightName => {
      selectedLight = sceneLights[lightName];
      lightAnimator = new TWEEN.Tween(selectedLight.light)
      // use stored intensity value to return to original intensity
      lightAnimator.to({intensity: selectedLight.intensity}, LIGHT_TRANSITION_TIME).start()
    });
  } else {
    roomLightNames.forEach(lightName => {
      selectedLight = sceneLights[lightName];
      lightAnimator = new TWEEN.Tween(selectedLight.light)
      lightAnimator.to({intensity: 0}, LIGHT_TRANSITION_TIME).start()
    });
  }
}