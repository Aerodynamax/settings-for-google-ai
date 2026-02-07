import { waitForElm } from "../utils.ts";

export function applyCondensed(overviewElem: HTMLElement) {
    // do nothing if already open
    if ( document.querySelector(`div[aria-label="Show more AI Overview"][aria-expanded="true"]`) !== null )
        return;

    // delete the stupid fade effect that looks dumb and stupid and dumb
    waitForElm(`div[jsname="WQ8ckf"]`).then((elem) => {
        elem?.parentElement?.removeChild(elem);
    })

    // move into main column
    let overviewContainerElem = overviewElem.parentElement;
    while (overviewContainerElem && getComputedStyle(overviewContainerElem).marginBottom === "0px") {
        overviewContainerElem = overviewContainerElem.parentElement;
    }

    if (overviewContainerElem && overviewContainerElem.parentElement) {
        overviewContainerElem.parentElement.setAttribute("overviewOriginalParentNode", "");
        
        // move overview
        waitForElm(`div[role="main"]`).then((elem) => {
            const mainColumn = elem as HTMLElement;
            
            if (overviewContainerElem && mainColumn && !mainColumn.contains(overviewContainerElem)) {
                mainColumn.prepend(overviewContainerElem);
            }
        })
    }

    // condense overview pane
    overviewElem.style.maxHeight = "95px";
    overviewElem.style.overflow = "clip";

    // remove bottom bar
    // [https://github.com/marianc000/children]
    const overviewPaneElems = overviewElem.getElementsByTagName(`*`);
    Array.from(overviewPaneElems).forEach((elem) => {
        const element = elem as HTMLElement;
        
        if (element instanceof HTMLDivElement && !getComputedStyle(element).borderBottom.includes("0px")) {
            
            element.setAttribute("overviewOriginalBorderBottom", element.style.borderBottom);
            element.style.borderBottom = "0px";
        }
    });

    // show content on "Show overview" click
    waitForElm(`div[jsaction="trigger.OiPALb"]`).then((elem) => {
        if (!elem) return;

        const overviewOpenBtn = elem as HTMLElement;

        overviewOpenBtn.addEventListener("click", () => {
            revertCondensed(overviewElem);
        });
    });

    // get "Show more" button
    waitForElm(`div[aria-label="Show more AI Overview"]`).then((btnElem) => {
        if (!btnElem) return;
        let showMoreBtn = btnElem as HTMLElement;

        // show content on "Show overview" click
        showMoreBtn.addEventListener("click", () => {
            revertCondensed(overviewElem);
        });
        
        // "Show more" -> "Show overview"
        [...showMoreBtn.getElementsByTagName("span")].forEach((elem) => {
            if (elem.textContent.trim() === "Show more")
                elem.textContent = "Show overview";
        });

        // show background if previously removed
        Array.from( showMoreBtn.getElementsByTagName(`*`) ).forEach((elem) => {
            const showMoreBtnBorder = elem as HTMLElement;

            let origBorderBottom = showMoreBtnBorder.getAttribute("overviewOriginalBorderBottom");
            showMoreBtnBorder.style.borderBottom = (origBorderBottom !== null) ? origBorderBottom : showMoreBtnBorder.style.borderBottom;
        });

        // show overview button background
        if (showMoreBtn.parentElement && showMoreBtn.parentElement.parentElement && showMoreBtn.parentElement.parentElement.parentElement) {
            const containerElem = showMoreBtn.parentElement.parentElement.parentElement;
            
            [...containerElem.children].forEach((child) => {
                const childNode = child as HTMLElement;
                
                // get correct node
                const bgImg = getComputedStyle(childNode).backgroundImage;
                if ( bgImg !== "none" ) {
                    childNode.setAttribute("overviewOriginalHeight", childNode.style.height);

                    childNode.style.height = "92px"; // good enough number
                }

                // hide view's content
                else if ( childNode != showMoreBtn.parentElement?.parentElement ) {

                    let childNodes = Array.from(childNode.children);

                    for (let i = 0; i < childNodes.length; i++) {
                        // recursive
                        childNodes.push(...childNodes[i].children);
                
                        const node = childNodes[i] as HTMLElement;
                
                        // hide view content so it doesn't flicker
                        if (node instanceof HTMLDivElement && (node.parentElement?.children.length || 0) > 2) {
                            let elemHeight = parseFloat(getComputedStyle(node).height);
                
                            if (elemHeight > 60) {
                                node.setAttribute("overviewOriginalDisplayType", node.style.display);
                                node.style.display = "none";
                                break;
                            }
                        }
                        
                    }

                }
                
            });
        }

        // condense content
        let childNodes = Array.from(overviewElem.children);

        for (let i = 0; i < childNodes.length; i++) {
            // recursive
            childNodes.push(...childNodes[i].children);
    
            const childNode = childNodes[i] as HTMLElement;
    
            // change overview size
            if (childNode instanceof HTMLDivElement) {
                let elemMinHeight = parseFloat(childNode.style.minHeight);
    
                if (!Number.isNaN(elemMinHeight) && elemMinHeight > 110) {
                    childNode.setAttribute("overviewOriginalMinHeight", childNode.style.minHeight);
                    childNode.style.minHeight = "110px";
                }

                let elemMaxHeight = parseFloat(childNode.style.maxHeight);
    
                if (!Number.isNaN(elemMaxHeight) && elemMaxHeight > 110) {
                    childNode.setAttribute("overviewOriginalMaxHeight", childNode.style.maxHeight);
                    childNode.style.maxHeight = "110px";
                }
            }
            
        }
    });


}

