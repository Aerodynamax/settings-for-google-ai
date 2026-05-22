import { getAllPAAElems, isElemPAAResult, isPAABoxAlreadyTagged, tagPAABox, untagPAABox } from "./apply";

export function applyHide(mainPAAElem: HTMLElement) {
    mainPAAElem.style.display = "none";

    // if at the top, hide the dividing line
    if (!mainPAAElem.parentElement) return;
    const allPAAElems = getAllPAAElems(mainPAAElem.parentElement);

    const firstRealResultIndex = allPAAElems.findIndex(elem => !isPAABoxAlreadyTagged(elem));

    // if this is the last AI Overview, remove the below elem's top divider
    if (allPAAElems.indexOf(mainPAAElem) === firstRealResultIndex - 1) {
        // hide the divider
        const dividerElem = getDivider(mainPAAElem);

        if (dividerElem) dividerElem.style.display = "none";
    }

}

export function revertHide(mainPAAElem: HTMLElement) {
    mainPAAElem.style.display = "";

    const divisorElem = getDivider(mainPAAElem);
    
    if (divisorElem) divisorElem.style.display = "";
}

function getDivider(elem: HTMLElement): HTMLElement | null {
    // it is in the next elem
    const nextPAAElem = elem.nextElementSibling;
    if (!nextPAAElem) return null;
    if (nextPAAElem instanceof HTMLElement && !isElemPAAResult(nextPAAElem)) return null;

    // actually get elem with responsible CSS class
    const divisorElem = nextPAAElem.querySelector(`.iRPzcb`);
    if (divisorElem instanceof HTMLElement)
        return divisorElem as HTMLElement;
    else return null;
}