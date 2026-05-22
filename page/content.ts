import { applyHide, revertHide } from "./modes/hide";
import { applyCondensed, revertCondensed } from "./modes/condensed";
import {
    appyHide as applyHideAIM,
    revertHide as revertHideAIM,
} from "./AIM modes/hide";
import {
    getPAABoxFromSubElem,
    isPAABoxAI,
    isPAABoxAlreadyTagged,
    isPAANew
} from "./PAA modes/apply";
import {
    paaModes,
    paaAnimatedModes,
    applyGlobally as applyPAAGlobally,
    applyToElem as applyToPAAElem
} from './PAA modes/apply'
import {
    getFromStorageOrDefault,
    waitForElm
} from "./utils";

type overviewModes = "hidden" | "condensed" | "visible";

async function applyOverviewMode(mode: overviewModes, prevMode: overviewModes) {
    // get AI Overview element
    // gen vs cache properties: [https://www.diffchecker.com/1hSMKGfo/]
    const overviewElem = await waitForElm(`div[jsname="dEwkXc"]`);

    if (!overviewElem) return;

    // revert previous
    switch (prevMode) {
        case "hidden":
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
        case "hidden":
            applyHide(overviewElem as HTMLElement);
            break;
        case "condensed":
            applyCondensed(overviewElem as HTMLElement);
            break;
        case "visible":
        // do nothing
    }
}

type aimModes = "hidden" | "visible";

async function applyAIModeMode(mode: overviewModes, prevMode: overviewModes) {
    // get AI Overview element
    // gen vs cache properties: [https://www.diffchecker.com/1hSMKGfo/]
    const googleNavBarElem = await waitForElm(`div.beZ0tf.O1uzAe[role="list"]`);

    if (!googleNavBarElem) return;

    let aimElem: HTMLElement | null = null;

    // find the AI Mode button element
    googleNavBarElem.childNodes.forEach(node => {
        const navElem = node as HTMLElement;

        if (navElem.textContent.toLowerCase() == "ai mode") {
            aimElem = navElem;
        }
    });

    if (!aimElem) return;

    // revert previous
    switch (prevMode) {
        case "hidden":
            revertHideAIM(aimElem);
            break;
        case "visible":
        // do nothing
    }

    // apply new
    switch (mode) {
        case "hidden":
            applyHideAIM(aimElem);
            break;
        case "visible":
        // do nothing
    }
}


// set page settings initially
getFromStorageOrDefault("overviewDisplay", "condensed").then(overviewDisplay => 
    applyOverviewMode(overviewDisplay as overviewModes, "visible")
);
getFromStorageOrDefault("AIModeDisplay", "hide").then(AIModeDisplay => 
    applyAIModeMode(AIModeDisplay as aimModes, "visible")
);

let currentPeopleAlsoAskMode: paaModes = "labelled";

let currentpaaAnimatedMode: paaAnimatedModes = "onlyFirst";

getFromStorageOrDefault("paaAnimated", "onlyFirst").then(paaAnimated => 
    currentpaaAnimatedMode = paaAnimated as paaAnimatedModes
);

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
        applyPAAGlobally(
            changes.peopleAlsoAskDisplay.newValue as paaModes,
            changes.peopleAlsoAskDisplay.oldValue as paaModes,
            currentpaaAnimatedMode
        );
    }

    if (changes.AIModeDisplay) {
        applyAIModeMode(
            changes.AIModeDisplay.newValue as aimModes,
            changes.AIModeDisplay.oldValue as aimModes
        );
    }
});

// update new people also ask boxes with label if required
const observer = new MutationObserver((mutationList) => {

    // get all updated/potentially updated
    let allChangedNodes = mutationList.flatMap((mutation) => [
        ...mutation.addedNodes,
        mutation.target,
    ]);

    // remove duplicates
    allChangedNodes = allChangedNodes.filter((node, idx) => 
        allChangedNodes.indexOf(node) === idx
    );

    // get HTMLElems
    const allChangedHTMLElems = allChangedNodes.filter(node => node instanceof HTMLElement)
                                                .map(node => node as HTMLElement);

    // get only overviews
    const allPaaHeadingElems = allChangedHTMLElems.filter(isPAABoxAI);

    allChangedHTMLElems.forEach((elem) => {
        const aiPeopleAlsoAskBox = getPAABoxFromSubElem(elem);

        // exit if wrong
        if (!aiPeopleAlsoAskBox) return;
        if (isPAABoxAlreadyTagged(aiPeopleAlsoAskBox)) return;
        if (!isPAABoxAI(aiPeopleAlsoAskBox)) return;

        // give "new" tag
        // if (isPAANew(aiPeopleAlsoAskBox)) aiPeopleAlsoAskBox.setAttribute("newPAA", "");

        applyToPAAElem(
            currentPeopleAlsoAskMode,
            "normal",
            currentpaaAnimatedMode,
            aiPeopleAlsoAskBox,
        );
        
    });
});

// get setting
getFromStorageOrDefault("peopleAlsoAskDisplay", "labelled").then(peopleAlsoAskDisplay => {
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
