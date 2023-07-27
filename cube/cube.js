const rotateX = document.getElementById("rotate-x");
const rotateY = document.getElementById("rotate-y");
const rotateZ = document.getElementById("rotate-z");
const translateX = document.getElementById("translate-x");
const translateY = document.getElementById("translate-y");
const translateZ = document.getElementById("translate-z");
const valueRX = document.getElementById("value-rx");
const valueRY = document.getElementById("value-ry");
const valueRZ = document.getElementById("value-rz");
const valueTX = document.getElementById("value-tx");
const valueTY = document.getElementById("value-ty");
const valueTZ = document.getElementById("value-tz");
const rotateCube = document.getElementById("rotate-cube");
const faces = document.getElementById("additional-faces");
const addFaceBtn = document.getElementById("add-face");
const removeFaceBtn = document.getElementById("remove-face");
const clearFaceBtn = document.getElementById("clear-face");
const animateCubeBtn = document.getElementById("animate-cube");

function updateCube() {
  const rx = (rotateX.value || 0);
  const ry = (rotateY.value || 0);
  const rz = (rotateZ.value || 0);
  const tx = (translateX.value || 0);
  const ty = (translateY.value || 0);
  const tz = (translateZ.value || 0);

  valueRX.textContent = `X (${rx})`;
  valueRY.textContent = `Y (${ry})`;
  valueRZ.textContent = `Z (${rz})`;
  valueTX.textContent = `X (${tx})`;
  valueTY.textContent = `Y (${ty})`;
  valueTZ.textContent = `Z (${tz})`;

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

rotateX.addEventListener("change", updateCube);
rotateY.addEventListener("change", updateCube);
rotateZ.addEventListener("change", updateCube);
translateX.addEventListener("change", updateCube);
translateY.addEventListener("change", updateCube);
translateZ.addEventListener("change", updateCube);
addFaceBtn.addEventListener("click", addFace);
removeFaceBtn.addEventListener("click", removeFace);
clearFaceBtn.addEventListener("click", clearFaces);
animateCubeBtn.addEventListener("click", setAnimateCube);
