export default class InputList {
  constructor(tab, ...newInputs) {
    this._inputs = {};
    this._tab = tab;
    this.addInputs(...newInputs);
  }

  addInputs(...newInputs) {
    for (const [ name, defaultValue, callback ] of newInputs) {
      this._inputs[name] = {
        rangeInput: document.getElementById(`input-${this._tab}-${name}`),
        numberInput: document.getElementById(`value-${this._tab}-${name}`),
        value: defaultValue
      };

      const onChange = (event) => {
        const name = event.target.id.split("-")[2];
        const value = event.target.value;

        this.setValue(name, value);
        callback?.(value);
      }

      if (this._inputs[name].rangeInput !== null) {
        this._inputs[name].rangeInput.addEventListener("change", onChange);
        this._inputs[name].rangeInput.value = defaultValue;
      }

      if (this._inputs[name].numberInput !== null) {
        this._inputs[name].numberInput.addEventListener("change", onChange);
        this._inputs[name].numberInput.value = defaultValue;
      }
    };
  }

  getInput(name) {
    return [ this._inputs[name]?.rangeInput, this._inputs[name]?.numberInput ];
  }

  getValue(name) {
    return this._inputs[name]?.value;
  }

  setValue(name, value) {
    if (this._inputs[name]) {
      this._inputs[name].value = value;
      this._inputs[name].rangeInput.value = value;
      this._inputs[name].numberInput.value = value;
    }
  }
};
