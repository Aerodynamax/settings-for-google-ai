
const sparkle = "AI Overview";

export function appyHighlight(mainPAAElem: HTMLElement) {
    if (mainPAAElem.hasAttribute("AIPAA")) return;

    mainPAAElem.setAttribute("AIPAA", "");

    // get question's text
    const PAAText = mainPAAElem.querySelector(`[data-q]`)?.getAttribute('data-q');

    const headerContainerElem = Array.from(mainPAAElem.getElementsByTagName(`span`)).filter(elem => elem.textContent === PAAText)[0];

    if (!headerContainerElem) return;

    // hide original "AI Overview" banner
    let childNodes = Array.from(mainPAAElem.children);

    for (let i = 0; i < childNodes.length; i++) {
        // recursive
        childNodes.push(...childNodes[i].children);

        const childNode = childNodes[i] as HTMLElement;

        // change overview size
        if (childNode instanceof HTMLDivElement && childNode.textContent.trim().endsWith("AI Overview")) {
            
            childNode.setAttribute("overviewOriginalDisplayMode", childNode.style.display);
            childNode.style.display = "none";
            break;
        }
        
    }

    // header styling
    headerContainerElem.setAttribute("AIPAAOriginalStyle", headerContainerElem.style.cssText);
    
    headerContainerElem.style.width = "100%";
    headerContainerElem.style.display = "flex";
    headerContainerElem.style.gap = "1em";
    headerContainerElem.style.alignItems = "center";

    headerContainerElem.animate({ gap: ["0", "1em"] }, { duration: 800, easing: "ease", iterations: 1 })

    // create the indicator
    const indicator = document.createElement(`div`);
    
    // button outline
    indicator.classList.add("p8Jhnd");

    indicator.style.fontSize = "0.7em";
    indicator.style.borderRadius = "0.5em";
    indicator.style.padding = "0.1em 0.6em";
    indicator.style.width = "max-content";
    indicator.style.height = "initial";
    indicator.style.overflow = "hidden";
    indicator.style.whiteSpace = "nowrap";
    indicator.style.display = "none";
    indicator.style.setProperty("margin", "0px", "important");

    indicator.textContent = sparkle;
    
    indicator.setAttribute("overviewAIPAAIndicator", "");
    
    headerContainerElem.prepend(indicator);
    
    // set background for animation
    indicator.style.background = `linear-gradient(45deg, #0943a2 60%, #a71d11, #967002, #2a8642, ${getComputedStyle(indicator).backgroundColor} 75%)`;
    indicator.style.backgroundSize = "500%";
    indicator.style.backgroundPosition = "100%";


    // animation
    const openningGradientAnim = [
        { display: "block", opacity: "0", width: "0", backgroundPosition: "0" },
        { opacity: "1", offset: 0.5 },
        { width: "calc-size(max-content, size)", backgroundPosition: "100%" },
    ];

    const openningGradientTiming = {
        duration: 1000,
        easing: "cubic-bezier(0.075, 0.82, 0.165, 1)",
        iterations: 1
    };

    indicator.animate(openningGradientAnim, openningGradientTiming);
    indicator.style.display = "block";

    // click "show more"
    // let showMoreBtnTxt = Array.from(mainPAAElem.getElementsByTagName("span")).filter(elem => elem.innerHTML === "Show more");

    // showMoreBtnTxt.forEach(showMoreBtnTxtElem => {
    //     let showMoreBtn = showMoreBtnTxtElem.parentElement;

    //     while (showMoreBtn && !(showMoreBtn.getAttribute("role") === "button")) {
    //         showMoreBtn = showMoreBtn.parentElement;
    //     }

    //     if (showMoreBtn)
    //         showMoreBtn.click();
    // });
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
    
    mainPAAElem.querySelectorAll(`[overviewOriginalDisplayMode]`).forEach(elem => {
        const element = elem as HTMLElement;

        let origCSS = element.getAttribute("overviewOriginalDisplayMode");
        element.style.cssText = (origCSS !== null) ? origCSS : element.style.cssText;
    });
    
    mainPAAElem.removeAttribute("AIPAA");
}