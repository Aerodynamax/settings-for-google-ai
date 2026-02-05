import { applyHide, revertHide } from "./modes/hide.ts";
import { applyCondensed, revertCondensed } from "./modes/condensed.ts";

async function applyOverviewMode(mode, prevMode) {
    // get AI Overview element
    const searchQuery = new URLSearchParams(window.location.search).get("q");

    const overviewElem = document.querySelector(`div[data-q="${searchQuery}"]`);

    // revert previous
    switch (prevMode) {
        case "hide":
            revertHide(overviewElem);
        case "condensed":
            revertCondensed();
        case "visible":
        // do nothing
    }

    // apply new
    switch (mode) {
        case "hide":
            applyHide(overviewElem);
        case "condensed":
            applyCondensed();
        case "visible":
        // do nothing
    }
}

// set page settings initially
chrome.storage.local.get("overviewDisplay", ({ overviewDisplay }) => {
    applyOverviewMode(overviewDisplay ?? "condensed", "visible");
});

// reload as settings change
chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (!changes.overviewDisplay) return;

    applyOverviewMode(
        changes.overviewDisplay.newValue,
        changes.overviewDisplay.oldValue,
    );
});
