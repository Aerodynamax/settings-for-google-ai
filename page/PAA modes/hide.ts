
export function appyHide(mainPAAElem: HTMLElement) {
    mainPAAElem.setAttribute("overviewPAAOriginalDisplayMode", mainPAAElem.style.display);
    mainPAAElem.style.display = "none";
}

export function revertHide(mainPAAElem: HTMLElement) {
    let origDisplay = mainPAAElem.getAttribute("overviewPAAOriginalDisplayMode");
    mainPAAElem.style.display = (origDisplay !== null) ? origDisplay : mainPAAElem.style.display;
}