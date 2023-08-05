import InputList from "../utility/inputs.mjs";

const world = document.getElementById("world");
const nodeMap = document.getElementById("world-nodemap");
const addGroupBtn = document.getElementById("world-add-group");
const addFaceBtn = document.getElementById("world-add-face");
const removeNodeBtn = document.getElementById("world-remove-node");
const deselectNodeBtn = document.getElementById("world-deselect-node");
const inputs = new InputList("nodemap", 
["tx", 0, true, setSelectedNodeData], ["ty", 0, true, setSelectedNodeData], ["tz", 0, true, setSelectedNodeData],
["rx", 0, true, setSelectedNodeData], ["ry", 0, true, setSelectedNodeData], ["rz", 0, true, setSelectedNodeData],
["width", 10, true, setSelectedNodeData], ["height", 10, true, setSelectedNodeData],
["cr", 255, true, setSelectedNodeData], ["cg", 255, true, setSelectedNodeData], ["cb", 255, true, setSelectedNodeData], ["ca", 255, true, setSelectedNodeData]
);
let nextId = 0;
let selectedId = null;

function clickHandler(event) {
  const id = event.target.dataset.nodeId;

  event.stopImmediatePropagation();
  selectNode(id);
}

function setNodeStyle(node, data) {
  const type = node.dataset.nodeType;

  node.style.transform = `translate3d(${data.translation.x}px, ${data.translation.y}px, ${data.translation.z}px) rotateX(${data.rotation.x}deg) rotateY(${data.rotation.y}deg) rotateZ(${data.rotation.z}deg)`;

  if (type === "group") {
    node.style.top = "0";
    node.style.left = "0";
  }
  else {
    node.style.top = `-${data.size.h / 2}px`;
    node.style.left = `-${data.size.w / 2}px`;
    node.style.width = `${data.size.w}px`;
    node.style.height = `${data.size.h}px`;
    node.style.lineHeight = `${data.size.h}px`;  
    node.style.backgroundColor = `rgb(${data.colour.r} ${data.colour.g} ${data.colour.b} / ${data.colour.a})`;
  }
}

function setSelectedNodeData(value, name) {
  const selectedWorldNode = document.querySelector(`#world .world-node[data-node-id="${selectedId}"]`);
  const selectedListNode = document.querySelector(`#world-nodemap .world-node[data-node-id="${selectedId}"]`);
  const nodeData = JSON.parse(selectedListNode.dataset.nodeData);

  switch (name) {
    case "tx":      nodeData.translation.x = parseInt(value); break;
    case "ty":      nodeData.translation.y = parseInt(value); break;
    case "tz":      nodeData.translation.z = parseInt(value); break;
    case "rx":      nodeData.rotation.x = parseInt(value);    break;
    case "ry":      nodeData.rotation.y = parseInt(value);    break;
    case "rz":      nodeData.rotation.z = parseInt(value);    break;
    case "width":   nodeData.size.w = parseInt(value);        break;
    case "height":  nodeData.size.h = parseInt(value);        break;
    case "cr":      nodeData.colour.r = parseInt(value);      break;
    case "cg":      nodeData.colour.g = parseInt(value);      break;
    case "cb":      nodeData.colour.b = parseInt(value);      break;
    case "ca":      nodeData.colour.a = parseInt(value);      break;
  }

  selectedListNode.dataset.nodeData = JSON.stringify(nodeData);

  setNodeStyle(selectedWorldNode, nodeData);
}

export function createElems(world, list, type, data) {
  const worldElem = world.appendChild(document.createElement("div"));
  const listElem = list.appendChild(document.createElement("div"));
  const id = nextId++;
  data ??= {
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    size: { w: 10, h: 10 },
    colour: { r: 255, g: 0, b: 0, a: 255 }
  };

  worldElem.classList.add("world-node");
  worldElem.dataset.nodeId = id;
  worldElem.dataset.nodeType = type;
  setNodeStyle(worldElem, data);

  if (type !== "group") {
    worldElem.addEventListener("click", clickHandler, { capture: true });
  }

  listElem.classList.add("world-node");
  listElem.dataset.nodeId = id;
  listElem.dataset.nodeType = type;
  listElem.dataset.nodeData = JSON.stringify(data);
  listElem.textContent = id > 0 ? `${type} #${id}` : "Root";
  listElem.addEventListener("click", clickHandler, { capture: true });

  return [ worldElem, listElem ];
}