export function revertCondensed(overviewElem: HTMLElement) {

    // reset "Generating ..." view size
    overviewElem.style.maxHeight = "";
    overviewElem.style.overflow = "";

    // move out of main column
    let overviewContainerElem = overviewElem.parentElement;
    while (overviewContainerElem && overviewContainerElem.querySelector(`h1`)?.textContent !== "AI overview") {
        overviewContainerElem = overviewContainerElem.parentElement;
    }
    if (overviewContainerElem && overviewContainerElem.parentElement) {
        overviewContainerElem.parentElement.setAttribute("overviewOriginalParentNode", "");
        
        // move overview
        waitForElm(`div[overviewOriginalParentNode]`).then((elem) => {
            const overviewHolder = elem as HTMLElement;
            
            if (overviewContainerElem && overviewHolder) {
                overviewHolder.prepend(overviewContainerElem);
            }
        })
    }

    // reset all attributes
    let childNodes = Array.from(overviewElem.children);

    for (let i = 0; i < childNodes.length; i++) {
        // recursive
        childNodes.push(...childNodes[i].children);

        const childNode = childNodes[i] as HTMLElement;

        // reset
        childNode.style.minHeight = childNode.getAttribute("overviewOriginalMinHeight") || childNode.style.minHeight;
        childNode.style.maxHeight = childNode.getAttribute("overviewOriginalMaxHeight") || childNode.style.maxHeight;
        
        let origHeight = childNode.getAttribute("overviewOriginalHeight");
        childNode.style.height = (origHeight !== null) ? origHeight : childNode.style.height;

        let origBorderBottom = childNode.getAttribute("overviewOriginalBorderBottom");
        childNode.style.borderBottom = (origBorderBottom !== null) ? origBorderBottom : childNode.style.borderBottom;
        
        let origDisplayType = childNode.getAttribute("overviewOriginalDisplayType");
        childNode.style.display = (origDisplayType !== null) ? origDisplayType : childNode.style.display;
        
        childNode.removeAttribute("overviewOriginalMinHeight")
        childNode.removeAttribute("overviewOriginalMaxHeight")
        childNode.removeAttribute("overviewOriginalBgImg")
        childNode.removeAttribute("overviewOriginalDisplayType")
    }


    // "Show overview" -> "Show more"
    waitForElm(`div[aria-label="Show more AI Overview"]`).then(showMoreBtn => {
        if (!showMoreBtn) return;

        [...showMoreBtn.getElementsByTagName("span")].forEach((elem) => {
            if (elem.textContent.trim() === "Show overview")
                elem.textContent = "Show more";
        });
    });

}
