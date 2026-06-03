import { overviewModes, apply as applyOverviewMode } from "./modes/apply";
import { aimModes, apply as applyAIMMode } from "./AIM modes/apply";
import {
    getPAABoxFromSubElem,
    isPAABoxAI,
    isPAABoxAlreadyTagged,
    paaModes,
    paaAnimatedModes,
    applyGlobally as applyPAAGlobally,
    applyToElem as applyToPAAElem
} from './PAA modes/apply'
import {
    getFromStorageOrDefault,
    waitForElm
} from "./utils";


// set page settings initially
getFromStorageOrDefault("overviewDisplay", "condensed").then(overviewDisplay => 
    applyOverviewMode(overviewDisplay as overviewModes, "visible")
);
getFromStorageOrDefault("AIModeDisplay", "hide").then(AIModeDisplay => 
    applyAIMMode(AIModeDisplay as aimModes, "visible")
);

let currentPeopleAlsoAskMode: paaModes = "labelled";

let currentpaaAnimatedMode: paaAnimatedModes = "onlyFirst";

getFromStorageOrDefault("paaAnimated", "onlyFirst").then(paaAnimated => 
    currentpaaAnimatedMode = paaAnimated as paaAnimatedModes
);

// reload as settings change
chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    
    if (changes.paaAnimated)
        currentpaaAnimatedMode = changes.paaAnimated.newValue as paaAnimatedModes;

    if (changes.overviewDisplay)
        applyOverviewMode(
            changes.overviewDisplay.newValue as overviewModes,
            changes.overviewDisplay.oldValue as overviewModes,
        );
    
    if (changes.peopleAlsoAskDisplay) {
        currentPeopleAlsoAskMode = changes.peopleAlsoAskDisplay.newValue as paaModes;
        applyPAAGlobally(
            changes.peopleAlsoAskDisplay.newValue as paaModes,
            changes.peopleAlsoAskDisplay.oldValue as paaModes,
            currentpaaAnimatedMode
        );
    }

    if (changes.AIModeDisplay)
        applyAIMMode(
            changes.AIModeDisplay.newValue as aimModes,
            changes.AIModeDisplay.oldValue as aimModes
        );
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
