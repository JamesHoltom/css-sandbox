const tabItems = document.getElementsByClassName("tabitem");

function setTab() {
  const tabName = this.dataset.tab;
  const oldTab = document.querySelector(".tabitem[data-selected]");
  const oldTabName = oldTab.dataset.tab;

  document.querySelector(`.tab[data-tab="${oldTabName}"]`).style.display = "none";
  delete document.querySelector(".tabitem[data-selected]").dataset.selected;

  this.dataset.selected = true;
  document.querySelector(`.tab[data-tab="${tabName}"]`).style.display = "block";
}

Object.values(tabItems).forEach((elem) => {
  elem.addEventListener("click", setTab);
});