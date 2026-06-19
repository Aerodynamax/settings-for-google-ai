import { overviewModes, apply as applyOverviewMode } from "./modes/apply";
import { aimHiddenPositions, aimModes, apply as applyAIMMode } from "./AIM modes/apply";
import {
    getPAABoxFromSubElem,
    isPAABoxAI,
    isPAABoxAlreadyTagged,
    paaModes,
    paaAnimatedModes,
    applyGlobally as applyPAAGlobally,
    applyToElem as applyToPAAElem,
    isElemPAAResult
} from './PAA modes/apply'
import {
    getFromStorageOrDefault,
    waitForElm
} from "./utils";


// set page settings initially
getFromStorageOrDefault("overviewDisplay", overviewModes.condensed).then(overviewDisplay => 
    applyOverviewMode(overviewDisplay, overviewModes.visible)
);

let currentaimHiddenPos: aimHiddenPositions = aimHiddenPositions.top;
let prevaimHiddenPos: aimHiddenPositions = currentaimHiddenPos;
let currentaimMode: aimModes = aimModes.visible;

getFromStorageOrDefault("aimMorePos", currentaimHiddenPos).then(aimMorePos => {
    prevaimHiddenPos = currentaimHiddenPos;
    currentaimHiddenPos = aimMorePos;
    
    // initial apply
    getFromStorageOrDefault("AIModeDisplay", aimModes.hidden).then(AIModeDisplay => {
        currentaimMode = AIModeDisplay;
        applyAIMMode(AIModeDisplay, aimModes.visible, currentaimHiddenPos, prevaimHiddenPos);
    });
});


let currentPeopleAlsoAskMode: paaModes = paaModes.labelled;

let currentpaaAnimatedMode: paaAnimatedModes = paaAnimatedModes.onlyFirst;

getFromStorageOrDefault("paaAnimated", currentpaaAnimatedMode).then(paaAnimated => 
    currentpaaAnimatedMode = paaAnimated
);

// TODO: make better interface for this in utils.ts
// reload as settings change
chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.paaAnimated)
        currentpaaAnimatedMode = changes.paaAnimated.newValue as paaAnimatedModes;

    if (changes.aimMorePos) {
        prevaimHiddenPos = currentaimHiddenPos;
        currentaimHiddenPos = changes.aimMorePos.newValue as aimHiddenPositions;
        applyAIMMode(
            currentaimMode,
            currentaimMode,
            currentaimHiddenPos,
            prevaimHiddenPos,
        );
    }

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

    if (changes.AIModeDisplay) {
        currentaimMode = changes.AIModeDisplay.newValue as aimModes;
        applyAIMMode(
            changes.AIModeDisplay.newValue as aimModes,
            changes.AIModeDisplay.oldValue as aimModes,
            currentaimHiddenPos,
            currentaimHiddenPos,
        );
    }
});

// TODO: move to relevant apply.ts file
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
    const allPaaHeadingElems = allChangedHTMLElems.filter(isElemPAAResult)
                                                    .filter(isPAABoxAI)
                                                    .filter((value) => !isPAABoxAlreadyTagged(value));

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
getFromStorageOrDefault("peopleAlsoAskDisplay", currentPeopleAlsoAskMode).then(peopleAlsoAskDisplay => {
    currentPeopleAlsoAskMode = peopleAlsoAskDisplay;

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