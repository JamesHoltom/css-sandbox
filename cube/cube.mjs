import InputList from "../utility/inputs.mjs";

const Cube = (function() {
  // HTML Elements
  const rotateCube = document.getElementById("rotate-cube");
  const faces = document.getElementById("additional-faces");
  const addFaceBtn = document.getElementById("cube-add-face");
  const removeFaceBtn = document.getElementById("cube-remove-face");
  const clearFaceBtn = document.getElementById("cube-clear-face");
  const animateCubeBtn = document.getElementById("cube-animate-cube");
  const inputs = new InputList("cube",
    ["tx", 0, updateCube], ["ty", 0, updateCube], ["tz", 0, updateCube],
    ["rx", 0, updateCube], ["ry", 0, updateCube], ["rz", 0, updateCube]
  );

  function updateCube() {
    const rx = inputs.getValue("rx");
    const ry = inputs.getValue("ry");
    const rz = inputs.getValue("rz");
    const tx = inputs.getValue("tx");
    const ty = inputs.getValue("ty");
    const tz = inputs.getValue("tz");

    rotateCube.style.transform = `translate3d(calc(var(--cube-origin-x) + ${tx}px), calc(var(--cube-origin-y) + ${ty}px), calc(var(--cube-origin-z) + ${tz}px)) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
  }

  function addFace() {
    const cube = document.createElement("div")
    const face = cube.appendChild(document.createElement("div"));
    const randomTX = parseFloat(Math.random() * 200).toFixed(2) - 100;
    const randomTY = parseFloat(Math.random() * 200).toFixed(2) - 100;
    const randomTZ = parseFloat(Math.random() * 200).toFixed(2) - 100;
    const randomRX = Math.round(Math.random() * 360);
    const randomRY = Math.round(Math.random() * 360);
    const randomRZ = Math.round(Math.random() * 360);

    face.innerHTML = "Face";
    face.classList.add("face", "front");
    cube.classList.add("cube");
    cube.style.transform = `translate3d(${randomTX}px, ${randomTY}px, ${randomTZ}px) rotateX(${randomRX}deg) rotateY(${randomRY}deg) rotateZ(${randomRZ}deg)`
    
    faces.appendChild(cube);
  }

  function removeFace() {
    if (faces.lastChild !== null) {
      faces.lastChild.remove();
    }
  }

  function clearFaces() {
    faces.innerHTML = "";
  }

  function setAnimateCube() {
    if (animateCubeBtn.dataset.value === "off") {
      animateCubeBtn.dataset.value = "on";
      animateCubeBtn.innerHTML = "Animate: ON";
      rotateCube.classList.add("animate");
    }
    else {
      animateCubeBtn.dataset.value = "off";
      animateCubeBtn.innerHTML = "Animate: OFF";
      rotateCube.classList.remove("animate");
    }
  }

  function init() {
    addFaceBtn.addEventListener("click", addFace);
    removeFaceBtn.addEventListener("click", removeFace);
    clearFaceBtn.addEventListener("click", clearFaces);
    animateCubeBtn.addEventListener("click", setAnimateCube);
  }

  return {
    init
  };
})();

Cube.init();
