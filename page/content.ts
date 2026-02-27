import { applyHide, revertHide } from "./modes/hide.ts";
import { applyCondensed, revertCondensed } from "./modes/condensed.ts";
import { appyHighlight, revertHighlight } from "./PAA modes/highlighted.ts";
import {
    appyHide as applyHidePAA,
    revertHide as revertHidePAA,
} from "./PAA modes/hide.ts";
import {
    waitForElm,
    isPeopleAlsoAskBox,
    isPeopleAlsoAskBoxAI
} from "./utils.ts";

type overviewModes = "hide" | "condensed" | "visible";

async function applyOverviewMode(mode: overviewModes, prevMode: overviewModes) {
    // get AI Overview element
    // gen vs cache properties: [https://www.diffchecker.com/1hSMKGfo/]
    const overviewElem = await waitForElm(`div[jsname="dEwkXc"]`);

    if (!overviewElem) return;

    // revert previous
    switch (prevMode) {
        case "hide":
            revertHide(overviewElem as HTMLElement);
            break;
        case "condensed":
            revertCondensed(overviewElem as HTMLElement);
            break;
        case "visible":
        // do nothing
    }

    // apply new
    switch (mode) {
        case "hide":
            applyHide(overviewElem as HTMLElement);
            break;
        case "condensed":
            applyCondensed(overviewElem as HTMLElement);
            break;
        case "visible":
        // do nothing
    }
}

type paaModes = "hide" | "labelled" | "normal";
type paaAnimatedModes = "never" | "onlyFirst" | "always";

function applyAlsoAskDisplayMode(mode: paaModes, prevMode: paaModes) {
    // get all AI boxes
    const peopleAlsoAskBoxesAI = Array.from(
        document.querySelectorAll(`div[jsname="yEVEwb"]`),
    ).filter((elem) => isPeopleAlsoAskBoxAI(elem));

    peopleAlsoAskBoxesAI.forEach((elem) =>
        applyAlsoAskDisplayModeIndividual(mode, prevMode, elem as HTMLElement),
    );
}
function applyAlsoAskDisplayModeIndividual(mode: paaModes, prevMode: paaModes, elem: HTMLElement) {
    // revert previous
    switch (prevMode) {
        case "hide":
            revertHidePAA(elem);
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
            applyHidePAA(elem);
            break;
        case "labelled":
            appyHighlight(
                elem,
                currentpaaAnimatedMode === "always" || ( currentpaaAnimatedMode === "onlyFirst" && !elem.hasAttribute("newPAA"))
            );
            break;
        case "normal":
        // do nothing
    }
}

// set page settings initially
chrome.storage.local.get(["overviewDisplay"]).then(({ overviewDisplay }) => {
    if (!overviewDisplay) overviewDisplay = "condensed";

    const settingValue = overviewDisplay as overviewModes;

    applyOverviewMode(settingValue, "visible");
});

let currentPeopleAlsoAskMode: paaModes = "labelled";

let currentpaaAnimatedMode: paaAnimatedModes = "onlyFirst";

chrome.storage.local.get(["paaAnimated"]).then(({ paaAnimated }) => {
    if (!paaAnimated) paaAnimated = "onlyFirst";

    currentpaaAnimatedMode = paaAnimated as paaAnimatedModes;
});

// reload as settings change
chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    
    if (changes.paaAnimated) {
        currentpaaAnimatedMode = changes.paaAnimated.newValue as paaAnimatedModes;
    }

    if (changes.overviewDisplay) {
        applyOverviewMode(
            changes.overviewDisplay.newValue as overviewModes,
            changes.overviewDisplay.oldValue as overviewModes,
        );
    }
    
    if (changes.peopleAlsoAskDisplay) {
        currentPeopleAlsoAskMode = changes.peopleAlsoAskDisplay.newValue as paaModes;
        applyAlsoAskDisplayMode(
            changes.peopleAlsoAskDisplay.newValue as paaModes,
            changes.peopleAlsoAskDisplay.oldValue as paaModes,
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

        if (aiPeopleAlsoAskBox && !aiPeopleAlsoAskBox.hasAttribute("AIPAA")) {

            // new people also ask elems load in a sub element of the main people also ask container.
            // this holder is invisible and doesn't have the progress bar elem.
            // if there is no progress bar elem in our parent then we are new.
            let allPeopleAlsoAskContainer = aiPeopleAlsoAskBox.parentElement;

            let allProgressbarElems = [ ...allPeopleAlsoAskContainer?.children ?? [] ].filter((value) => value.getAttribute("role") === "progressbar");
            
            if (!allProgressbarElems || allProgressbarElems.length == 0) {
                aiPeopleAlsoAskBox.setAttribute("newPAA", "");
            }

            applyAlsoAskDisplayModeIndividual(
                currentPeopleAlsoAskMode,
                "normal",
                aiPeopleAlsoAskBox,
            );
        }
    });
});

// get setting
chrome.storage.local.get("peopleAlsoAskDisplay", ({ peopleAlsoAskDisplay }) => {
    if (peopleAlsoAskDisplay)
        currentPeopleAlsoAskMode = peopleAlsoAskDisplay as paaModes;

    // get main page
    waitForElm(`#center_col`).then((mainPageNode) => {
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
