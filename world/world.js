const container = document.querySelector(".tab[data-tab='world'] > .container");
const debug = document.getElementById("world-debug");
const world = document.getElementById("world");
const camera = document.getElementById("world-camera");
const mouseSensitivity = document.getElementById("mouse-sensitivity");
const playerSpeed = document.getElementById("player-speed");
const perspective = document.getElementById("perspective");
const valueMS = document.getElementById("value-ms");
const valueSpeed = document.getElementById("value-speed");
const valuePerspective = document.getElementById("value-perspective");
const playerData = {
  position: {
    x: 0,
    y: 0,
    z: -100
  },
  rotation: {
    pitch: 0,
    yaw: 0,
    roll: 0
  },
  height: 30,
  mouseSensitivity: 0.25,
  speed: 2.5,
  perspective: 300
};
const keyBindings = {
  left: false,
  right: false,
  forward: false,
  backward: false,
  up: false,
  down: false,
  crouch: false
}
let animationHandle = null;
let elapsed = 0;
let prevTimestamp = 0;
let lastKey = null;

function setMouseSensitivity() {
  playerData.mouseSensitivity = parseFloat(mouseSensitivity.value || 0.05);

  valueMS.textContent = `(${playerData.mouseSensitivity})`;
}

function setPlayerSpeed() {
  playerData.speed = parseFloat(playerSpeed.value || 0.25);

  valueSpeed.textContent = `(${playerData.speed})`;
}

function setPerspective() {
  playerData.perspective = parseFloat(perspective.value || 100);
  container.style.perspective = `${playerData.perspective}px`;

  console.log(container.style.perspective);

  valuePerspective.textContent = `(${playerData.perspective})`;
}

function updateDebugInfo() {
  debug.innerHTML = `Mouse: (${playerData.rotation.yaw}, ${playerData.rotation.pitch}), MS: ${mouseSensitivity.value}, PS: ${playerData.speed}<br />Position: (${playerData.position.x}, ${playerData.position.y}, ${playerData.position.z})<br />Last key: ${lastKey}<br />Elapsed: ${elapsed}`;
}

function updatePlayer() {
  const cosSpeed = Math.cos(playerData.rotation.yaw * (Math.PI / 180)) * playerData.speed;
  const sinSpeed = Math.sin(playerData.rotation.yaw * (Math.PI / 180)) * playerData.speed

  if (keyBindings.left) {
    playerData.position.x += cosSpeed;
    playerData.position.z += sinSpeed;
  }

  if (keyBindings.right) {
    playerData.position.x -= cosSpeed;
    playerData.position.z -= sinSpeed;
  }

  if (keyBindings.forward) {
    playerData.position.x -= sinSpeed;
    playerData.position.z += cosSpeed;
  }

  if (keyBindings.backward) {
    playerData.position.x += sinSpeed;
    playerData.position.z -= cosSpeed;
  }

  if (keyBindings.up) {
    playerData.position.y -= playerData.speed;
  }

  if (keyBindings.down) {
    playerData.position.y += playerData.speed;
  }

  if (keyBindings.crouch) {
    playerData.height = 20;
  }
  else {
    playerData.height = 30;
  }
}

function mouseMoveEvent(event) {
  const rx = event.movementX;
  const ry = event.movementY;
  const ms = mouseSensitivity.value;

  playerData.rotation.yaw += (rx * ms);
  playerData.rotation.pitch = Math.min(Math.max(playerData.rotation.pitch - (ry * ms), -90), 90);

  if (playerData.rotation.yaw < 0) {
    playerData.rotation.yaw += 360;
  }
  else if (playerData.rotation.yaw > 360) {
    playerData.rotation.yaw -= 360;
  }
}

function keyEvent(event) {
  if (event.repeat) {
    return;
  }

  switch (event.key) {
    case "a":
      keyBindings.left = event.type === "keydown";
      break;
    case "d":
      keyBindings.right = event.type === "keydown";
      break;
    case "w":
      keyBindings.forward = event.type === "keydown";
      break;
    case "s":
      keyBindings.backward = event.type === "keydown";
      break;
    case "Shift":
      keyBindings.crouch = event.type === "keydown";
      break;
    case "c":
      keyBindings.up = event.type === "keydown";
      break;
    case " ":
      keyBindings.down = event.type === "keydown";
      break;
  }

  if (event.type === "keydown") {
    lastKey = event.key;
  }
}

function setPointerLock() {
  container.requestPointerLock();
}

function checkPointerLock() {
  if (document.pointerLockElement !== null) {
    document.addEventListener("mousemove", mouseMoveEvent);
    document.addEventListener("keydown", keyEvent);
    document.addEventListener("keyup", keyEvent);

    animationHandle = requestAnimationFrame(animationCallback);
  }
  else {
    document.removeEventListener("mousemove", mouseMoveEvent);
    document.removeEventListener("keydown", keyEvent);
    document.removeEventListener("keyup", keyEvent);

    cancelAnimationFrame(animationHandle);
    animationHandle = null;
  }
}

function animationCallback(timestamp) {
  elapsed = timestamp - prevTimestamp;

  updateDebugInfo();
  updatePlayer();

  world.style.transform = `translate3d(${playerData.position.x}px, ${playerData.position.y + playerData.height}px, ${playerData.position.z + playerData.perspective}px)`;
  camera.style.transform = `translateZ(${playerData.perspective}px) rotateX(${playerData.rotation.pitch}deg) rotateY(${playerData.rotation.yaw}deg)`;

  prevTimestamp = timestamp;

  if (document.pointerLockElement !== null) {
    requestAnimationFrame(animationCallback);
  }
}

mouseSensitivity.addEventListener("change", setMouseSensitivity);
playerSpeed.addEventListener("change", setPlayerSpeed);
perspective.addEventListener("change", setPerspective);
container.addEventListener("click", setPointerLock);
document.addEventListener("pointerlockchange", checkPointerLock);