import { waitForElm } from '../utils';


export function appyHide(AIModeElement: HTMLElement) {
    AIModeElement.setAttribute("aimDisplay", AIModeElement.style.display);
    AIModeElement.style.display = "none";

    // remove negative margin
    const googleNavBarElem = AIModeElement.parentElement;

    if (!googleNavBarElem) return;

    googleNavBarElem.setAttribute("aimMarginLeft", googleNavBarElem.style.marginLeft);
    googleNavBarElem.style.setProperty("margin-left", "0px", "important");

    // move next nav item out

    // get more menu  ASKLDJSLAK I HATE RELYING ON CSS CLASSES 
    waitForElm(`.vH6rvf.FJCJfd.IRx9Tb`).then(async elem => {
        if (!elem) return;
        const moreMenuElem = elem as HTMLElement;

        // find listitem child to move
        let elemToMove = await waitForElm(`[role="listitem"]`, moreMenuElem);
        if (!elemToMove) return;

        const aimElemToMove = elemToMove as HTMLElement;

        aimElemToMove.setAttribute("aimElemToMove", "");
        
        // set flag on parent
        if (!aimElemToMove.parentElement) return;
        const aimMoveElemParent = aimElemToMove.parentElement;

        // save index to "aimParent" attribute
        aimMoveElemParent.setAttribute("aimMoveElemParent", Array.from(aimMoveElemParent.children).indexOf(aimElemToMove as Element).toString());
        
        
        // no idea why this works ...
        const newIndex = googleNavBarElem.childNodes.length - 1;
    
        googleNavBarElem.insertBefore(aimElemToMove, googleNavBarElem.children[newIndex]);


        // hide the holder for the now taken more menu button
        let moreButtonHolderElem = aimMoveElemParent.parentElement;
        
        while (moreButtonHolderElem && moreButtonHolderElem.parentElement && moreButtonHolderElem.parentElement !== moreMenuElem) {
            moreButtonHolderElem = moreButtonHolderElem.parentElement;
        }

        if (!moreButtonHolderElem || !moreButtonHolderElem.parentElement || moreButtonHolderElem.parentElement !== moreMenuElem) return;

        moreButtonHolderElem.setAttribute("aimFirstMoreElem", "");
        // hide
        moreButtonHolderElem.style.display = "none";
    });
}


export function revertHide(AIModeElement: HTMLElement) {
    // unhide button
    let origDisplay = AIModeElement.getAttribute("aimDisplay");
    AIModeElement.style.display = (origDisplay !== null) ? origDisplay : AIModeElement.style.display;

    // restore margin
    const googleNavBarElem = AIModeElement.parentElement;

    if (googleNavBarElem) {
        let origMarginLeft = googleNavBarElem.getAttribute("aimMarginLeft");
        googleNavBarElem.style.marginLeft = (origMarginLeft !== null) ? origMarginLeft : googleNavBarElem.style.marginLeft;
    }

    // move more elem back in position
    const aimElemToMove = document.querySelector(`[aimElemToMove]`) as HTMLElement | null;
    const aimMoveElemParent = document.querySelector(`[aimMoveElemParent]`) as HTMLElement | null;
    const aimFirstElemInMoreMenu = document.querySelector(`[aimFirstMoreElem]`) as HTMLElement | null;
    
    if (!aimElemToMove || !aimMoveElemParent || !aimFirstElemInMoreMenu)
        return;

    let savedIndex = aimMoveElemParent.getAttribute("aimMoveElemParent") as string;
    
    if (savedIndex.length === 0) return;
    
    const index = parseInt(savedIndex);

    aimMoveElemParent.insertBefore(aimElemToMove, aimMoveElemParent.children[index-1])

    // make visible - not doing this like I normally would because
    // the more menu elements are initally display: none;
    aimFirstElemInMoreMenu.style.display = "";
}