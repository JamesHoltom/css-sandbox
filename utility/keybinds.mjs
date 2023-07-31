export default class KeyBindings {
  constructor(...keys) {
    this._keyBindings = {};
    this._lastKey = null;
    this._enabled = false;

    this.addKeys(...keys);

    document.addEventListener("keydown", this._keyEvent);
    document.addEventListener("keyup", this._keyEvent);
  }

  _keyEvent = (event) => {
    if (event.repeat || !this._enabled) {
      return;
    }

    const isDown = (event.type === "keydown");
  
    for (const action in this._keyBindings) {
      if (event.key === this._keyBindings[action].key) {
        this._keyBindings[action].value = isDown;

        break;
      }
    }
  
    if (isDown) {
      this._lastKey = event.key;
    }
  }

  addKeys(...newKeys) {
    for (const [action, key] of newKeys) {
      this._keyBindings[action] = {
        key,
        value: false
      };
    };
  }

  getAction(name) {
    return this._keyBindings[name]?.value ?? false;
  }

  get lastKey() {
    return this._lastKey;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(value) {
    this._enabled = (value === true);
  }
};
