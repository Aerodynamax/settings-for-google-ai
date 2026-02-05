(() => {
  // page/modes/hide.ts
  function applyHide(overviewElem) {
    if (overviewElem)
      overviewElem.style.display = "none";
    const otherOverviewElemContainer = document.querySelector(`div.YNk70c.EjQTId`);
    const overviewElemContainer = document.querySelector(`div.Kevs9.SLPe5b`);
    if (otherOverviewElemContainer)
      otherOverviewElemContainer.style.display = "none";
    if (overviewElemContainer)
      overviewElemContainer.style.display = "none";
  }
  function revertHide(overviewElem) {
    if (overviewElem)
      overviewElem.style.display = "block";
    const otherOverviewElemContainer = document.querySelector(`div.YNk70c.EjQTId`);
    const overviewElemContainer = document.querySelector(`div.Kevs9.SLPe5b`);
    if (otherOverviewElemContainer)
      otherOverviewElemContainer.style.display = "block";
    if (overviewElemContainer)
      overviewElemContainer.style.display = "block";
  }

  // page/modes/condensed.ts
  function applyCondensed() {
  }
  function revertCondensed() {
  }

  // page/content.js
  async function applyOverviewMode(mode, prevMode) {
    const searchQuery = new URLSearchParams(window.location.search).get("q");
    const overviewElem = document.querySelector(`div[data-q="${searchQuery}"]`);
    switch (prevMode) {
      case "hide":
        revertHide(overviewElem);
      case "condensed":
        revertCondensed();
      case "visible":
    }
    switch (mode) {
      case "hide":
        applyHide(overviewElem);
      case "condensed":
        applyCondensed();
      case "visible":
    }
  }
  chrome.storage.local.get("overviewDisplay", ({ overviewDisplay }) => {
    applyOverviewMode(overviewDisplay ?? "condensed", "visible");
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (!changes.overviewDisplay) return;
    applyOverviewMode(
      changes.overviewDisplay.newValue,
      changes.overviewDisplay.oldValue
    );
  });
})();
//# sourceMappingURL=content.bundle.js.map
