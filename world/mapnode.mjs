export default class MapNode {
  static #root = null;
  static #isAdding = false;
  #name;
  #type;
  #elem;
  #flags;
  #children = [];

  constructor(name, parent, type, flags) {
    if (MapNode.#root === null || MapNode.#isAdding === true) {
      this.#name = name;
      this.#type = type ?? "group";
      this.#elem = parent.appendChild(document.createElement("div"));
      this.#flags = flags ?? {};

      this.#elem.classList.add("world-node");
      this.#elem.dataset.name = this.#name;
      this.#elem.dataset.nodeType = this.#type;

      if (MapNode.#isAdding === true) {
        MapNode.#isAdding = false;
      } 
      else if (MapNode.#root === null) {
        MapNode.#root = this;
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

    this.#children.push(new MapNode(name, this.#elem, type, flags));
  }

  removeNode(name) {

  }

  clearNodes() {
    
  }
};
