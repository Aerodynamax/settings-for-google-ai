import { applyHide, revertHide } from "./modes/hide.ts";
import { applyCondensed, revertCondensed } from "./modes/condensed.ts";
import { waitForElm } from "./utils.ts";

async function applyOverviewMode(mode, prevMode) {
    // get AI Overview element
    // gen vs cache properties: [https://www.diffchecker.com/1hSMKGfo/]
    const overviewElem = await waitForElm(`div[jsname="dEwkXc"]`);

    // revert previous
    switch (prevMode) {
        case "hide":
            revertHide(overviewElem);
            break;
        case "condensed":
            revertCondensed(overviewElem);
            break;
        case "visible":
        // do nothing
    }

    // apply new
    switch (mode) {
        case "hide":
            applyHide(overviewElem);
            break;
        case "condensed":
            applyCondensed(overviewElem);
            break;
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
