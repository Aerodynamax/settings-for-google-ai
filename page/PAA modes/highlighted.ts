
const sparkle = "AI Overview";

export function appyHighlight(mainPAAElem: HTMLElement) {
    if (mainPAAElem.hasAttribute("AIPAA")) return;

    mainPAAElem.setAttribute("AIPAA", "");

    // get question's text
    const PAAText = mainPAAElem.querySelector(`[data-q]`)?.getAttribute('data-q');

    const headerContainerElem = Array.from(mainPAAElem.getElementsByTagName(`span`)).filter(elem => elem.textContent === PAAText)[0];

    if (!headerContainerElem) return;

    // header styling
    headerContainerElem.setAttribute("AIPAAOriginalStyle", headerContainerElem.style.cssText);
    
    headerContainerElem.style.width = "100%";
    headerContainerElem.style.display = "flex";
    headerContainerElem.style.gap = "1em";
    headerContainerElem.style.alignItems = "center";

    // create the indicator
    const indicator = document.createElement(`div`);
    
    // button outline
    indicator.classList.add("p8Jhnd");

    indicator.style.fontSize = "0.7em";
    indicator.style.borderRadius = "0.5em";
    indicator.style.padding = "0.1em 0.6em";
    indicator.style.width = "initial";
    indicator.style.height = "initial";
    indicator.style.setProperty("margin", "0px", "important");

    indicator.textContent = sparkle;
    
    indicator.setAttribute("overviewAIPAAIndicator", "");
    
    headerContainerElem.prepend(indicator);

    // don't change colour on hover
    indicator.style.setProperty("background-color", getComputedStyle(indicator).backgroundColor, "important");
}

export function revertHighlight(mainPAAElem: HTMLElement) {
    
    // delete indicator
    mainPAAElem.querySelectorAll(`[overviewAIPAAIndicator]`).forEach(elem => {
        elem.remove();
    });

    // clean up styling
    mainPAAElem.querySelectorAll(`[AIPAAOriginalStyle]`).forEach(elem => {
        const element = elem as HTMLElement;

        let origCSS = element.getAttribute("AIPAAOriginalStyle");
        element.style.cssText = (origCSS !== null) ? origCSS : element.style.cssText;
    });
    
    mainPAAElem.removeAttribute("AIPAA");
}