export function addRootNode() {
  const [ rootWorld, rootList ] = createElems(world, nodeMap, "group");

  createElems(rootWorld, rootList, "face");
}

export function addGroup() {
  addNode("group");
}

export function addFace() {
  addNode("face");
}

function addNode(type) {
  const selectedWorldNode = document.querySelector(`#world .world-node[data-node-id="${selectedId}"]`);
  const selectedListNode = document.querySelector(`#world-nodemap .world-node[data-node-id="${selectedId}"]`);

  createElems(selectedWorldNode, selectedListNode, type);
}

export function removeNode() {
  const worldElem = document.querySelector(`#world .world-node[data-node-id="${selectedId}"]`);
  const listElem = document.querySelector(`#world-nodemap .world-node[data-node-id="${selectedId}"]`);

  worldElem.removeEventListener("click", clickHandler, { capture: true });
  listElem.removeEventListener("click", clickHandler, { capture: true });

  worldElem.remove();
  listElem.remove();

  selectedId = null;
}

export function selectNode(id) {
  if (selectedId !== null) {
    delete document.querySelector(`#world-nodemap .world-node[data-node-id="${selectedId}"]`).dataset.selected;
    delete document.querySelector(`#world .world-node[data-node-id="${selectedId}"]`).dataset.selected;
  }

  selectedId = id;

  const selectedListNode = document.querySelector(`#world-nodemap .world-node[data-node-id="${selectedId}"]`);
  const selectedWorldNode = document.querySelector(`#world .world-node[data-node-id="${selectedId}"]`);

  selectedListNode.dataset.selected = true;
  selectedWorldNode.dataset.selected = true;

  const isNotGroup = selectedListNode.dataset.nodeType !== "group";

  if (selectedId > 0) {
    removeNodeBtn.disabled = false;
  }
  else {
    removeNodeBtn.disabled = true;
  }

  deselectNodeBtn.disabled = false;
  addGroupBtn.disabled = isNotGroup;
  addFaceBtn.disabled = isNotGroup;

  const nodeData = JSON.parse(selectedListNode.dataset.nodeData);

  inputs.setManyValues(
    ["tx", nodeData.translation.x], ["ty", nodeData.translation.y], ["tz", nodeData.translation.z],
    ["rx", nodeData.rotation.x], ["ry", nodeData.rotation.y], ["rz", nodeData.rotation.z],
    ["width", nodeData.size.w], ["height", nodeData.size.h],
    ["cr", nodeData.colour.r], ["cg", nodeData.colour.g], ["cb", nodeData.colour.b], ["ca", nodeData.colour.a]
  );
  inputs.setManyDisabled(
    ["tx", false], ["ty", false], ["tz", false],
    ["rx", false], ["ry", false], ["rz", false],
    ["width", false], ["height", false],
    ["cr", false], ["cg", false], ["cb", false], ["ca", false]
  );
}

export function deselectNode() {
  if (selectedId !== null) {
    delete document.querySelector(`#world-nodemap .world-node[data-node-id="${selectedId}"]`).dataset.selected;
    delete document.querySelector(`#world .world-node[data-node-id="${selectedId}"]`).dataset.selected;

    selectedId = null;
  }

  addGroupBtn.disabled = true;
  addFaceBtn.disabled = true;
  removeNodeBtn.disabled = true;
  deselectNodeBtn.disabled = true;

  inputs.setManyValues(
    ["tx", 0], ["ty", 0], ["tz", 0],
    ["rx", 0], ["ry", 0], ["rz", 0],
    ["width", 10], ["height", 10],
    ["cr", 255], ["cg", 255], ["cb", 255], ["ca", 255]
  );
  inputs.setManyDisabled(
    ["tx", true], ["ty", true], ["tz", true],
    ["rx", true], ["ry", true], ["rz", true],
    ["width", true], ["height", true],
    ["cr", true], ["cg", true], ["cb", true], ["ca", true]
  );
}

export function resetNodeMap() {
  nextId = 0;
  selectedId = null;
  world.innerHTML = "";
  nodeMap.innerHTML = "";
}

addGroupBtn.addEventListener("click", addGroup);
addFaceBtn.addEventListener("click", addFace);
removeNodeBtn.addEventListener("click", removeNode);
deselectNodeBtn.addEventListener("click", deselectNode);
