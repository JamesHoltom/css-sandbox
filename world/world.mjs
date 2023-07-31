import InputList from "../utility/inputs.mjs";
import KeyBindings from "../utility/keybinds.mjs";
import TabList from "../utility/tabs.mjs";
import MapNode from "./mapnode.mjs";

const World = (function() {
  // HTML Elements
  const container = document.querySelector(".tab[data-tab='world'] > .container");
  const editor = document.getElementById("world-edit");
  const world = document.getElementById("world");
  const camera = document.getElementById("world-camera");
  const debug = document.getElementById("world-debug");
  const inputs = new InputList("world", 
    ["tx", 0], ["ty", 0], ["tz", 0],
    ["rx", 0], ["ry", 0], ["rz", 0],
    ["texture", ""],
    ["cr", 255], ["cg", 255], ["cb", 255], ["ca", 255],
    ["ms", 0.25], ["perspective", 300, setPerspective]
  );
  const keyBindings = new KeyBindings(
    ["left", "a"],
    ["right", "d"],
    ["forward", "w"],
    ["backward", "s"],
    ["up", " "],
    ["down", "c"],
    ["crouch", "Shift"]
  );
  const tabs = new TabList(
    [ "play", () => {}, () => {} ],
    [ "view", () => {}, () => {} ],
    [
      "edit",
      () => {
        world.dataset.editing = true;
        editor.style.display = "block";
      },
      () => {
        delete world.dataset.editing;
        editor.style.display = "none";
      }
    ]
  );
  const rootNode = new MapNode("root", world);
  
  // World Data
  const playerData = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    height: { stand: 50, crouch: 30 },
    speed: 2.5
  };
  let animationHandle = null;
  let elapsed = 0;
  let prevTimestamp = 0;

  function setPerspective(value) {
    container.style.perspective = `${value}px`;
    updateWorld();
  }

  function updateDebugInfo() {
    const ms = inputs.getValue("ms");
    const perspective = inputs.getValue("perspective");
    debug.innerHTML = `Mouse: (${playerData.rotation.y}, ${playerData.rotation.x}), MS: ${ms}, PS: ${playerData.speed}, P: ${perspective}<br />Position: (${playerData.position.x}, ${playerData.position.y}, ${playerData.position.z})<br />Last key: ${keyBindings.lastKey}<br />Elapsed: ${elapsed}`;
  }

  function updateWorld() {
    const perspective = inputs.getValue("perspective");
    camera.style.transform = `translate3d(0, 0, ${perspective}px) rotateX(${playerData.rotation.x}deg) rotateY(${playerData.rotation.y}deg)`;
    world.style.transform = `translate3d(${playerData.position.x}px, ${playerData.position.y + playerData.height}px, ${playerData.position.z}px)`;
  }
  
  function updatePlayer() {
    const cosSpeed = Math.cos(playerData.rotation.y * (Math.PI / 180)) * playerData.speed;
    const sinSpeed = Math.sin(playerData.rotation.y * (Math.PI / 180)) * playerData.speed
  
    if (keyBindings.getAction("left")) {
      playerData.position.x += cosSpeed;
      playerData.position.z += sinSpeed;
    }
  
    if (keyBindings.getAction("right")) {
      playerData.position.x -= cosSpeed;
      playerData.position.z -= sinSpeed;
    }
  
    if (keyBindings.getAction("forward")) {
      playerData.position.x -= sinSpeed;
      playerData.position.z += cosSpeed;
    }
  
    if (keyBindings.getAction("backward")) {
      playerData.position.x += sinSpeed;
      playerData.position.z -= cosSpeed;
    }
  
    if (keyBindings.getAction("up")) {
      playerData.position.y += playerData.speed;
    }
  
    if (keyBindings.getAction("down")) {
      playerData.position.y -= playerData.speed;
    }
  
    if (keyBindings.getAction("crouch")) {
      playerData.height = 20;
    }
    else {
      playerData.height = 30;
    }
  }
  
  function mouseMoveEvent(event) {
    const rx = event.movementX;
    const ry = event.movementY;
    const ms = inputs.getValue("ms");
  
    playerData.rotation.y += (rx * ms);
    playerData.rotation.x = Math.min(Math.max(playerData.rotation.x - (ry * ms), -90), 90);
  
    if (playerData.rotation.y < 0) {
      playerData.rotation.y += 360;
    }
    else if (playerData.rotation.y > 360) {
      playerData.rotation.y -= 360;
    }
  }
  
  function setPointerLock() {
    container.requestPointerLock();
  }
  
  function checkPointerLock() {
    if (document.pointerLockElement !== null) {
      document.addEventListener("mousemove", mouseMoveEvent);
      
      animationHandle = requestAnimationFrame(animationCallback);
      keyBindings.enabled = true;
    }
    else {
      document.removeEventListener("mousemove", mouseMoveEvent);
  
      cancelAnimationFrame(animationHandle);
      keyBindings.enabled = false;
      animationHandle = null;
    }
  }
  
  function animationCallback(timestamp) {
    elapsed = timestamp - prevTimestamp;
  
    updateDebugInfo();
    updateWorld();
    updatePlayer();
  
    prevTimestamp = timestamp;
  
    if (document.pointerLockElement !== null) {
      requestAnimationFrame(animationCallback);
    }
  }
  
  function init() {
    container.addEventListener("click", setPointerLock);
    document.addEventListener("pointerlockchange", checkPointerLock);
    setPerspective(300);
    updateWorld();

    rootNode.addFace("ground");
  }

  return {
    init
  }
})();

World.init();
