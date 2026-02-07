import { applyHide, revertHide } from "./modes/hide.ts";
import { applyCondensed, revertCondensed } from "./modes/condensed.ts";
import { appyHighlight, revertHighlight } from "./PAA modes/highlighted.ts";
import {
    waitForElm,
    isPeopleAlsoAskBox,
    isPeopleAlsoAskBoxAI,
} from "./utils.ts";

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

function applyAlsoAskDisplayMode(mode, prevMode) {
    // get all AI boxes
    const peopleAlsoAskBoxesAI = Array.from(
        document.querySelectorAll(`div[jsname="yEVEwb"]`),
    ).filter((elem) => isPeopleAlsoAskBoxAI(elem));

    peopleAlsoAskBoxesAI.forEach((elem) =>
        applyAlsoAskDisplayModeIndividual(mode, prevMode, elem),
    );
}
function applyAlsoAskDisplayModeIndividual(mode, prevMode, elem) {
    // revert previous
    switch (prevMode) {
        case "hide":
            // TODO
            break;
        case "labelled":
            revertHighlight(elem);
            break;
        case "normal":
        // do nothing
    }

    // apply new
    switch (mode) {
        case "hide":
            // TODO
            break;
        case "labelled":
            appyHighlight(elem);
            break;
        case "normal":
        // do nothing
    }
}

// set page settings initially
chrome.storage.local.get("overviewDisplay", ({ overviewDisplay }) => {
    applyOverviewMode(overviewDisplay ?? "condensed", "visible");
});

let currentPeopleAlsoAskMode = "labelled";

// reload as settings change
chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;

    if (changes.overviewDisplay) {
        applyOverviewMode(
            changes.overviewDisplay.newValue,
            changes.overviewDisplay.oldValue,
        );
    }

    if (changes.peopleAlsoAskDisplay) {
        currentPeopleAlsoAskMode = changes.peopleAlsoAskDisplay.newValue;

        applyAlsoAskDisplayMode(
            changes.peopleAlsoAskDisplay.newValue,
            changes.peopleAlsoAskDisplay.oldValue,
        );
    }
});

// update new people also ask boxes with label if required

const observer = new MutationObserver((mutationList) => {
    // TODO: make this work (reseting "normal" doesn't update DOM so it doesn't explode)

    // allChangedNodes = mutationList.flatMap((mutation) => [
    //     ...mutation.addedNodes,
    //     ...mutation.removedNodes,
    //     mutation.target,
    // ]);

    let allPeopleAlsoAskBoxes =
        document.querySelectorAll(`div[jsname="yEVEwb"]`);

    if (allPeopleAlsoAskBoxes.length > 0)
        applyAlsoAskDisplayMode(currentPeopleAlsoAskMode, "normal");
});

// get setting
chrome.storage.local.get("peopleAlsoAskDisplay", ({ paaDisplay }) => {
    // get main page
    waitForElm(`#search`).then((mainPageNode) => {
        if (paaDisplay) currentPeopleAlsoAskMode = paaDisplay;

        console.log("current mode: " + paaDisplay);

        if (mainPageNode) {
            // run on change
            observer.observe(mainPageNode, {
                attributes: true,
                childList: true,
                subtree: true,
            });
        }
    });
});
