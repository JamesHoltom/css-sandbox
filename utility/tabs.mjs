export default class TabList {
  constructor(...tabs) {
    this._tabs = {};
    this._currentTab = null;

    this.addTabs(...tabs);

    if (this._currentTab === null) {
      this._currentTab = this._tabs[tabs[0][0]].elem;
      this._currentTab.dataset.selected = true;
    }

    const name = this._currentTab.dataset.tab;

    if (this._tabs[name].onOpen) {
      this._tabs[name].onOpen?.();
    }
    else {
      document.querySelector(`.tab[data-tab="${name}"]`).style.display = "block";
    }
  }

  addTabs(...tabs) {
    for (const tab of tabs) {
      const [ name, onOpen, onClose ] = tab;

      this._tabs[name] ??= {
        elem: document.querySelector(`.tabitem[data-tab="${name}"]`),
        onOpen,
        onClose
      };
      this._tabs[name].elem.addEventListener("click", this._clickEvent);

      if (this._tabs[name].elem.dataset.selected) {
        this._currentTab = this._tabs[name].elem;
      }
    }
  }

  _clickEvent = (event) => {
    {
      const name = this._currentTab.dataset.tab;

      if (this._tabs[name].onClose) {
        this._tabs[name].onClose?.();
      }
      else {
        document.querySelector(`.tab[data-tab="${name}"]`).style.display = "none";
      }
      delete this._currentTab.dataset.selected;
    }

    this._currentTab = event.target;
    this._currentTab.dataset.selected = true;

    {
      const name = this._currentTab.dataset.tab;

      if (this._tabs[name].onOpen) {
        this._tabs[name].onOpen?.();
      }
      else {
        document.querySelector(`.tab[data-tab="${name}"]`).style.display = "block";
      }
    }
  }
}