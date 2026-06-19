export function applyHide(overviewElem: HTMLElement) {
    const containerElem = getOutermostContainer(overviewElem);
    
    if (!containerElem) return;

    containerElem.setAttribute("aimDisplay", containerElem.style.display);
    containerElem.style.display = "none";
}

export function revertHide(overviewElem: HTMLElement) {
    const containerElem = getOutermostContainer(overviewElem);
    
    if (!containerElem) return;

    let origDisplay = containerElem.getAttribute("aimDisplay");
    containerElem.style.display = (origDisplay !== null) ? origDisplay : containerElem.style.display;
}

function getOutermostContainer(startingElem: HTMLElement): HTMLElement | null {
    let outermostContainer = startingElem.parentElement;

    while (outermostContainer && !isOutermostContainer(outermostContainer)) {
        outermostContainer = outermostContainer.parentElement;
    }

    return outermostContainer;
}

// check if it's parent holds the main page contents
function isOutermostContainer(elem: HTMLElement): boolean {
    return isOutermostElemSearchFeaturedOverview(elem) || isOutermostElemSearchResultsOverview(elem);
}



const overviewAtSearchTop = `div.bzXtMb.M8OgIe.dRpWwb`;
function isOutermostElemSearchFeaturedOverview(elem: HTMLElement): boolean {
    return elem.matches(overviewAtSearchTop);
}

const overviewInSearchResults = `div.ULSxyf`;
function isOutermostElemSearchResultsOverview(elem: HTMLElement): boolean {
    return elem.matches(overviewInSearchResults);
}