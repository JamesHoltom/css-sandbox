import InputList from "../utility/inputs.mjs";
import KeyBindings from "../utility/keybinds.mjs";
import TabList from "../utility/tabs.mjs";
import { addRootNode, createElems, resetNodeMap } from "./mapnode.mjs";

const World = (function() {
  // HTML Elements
  const container = document.querySelector(".tab[data-tab='world'] > .container");
  const pauseScreen = document.getElementById("world-pause");
  const editor = document.getElementById("world-edit");
  const nodeMap = document.getElementById("world-nodemap");
  const saveload = document.getElementById("world-saveload");
  const world = document.getElementById("world");
  const camera = document.getElementById("world-camera");
  const debug = document.getElementById("world-debug");
  const saveData = document.getElementById("world-savedata");
  const saveBtn = document.getElementById("world-save");
  const loadBtn = document.getElementById("world-load");
  const resetBtn = document.getElementById("world-reset");
  const keyBindings = new KeyBindings(
    ["left", "a"],
    ["right", "d"],
    ["forward", "w"],
    ["backward", "s"],
    ["up", " "],
    ["down", "c"]
  );
  const inputs = new InputList("world", 
    ["ms", 0.25],
    ["perspective", 300, false, setPerspective],
    ["speed", 1.5, false, setPlayerSpeed]
  );
  const tabs = new TabList(
    [
      "play",
      () => {
        container.addEventListener("click", setPointerLock);
        document.addEventListener("pointerlockchange", checkPointerLock);
        debug.style.display = "block";
        pauseScreen.style.display = "flex";
      },
      () => {
        container.removeEventListener("click", setPointerLock);
        document.removeEventListener("pointerlockchange", checkPointerLock);
        debug.style.display = "none";
        pauseScreen.style.display = "none";
      }
    ],
    [
      "edit",
      () => {
        document.addEventListener("mousemove", mouseMoveEvent);
        world.dataset.editing = true;
        editor.style.display = "block";
      },
      () => {
        document.removeEventListener("mousemove", mouseMoveEvent);
        delete world.dataset.editing;
        editor.style.display = "none";
      }
    ],
    [
      "saveload",
      () => {
        saveload.style.display = "block";
      },
      () => {
        saveload.style.display = "none";
      }
    ]
  );
  
  // World Data
  const playerData = {
    position: { x: 0, y: 0, z: -50 },
    rotation: { x: 0, y: 0, z: 0 },
    speed: 2.5
  };
  let animationHandle = null;
  let elapsed = 0;
  let prevTimestamp = 0;

  function setPlayerSpeed(value) {
    playerData.speed = value;
  }

  function setPerspective(value) {
    container.style.perspective = `${value}px`;
    updateWorld();
  }

  function updateDebugInfo() {
    const ms = inputs.getValue("ms");
    const perspective = inputs.getValue("perspective");
    debug.innerHTML = `Mouse: (${playerData.rotation.y}, ${playerData.rotation.x}), MS: ${ms}, P: ${perspective}<br />Position: (${playerData.position.x}, ${playerData.position.y}, ${playerData.position.z})<br />Last key: ${keyBindings.lastKey}<br />Elapsed: ${elapsed}`;
  }

  function updateWorld() {
    const perspective = inputs.getValue("perspective");
    camera.style.transform = `translate3d(0, 0, ${perspective}px) rotateX(${playerData.rotation.x}deg) rotateY(${playerData.rotation.y}deg)`;
    world.style.transform = `translate3d(${playerData.position.x}px, ${playerData.position.y}px, ${playerData.position.z}px)`;
  }
  
  function updatePlayer() {
    const moveSpeed = inputs.getValue("speed");
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
  }
  
  function mouseMoveEvent(event) {
    if (tabs.currentTab == "edit" && event.buttons & 1 !== 1) {
      return;
    }

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
      pauseScreen.style.display = "none";
    }
    else {
      document.removeEventListener("mousemove", mouseMoveEvent);
  
      cancelAnimationFrame(animationHandle);
      keyBindings.enabled = false;
      animationHandle = null;
      pauseScreen.style.display = "flex";
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

  function saveWorld() {
    function serialiseNode(node) {
      const nodeData = JSON.parse(node.dataset.nodeData);
      const data = {
        id: node.dataset.nodeId,
        type: node.dataset.nodeType,
        ...nodeData,
        children: []
      };

      for (const childNode of node.children) {
        data.children.push(serialiseNode(childNode));
      }

      return data;
    }

    const rootNode = document.querySelector('#world-nodemap .world-node[data-node-id="0"]');

    saveData.value = JSON.stringify(serialiseNode(rootNode));
  }

  function loadWorld() {
    function deserialiseNode(worldParent, listParent, data) {
      const [ world, list ] = createElems(worldParent, listParent, data.type, data);

      for (const childData of data.children) {
        deserialiseNode(world, list, childData);
      }
    }

    try {
      const data = JSON.parse(saveData.value);

      resetNodeMap();
      deserialiseNode(world, nodeMap, data);
    }
    catch (_) {
      console.error("Invalid data to load!");
    }
  }

  function resetWorld() {
    resetNodeMap();
    addRootNode();
  }
  
  function init() {
    setPerspective(300);
    updateWorld();

    saveBtn.addEventListener("click", saveWorld);
    loadBtn.addEventListener("click", loadWorld);
    resetBtn.addEventListener("click", resetWorld);

    addRootNode();
  }

  return {
    init
  }
})();

World.init();
