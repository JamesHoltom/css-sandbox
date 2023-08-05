export default class InputList {
  constructor(tab, ...newInputs) {
    this._inputs = {};
    this._tab = tab;
    this.addInputs(...newInputs);
  }

  addInputs(...newInputs) {
    for (const [ name, value, disabled, callback ] of newInputs) {
      this._inputs[name] = {
        rangeInput: document.getElementById(`input-${this._tab}-${name}`),
        numberInput: document.getElementById(`value-${this._tab}-${name}`),
        value,
        disabled: (disabled === true)
      };

      const onChange = (event) => {
        const name = event.target.id.split("-")[2];
        const newValue = event.target.value;

        this.setValue(name, newValue);
        callback?.(newValue, name);
      }

      if (this._inputs[name].rangeInput !== null) {
        this._inputs[name].rangeInput.addEventListener("change", onChange);
        this._inputs[name].rangeInput.value = value;
        this._inputs[name].rangeInput.disabled = (disabled === true);
      }

      if (this._inputs[name].numberInput !== null) {
        this._inputs[name].numberInput.addEventListener("change", onChange);
        this._inputs[name].numberInput.value = value;
        this._inputs[name].numberInput.disabled = (disabled === true);
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

      if (this._inputs[name].rangeInput !== null) {
        this._inputs[name].rangeInput.value = value;
      }

      if (this._inputs[name].numberInput !== null) {
        this._inputs[name].numberInput.value = value;
      }
    }
  }

  setManyValues(...values) {
    for (const [ name, value ] of values) {
      this.setValue(name, value);
    }
  }

  isDisabled(name) {
    return this._inputs[name]?.disabled;
  }

  setDisabled(name, flag) {
    if (this._inputs[name]) {
      const disabled = (flag === true);

      this._inputs[name].disabled = disabled;

      if (this._inputs[name].rangeInput !== null) {
        this._inputs[name].rangeInput.disabled = disabled;
      }

      if (this._inputs[name].numberInput !== null) {
        this._inputs[name].numberInput.disabled = disabled;
      }
    }
  }

  setManyDisabled(...flags) {
    for (const [ name, flag ] of flags) {
      this.setDisabled(name, flag);
    }
  }
};
