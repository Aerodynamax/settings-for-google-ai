
// stupid enum workaround
export const paaModes = {
    hidden: "hidden",
    labelled: "labelled",
    normal: "normal",
} as const;
// create a type from the object values
export type paaModes = (typeof paaModes)[keyof typeof paaModes];

export const paaAnimatedModes = {
    never: "never",
    onlyFirst: "onlyFirst",
    always: "always",
} as const;
export type paaAnimatedModes = (typeof paaAnimatedModes)[keyof typeof paaAnimatedModes];


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
            case paaModes.hidden:
                revertHide(elem);
                break;
            case paaModes.labelled:
                revertHighlight(elem);
                break;
            case paaModes.normal:
            // do nothing
        }
    }

    // apply new if not already
    if (!isPAABoxAlreadyTagged(elem)) {
        tagPAABox(elem);
        
        switch (mode) {
            case paaModes.hidden:
                applyHide(elem);
                break;
            case paaModes.labelled:
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
            case paaModes.normal:
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
    return startingElem.querySelectorAll(paaSelector)
                        .values()
                        .filter(elem => elem instanceof HTMLElement)
                        .map(elem => elem as HTMLElement)
                        .toArray();
}

const paaSelector = `[jsname="yEVEwb"]`;
export function isElemPAAResult(elem: HTMLElement): boolean {
    return elem.matches(paaSelector);
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
export function tagPAABox(paaElem: HTMLElement): void {
    paaElem.setAttribute("AIPAA", "");
}
export function untagPAABox(paaElem: HTMLElement): void {
    paaElem.removeAttribute("AIPAA");
}

export function isPAANew(paaElem: HTMLElement): boolean {
    // the people also ask elem holder has a progress bar elem to show when loading new items.
    // new people also ask elems load in a sub element of the main people also ask container.
    // regular elems will have the progress bar as a sister elem, new elems will not.
    let allPeopleAlsoAskContainer = paaElem.parentElement;

    if (!allPeopleAlsoAskContainer) return false;

    let allProgressbarElems = [ ...allPeopleAlsoAskContainer.children ].filter((value) => value.getAttribute("role") === "progressbar");
    
    return allProgressbarElems.length === 0;
}

//endregion