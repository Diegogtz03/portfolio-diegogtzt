import * as THREE from 'three';
import { useEffect } from 'react';
import { focusLight } from '../Lighting/lightsHandler.js';

// State Variables
var raycastEnabled = true;
var mouseLookAt = false;
var mouseLookAtHelper = false;

// Transition Variables
var transtionStarted = false;
var isFocusingOut = false;
var currentFocusedObject = null;

// Rotation Handling Variables
var currentAzimuthAngle = 0;
var currentPolarAngle = 0;
const ROTATION_REDUCTION_X = 0.2;
const ROTATION_REDUCTION_Y = 0.2;

// Function to add camera focus points to the models on the scene
export default function addCameraFocusPoints(camera, cameraController, intersectedObjects) {
  // Initialize raycaster and mouse
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Add event listener to handle mouse movement
  const handleMouseMove = (event) => {
    // Get accurate mouse position
    const { clientX, clientY } = event;
    const rect = event.target.getBoundingClientRect();
    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    // Rotate camera to mouse position
    if (mouseLookAt) {
      // Reduce rotation speed
      let targetX = (mouse.x * ROTATION_REDUCTION_X) * Math.PI / 2;
      let targetY = (mouse.y * ROTATION_REDUCTION_Y) * Math.PI;

      // Rotate camera
      cameraController.current.rotateTo(currentAzimuthAngle + targetX, currentPolarAngle + targetY, true);

      // Check if mouse is at the edge of the screen with a radius of EDGE_RADIUS
      // If mouse at edge, return to original position
      const EDGE_RADIUS = 0.1;
      if (mouse.x > 1 - EDGE_RADIUS || mouse.x < -1 + EDGE_RADIUS || mouse.y > 1 - EDGE_RADIUS || mouse.y < -1 + EDGE_RADIUS) {
        mouseLookAt = false;
        mouseLookAtHelper = false;
        isFocusingOut = true;
        transtionStarted = true;

        // Reset all parameters
        unfocusObject(cameraController)
      }
    }

    // Check if raycaster is enabled, if not, return
    if (!raycastEnabled) return;

    // Check if mouse is over an object
    raycaster.setFromCamera(mouse, camera);
    raycaster.firstHitOnly = true;

    // Get intersected objects
    const intersects = raycaster.intersectObjects(intersectedObjects.current);

    // If mouse is over an object, focus on it with focusOnObject()
    if (intersects.length > 0) {
      const intersectObject = getContainerObjByChild(intersects[0].object);
      focusOnObject(camera, cameraController, intersectObject.name);
    }
  }

  useEffect(() => {
    // Add event listener to handle mouse movement
    window.addEventListener('mousemove', handleMouseMove);

    // Listener to check if camera is done moving
    cameraController.current.addEventListener('rest', () => {
      // Check if transition is in progress
      if (transtionStarted) {
        // Check if user is focusing out (Edge of screen)
        if (!isFocusingOut) {
          // Check if user is focusing on an object
          if (mouseLookAtHelper) {
            // Update current rotation
            updateCurrentRotation(cameraController);
            mouseLookAt = true;
          }
        } else {
          // Reset all parameters (Edge of screen)
          raycastEnabled = true;
          isFocusingOut = false;
          transtionStarted = false;
          mouseLookAtHelper = false;
        }

        // Reset parameter (Transition is done)
        transtionStarted = false;
      }
    });

    // Listener to check if user is interacting with controls
    cameraController.current.addEventListener('controlstart', () => {
      mouseLookAt = false;
    });

    // Listener to check when user is done interacting with controls
    cameraController.current.addEventListener('controlend', () => {
      if (mouseLookAtHelper) {
        mouseLookAt = true;
        updateCurrentRotation(cameraController);
      }
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera]);
}

// Function to get the container object of a child object
function getContainerObjByChild(child) {
  if (child.userData.isContainer) {
    return child
  } else if (child.parent != null) {
    return getContainerObjByChild(child.parent)
  } else {
    return null
  }
}

// Function to focus on an object
function focusOnObject(camera, cameraController, objectName) {
  // Disable raycaster
  raycastEnabled = false;
  currentFocusedObject = objectName;

  if (objectName == "retroTV") {
    // TV Camera Position
    cameraController.current.setPosition(-18.195, 14.247, 16, true);
    cameraController.current.setTarget(-20, 13.7, 16.2, true);
    focusLight("on", "tvLight");

    // Limit camera movement
    cameraController.current.minDistance = 2;
    cameraController.current.maxDistance = 7;

    // Limit camera rotation
    cameraController.current.minAzimuthAngle = cameraController.current.azimuthAngle;
    cameraController.current.maxAzimuthAngle = cameraController.current.azimuthAngle + (Math.PI / 3);
    cameraController.current.minPolarAngle = -Math.PI / 2;
    cameraController.current.maxPolarAngle = Math.PI / 2;

    mouseLookAtHelper = true;
    updateCurrentRotation(cameraController);

    transtionStarted = true;
  } else if (objectName == "retroComputer") {
    // Computer Camera Position
    cameraController.current.setPosition(28.506, 12.506, -9.807, true);
    cameraController.current.setTarget(29.806, 11.8, -17.307, true);
    focusLight("on", "computerLight");

    // Limit camera movement
    cameraController.current.minDistance = 3;
    cameraController.current.maxDistance = 10;

    // Limit camera rotation
    cameraController.current.minAzimuthAngle = cameraController.current.azimuthAngle - (Math.PI / 6);
    cameraController.current.maxAzimuthAngle = cameraController.current.azimuthAngle + (Math.PI / 6);
    cameraController.current.minPolarAngle = -Math.PI / 2;
    cameraController.current.maxPolarAngle = Math.PI / 2;

    mouseLookAtHelper = true;
    updateCurrentRotation(cameraController);

    transtionStarted = true;
  } else {
    // Radio Camera Position
    cameraController.current.setPosition(3, 14.715, -10.263, true);
    cameraController.current.setTarget(1, 7.315, -19.263, true);
    focusLight("on", "radioLight");

    // Limit camera movement
    cameraController.current.minDistance = 9;
    cameraController.current.maxDistance = 15;

    // Limit camera rotation
    cameraController.current.minAzimuthAngle = -Math.PI / 2;
    cameraController.current.maxAzimuthAngle = Math.PI / 2;
    cameraController.current.minPolarAngle = -Math.PI / 2;
    cameraController.current.maxPolarAngle = Math.PI / 3;

    mouseLookAtHelper = true;
    updateCurrentRotation(cameraController);

    transtionStarted = true;
  }
}

function unfocusObject(cameraController) {
  // Reset camera position
  cameraController.current.smoothTime = 0.8;
  cameraController.current.moveTo(3, 12, 0, true);

  // Re-enable camera movement
  cameraController.current.minDistance = Number.EPSILON;
  cameraController.current.maxDistance = 10;

  // Re-enable camera rotation
  cameraController.current.minAzimuthAngle = -Infinity;
  cameraController.current.maxAzimuthAngle = Infinity;
  cameraController.current.minPolarAngle = -Infinity;
  cameraController.current.maxPolarAngle = Infinity;

  // Re-enable main lights and turn off focus light
  if (currentFocusedObject == "retroTV") {
    focusLight("off", "tvLight");
  } else if (currentFocusedObject == "retroComputer") {
    focusLight("off", "computerLight");
  } else {
    focusLight("off", "radioLight");
  }

  return;
}

// Function to update current rotation target
function updateCurrentRotation(cameraController) {
  currentAzimuthAngle = cameraController.current.azimuthAngle;
  currentPolarAngle = cameraController.current.polarAngle;
}