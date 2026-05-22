import { isElemPAAResult, isPAABoxAlreadyTagged, tagPAABox, untagPAABox } from "./apply";

export function applyHide(mainPAAElem: HTMLElement) {
    
    mainPAAElem.style.display = "none";

    const divisorElem = getDivisor(mainPAAElem);
    if (!divisorElem) return;

    divisorElem.style.display = "none";
}

export function revertHide(mainPAAElem: HTMLElement) {

    mainPAAElem.style.display = "";


    const divisorElem = getDivisor(mainPAAElem);
    if (!divisorElem) return;

    divisorElem.style.display = "";
}

function getDivisor(elem: HTMLElement): HTMLElement | null {
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