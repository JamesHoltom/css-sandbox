export default class MapNode {
  static #root = null;
  static #isAdding = false;
  static #nextId = 0;
  static #selectedNode = null;
  #id;
  #name;
  #index;
  #type;
  #worldElem;
  #listElem;
  #flags;
  #children = [];

  constructor(name, worldParent, listParent, index, type, flags) {
    if (MapNode.#isAdding === true) {
      this.#id = MapNode.#nextId++;
      this.#name = name;
      this.#worldElem = worldParent.appendChild(document.createElement("div"));
      this.#listElem = listParent.appendChild(document.createElement("div"));
      this.#index = index ?? 0;
      this.#type = type ?? "group";
      this.#flags = flags ?? {};

      this.#worldElem.classList.add("world-node");
      this.#worldElem.dataset.nodeId = this.#id;
      this.#worldElem.dataset.name = this.#name;
      this.#worldElem.dataset.nodeType = this.#type;

      if (type !== "group") {
        this.#worldElem.addEventListener("click", () => { MapNode.selectNode(this); }, { capture: true });
      }

      const btnElem = document.createElement("span");
      btnElem.innerHTML = this.#name;
      btnElem.addEventListener("click", () => { MapNode.selectNode(this); });

      this.#listElem.classList.add("world-node");
      this.#listElem.appendChild(btnElem);

      if (MapNode.#isAdding === true) {
        MapNode.#isAdding = false;
      }
    }
    else {
      throw new TypeError("MapNode is not constructible after creating the root node!");
    }
  }

  addGroup(name, flags) {
    this.#addNode(name, "group", flags);
  }

  addFace(name, flags) {
    this.#addNode(name, "face", flags);
  }

  addSprite(name, flags) {
    this.#addNode(name, "sprite", flags);
  }

  #addNode(name, type, flags) {
    MapNode.#isAdding = true;

    this.#children.push(new MapNode(name, this.#worldElem, this.#listElem, this.#index + 1, type, flags));
  }

  removeNode(name) {

  }

  clearNodes() {
    
  }

  static addRootNode(worldElem, listElem) {
    MapNode.#isAdding = true;

    MapNode.#root = new MapNode("root", worldElem, listElem);

    return MapNode.#root;
  }

  static selectNode(node) {
    if (MapNode.#selectedNode !== null) {
      delete MapNode.#selectedNode.#worldElem.dataset.selected;
    }

    MapNode.#selectedNode = node;

    if (node.#type !== "group") {
      node.#worldElem.dataset.selected = true;
    }
  }
};
