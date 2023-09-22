import * as THREE from 'three';
import { AmbientLight } from 'three'
import * as TWEEN from '@tweenjs/tween.js'

// Object to store all the lights in the scene
var sceneLights = {};

// Constants
const LIGHT_TRANSITION_TIME = 1500;
const FOCUS_LIGHT_REST_INTENSITY = 0.1;
const roomLightNames = ["ambientLight"];

// Function to add lights to the scene
// Each light is added to the scene and stored in the sceneLights object to be used as a reference when lights are off
export default function addLightsToScene(scene) {
  // Ambient Light
  const ambientLight = new AmbientLight(0xFFECD4, 0.03);
  scene.add(ambientLight);
  sceneLights["ambientLight"] = {"light": ambientLight, "intensity": 0.03};

  // RADIO FOCUS LIGHT -> Only to be used when radio is focused on
  const radioLight = new THREE.SpotLight(0xFFECD4, FOCUS_LIGHT_REST_INTENSITY, 12.8, Math.PI / 6, 0.1, 0.05);
  radioLight.position.set(3, 14.715, -8.263);
  radioLight.target.position.set(1, 7.315, -19.263);
  scene.add( radioLight.target )
  scene.add( radioLight );
  sceneLights["radioLight"] = {"light": radioLight, "intensity": 8};

  // TV FOCUS LIGHT -> Only to be used when TV is focused on
  const tvLight = new THREE.SpotLight(0xFFECD4, FOCUS_LIGHT_REST_INTENSITY, 16, Math.PI / 8, 0.1, 0.05);
  tvLight.position.set(-17.195, 17.247, 15);
  tvLight.target.position.set(-20, 15.8, 15);
  scene.add( tvLight.target )
  scene.add( tvLight );
  sceneLights["tvLight"] = {"light": tvLight, "intensity": 7};

  // COMPUTER FOCUS LIGHT -> Only to be used when computer is focused on
  const computerLight = new THREE.SpotLight(0xFFECD4, FOCUS_LIGHT_REST_INTENSITY, 12, Math.PI / 7, 0.1, 0.05);
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
    lightAnimator.to({intensity: FOCUS_LIGHT_REST_INTENSITY}, LIGHT_TRANSITION_TIME).start()
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