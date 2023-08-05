export default class TabList {
  #tabs = {};
  #currentTab = null;

  constructor(...tabs) {
    this.addTabs(...tabs);

    if (this.#currentTab === null) {
      this.#currentTab = this.#tabs[tabs[0][0]].elem;
      this.#currentTab.dataset.selected = true;
    }

    const name = this.#currentTab.dataset.tab;

    if (this.#tabs[name].onOpen) {
      this.#tabs[name].onOpen?.();
    }
    else {
      document.querySelector(`.tab[data-tab="${name}"]`).style.display = "block";
    }
  }

  addTabs(...tabs) {
    for (const tab of tabs) {
      const [ name, onOpen, onClose ] = tab;

      this.#tabs[name] ??= {
        elem: document.querySelector(`.tabitem[data-tab="${name}"]`),
        onOpen,
        onClose
      };
      this.#tabs[name].elem.addEventListener("click", this.#clickEvent);

      if (this.#tabs[name].elem.dataset.selected) {
        this.#currentTab = this.#tabs[name].elem;
      }
    }
  }

  #clickEvent = (event) => {
    {
      const name = this.#currentTab.dataset.tab;

      if (this.#tabs[name].onClose) {
        this.#tabs[name].onClose?.();
      }
      else {
        document.querySelector(`.tab[data-tab="${name}"]`).style.display = "none";
      }
      delete this.#currentTab.dataset.selected;
    }

    this.#currentTab = event.target;
    this.#currentTab.dataset.selected = true;

    {
      const name = this.#currentTab.dataset.tab;

      if (this.#tabs[name].onOpen) {
        this.#tabs[name].onOpen?.();
      }
      else {
        document.querySelector(`.tab[data-tab="${name}"]`).style.display = "block";
      }
    }
  }

  get currentTab() {
    return this.#currentTab.dataset.tab;
  }
}