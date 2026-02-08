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
    // all ai overviews contain a "learn more" link,
    // when we find this, we get the parent's parent's parent's ... node

    let allChangedNodes = mutationList.flatMap((mutation) => [
        ...mutation.addedNodes,
        mutation.target,
    ]);

    // only unique & "learn more" links
    allChangedNodes = allChangedNodes.filter((node, idx) => {
        if (allChangedNodes.indexOf(node) !== idx) return false;
        if (!(node instanceof HTMLAnchorElement)) return false;

        return (
            node.getAttribute("aria-label") ===
            "Learn more about generative AI. Opens in a new tab."
        );
    });

    allChangedNodes.forEach((aiLearnMoreLink) => {
        let aiPeopleAlsoAskBox = aiLearnMoreLink.parentElement;

        while (aiPeopleAlsoAskBox && !isPeopleAlsoAskBox(aiPeopleAlsoAskBox)) {
            aiPeopleAlsoAskBox = aiPeopleAlsoAskBox.parentElement;
        }

        if (aiPeopleAlsoAskBox && !aiPeopleAlsoAskBox.hasAttribute("AIPAA"))
            applyAlsoAskDisplayModeIndividual(
                currentPeopleAlsoAskMode,
                currentPeopleAlsoAskMode,
                aiPeopleAlsoAskBox,
            );
    });
});

// get setting
chrome.storage.local.get("peopleAlsoAskDisplay", ({ peopleAlsoAskDisplay }) => {
    if (peopleAlsoAskDisplay) currentPeopleAlsoAskMode = peopleAlsoAskDisplay;

    // get main page
    waitForElm(`#search`).then((mainPageNode) => {
        if (mainPageNode) {
            // run on change
            observer.observe(mainPageNode, {
                attributes: true, // required
                childList: true,
                subtree: true,
            });
        }
    });
});
