export type paaModes = "hidden" | "labelled" | "normal";
export type paaAnimatedModes = "never" | "onlyFirst" | "always";

//region apply PAA mode

import { applyHide, revertHide } from "./hide";
import { applyHighlight, revertHighlight } from "./highlighted";


export function applyGlobally(mode: paaModes, prevMode: paaModes, animationMode: paaAnimatedModes) {
    // get all AI boxes
    const peopleAlsoAskBoxesAI = getAllPAAElems().filter((value) => isPAABoxAI(value));

    peopleAlsoAskBoxesAI.forEach((elem) =>
        applyToElem(mode, prevMode, animationMode, elem)
    );
}

export function applyToElem(mode: paaModes, prevMode: paaModes, animationMode: paaAnimatedModes, elem: HTMLElement) {
    // revert previous if not already
    if (isPAABoxAlreadyTagged(elem)) {
        untagPAABox(elem);

        switch (prevMode) {
            case "hidden":
                revertHide(elem);
                break;
            case "labelled":
                revertHighlight(elem);
                break;
            case "normal":
            // do nothing
        }
    }

    // apply new if not already
    if (!isPAABoxAlreadyTagged(elem)) {
        tagPAABox(elem);
        
        switch (mode) {
            case "hidden":
                applyHide(elem);
                break;
            case "labelled":
                switch (animationMode) {
                    case "always":
                        applyHighlight(elem, true);
                        break;
                    case "onlyFirst":
                        applyHighlight(elem, !isPAANew(elem));
                        break;
                    case "never":
                        applyHighlight(elem, false);
                }
                
                break;
            case "normal":
            // do nothing
        }

    }
}

//endregion

//region detect PAA boxes
export function getPAABoxFromSubElem(subElem: HTMLElement): HTMLElement | null {
    let currElem = subElem;
    while (currElem.parentElement && !isElemPAAResult(currElem))
    {
        currElem = currElem.parentElement;
    }

    if (isElemPAAResult(currElem)) return currElem;
    else return null;
}

export function getAllPAAElems(startingElem: HTMLElement | Document = document): HTMLElement[] {
    return startingElem.querySelectorAll(`[jsname="${paaJSName}"]`)
                        .values()
                        .filter(elem => elem instanceof HTMLElement)
                        .map(elem => elem as HTMLElement)
                        .toArray();
}

const paaJSName = "yEVEwb";
export function isElemPAAResult(elem: HTMLElement): boolean {
    return elem.getAttribute("jsname") === paaJSName;    
}

export function isPAABoxAI(paaElem: HTMLElement): boolean {
    return isPAABoxAIGenerated(paaElem) || isPAABoxAIUngenerated(paaElem);
}

function isPAABoxAIGenerated(paaElem: HTMLElement): boolean {
    return paaElem.querySelectorAll(`[role="heading"]`)
                    .values()
                    .some(elem => elem.textContent === "AI Overview");
}

function isPAABoxAIUngenerated(paaElem: HTMLElement): boolean {
    return paaElem.querySelectorAll(`[aria-valuetext="Generating"][role="progressbar"]`).length > 0;
}

export function isPAABoxAlreadyTagged(paaElem: HTMLElement): boolean {
    return paaElem.hasAttribute("AIPAA");
}
export function tagPAABox(paaElem: HTMLElement) {
    paaElem.setAttribute("AIPAA", "");
}
export function untagPAABox(paaElem: HTMLElement) {
    paaElem.removeAttribute("AIPAA");
}

export function isPAANew(paaElem: HTMLElement): boolean {
    // the people also ask elem holder hass a progress bar elem to show when loading new items.
    // new people also ask elems load in a sub element of the main people also ask container.
    // regular elems will have the progress bar as a sister elem, new elems will not.
    let allPeopleAlsoAskContainer = paaElem.parentElement;

    if (!allPeopleAlsoAskContainer) return false;

    let allProgressbarElems = [ ...allPeopleAlsoAskContainer.children ].filter((value) => value.getAttribute("role") === "progressbar");
    
    return allProgressbarElems.length === 0;
}

//endregion