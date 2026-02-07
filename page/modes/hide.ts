export function applyHide(overviewElem: HTMLElement) {
    if (overviewElem)
        overviewElem.style.display = "none";

    // remove padding
    const didYouMeanElemContainer = document.querySelector(`div.YNk70c.EjQTId`) as HTMLElement;
    const overviewElemContainer = document.querySelector(`div.Kevs9.SLPe5b`) as HTMLElement;
    const overviewInSearchResultsContainer = document.querySelector(`div.ULSxyf`) as HTMLElement;

    if (didYouMeanElemContainer && didYouMeanElemContainer.getElementsByTagName("dynamic-visibility-control").length === 0)
        didYouMeanElemContainer.style.display = "none";

    if (overviewElemContainer)
        overviewElemContainer.style.display = "none";

    if (overviewInSearchResultsContainer) {
        overviewInSearchResultsContainer.setAttribute("overviewOriginalMarginBottom", overviewInSearchResultsContainer.style.marginBottom);
        overviewInSearchResultsContainer.style.marginBottom = "0px";
    }
    
}

export function revertHide(overviewElem: HTMLElement) {
    if (overviewElem)
        overviewElem.style.display = "";

    // remove padding
    const otherOverviewElemContainer = document.querySelector(`div.YNk70c.EjQTId`) as HTMLElement;
    const overviewElemContainer = document.querySelector(`div.Kevs9.SLPe5b`) as HTMLElement;
    const overviewInSearchResultsContainer = document.querySelector(`div.ULSxyf`) as HTMLElement;

    if (otherOverviewElemContainer)
        otherOverviewElemContainer.style.display = "";

    if (overviewElemContainer)
        overviewElemContainer.style.display = "";

    if (overviewInSearchResultsContainer) {
        let origMarginBottom = overviewInSearchResultsContainer.getAttribute("overviewOriginalMarginBottom");
        overviewInSearchResultsContainer.style.marginBottom = (origMarginBottom !== null) ? origMarginBottom : overviewInSearchResultsContainer.style.marginBottom;
        overviewInSearchResultsContainer.removeAttribute("overviewOriginalMarginBottom");
    }
}
