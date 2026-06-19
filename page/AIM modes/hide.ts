import { aimHiddenPositions, getGoogleNavBar, getGoogleNavBarButtons, getGoogleNavBarButtonsAsync, getGoogleNavBarMoreMenu, getGoogleNavBarMoreMenuButtons, getMoreBtn, isElemMoreMenuButton, isMoreMenuOpen } from './apply';


export async function applyHide(AIModeElement: HTMLElement, hiddenPos: aimHiddenPositions) {
    hideAIModeButton(AIModeElement);

    const googleNavBarElem = AIModeElement.parentElement;
    if (!googleNavBarElem) return;

    // move next nav item out

    const moreMenu = await getGoogleNavBarMoreMenu();
    if (!moreMenu) return;

    // find listitem child to move
    // since they are the same "shape" as the regular buttons, we can query for
    // them in the same way
    let aimElemToMove = (await getGoogleNavBarButtonsAsync(moreMenu))?.at(0);
    if (!aimElemToMove) return;

    flagMoreMenuButtonAsMoving(aimElemToMove);
    
    const aimMoveElemParent = aimElemToMove.parentElement;
    if (!aimMoveElemParent) return;
    
    // the more menu dropdown is the last thing in the list. since
    // we are inserting before the specified index, get the more menu's
    // index
    const newIndex = googleNavBarElem.childNodes.length - 1;

    googleNavBarElem.insertBefore(aimElemToMove, googleNavBarElem.children[newIndex]);


    // hide the holder for the now taken more menu button
    let moreButtonHolderElem = aimMoveElemParent.parentElement;
    
    while (moreButtonHolderElem?.parentElement && moreButtonHolderElem.parentElement !== moreMenu) {
        moreButtonHolderElem = moreButtonHolderElem.parentElement;
    }

    if (!moreButtonHolderElem || moreButtonHolderElem.parentElement !== moreMenu) return;

    moreButtonHolderElem.setAttribute("aimFirstMoreElem", "");

    console.log("HIDDEN POS STATE: " + hiddenPos);

    switch (hiddenPos) {
        case aimHiddenPositions.hidden:
            // hide
            moreButtonHolderElem.style.display = "none";
            break;
        case aimHiddenPositions.bottom:
            // move more elem to bottom
            let lastButton = getGoogleNavBarMoreMenuButtons(moreMenu)?.at(-1) as HTMLElement | null;
            
            if (lastButton) {
                const endIndex = [...moreMenu.children].indexOf(lastButton) + 1
                lastButton = moreMenu.children.item(endIndex) as HTMLElement | null;
                
                moreMenu.moveBefore(moreButtonHolderElem, lastButton);
            }
            

            // don't break so we can larp as the top mode
            // (they need to do the same things)
        case aimHiddenPositions.top:
            // move AI Mode into free space
            let savedIndex = aimMoveElemParent.getAttribute("aimMoveElemParent") as string;
            if (savedIndex.length === 0) return;
            const index = parseInt(savedIndex);
            
            // unhide button
            unhideAIModeButton(AIModeElement);

            aimMoveElemParent.insertBefore(AIModeElement, aimMoveElemParent.children[index]);

            // remove AI Mode specific styling
            AIModeElement.querySelectorAll(`.mVH5Fc`).forEach(elem => {
                    elem.setAttribute("aimCustomStylingCSS", elem.className)

                    elem.className = "";
                }
            );
            
            break;
        default:
            // not possible to get (hopefully)
            break;
    }
}


export async function revertHide(AIModeElement: HTMLElement, hiddenPos: aimHiddenPositions) {
    const moreMenu = await getGoogleNavBarMoreMenu();
    if (!moreMenu) return;
    
    // unhide button
    unhideAIModeButton(AIModeElement);

    const aimElemToMove = document.querySelector(aimElemToMoveSelector) as HTMLElement | null;
    const aimMoveElemParent = document.querySelector(aimMoveElemParentSelector) as HTMLElement | null;
    const aimFirstElemInMoreMenu = document.querySelector(aimFirstElemInMoreMenuSelector) as HTMLElement | null;
    
    if (!aimElemToMove || !aimMoveElemParent || !aimFirstElemInMoreMenu) return;

    switch (hiddenPos) {
        case aimHiddenPositions.hidden:
            // make visible - not doing this like I normally would because
            // the more menu elements are initally display: none;
            aimFirstElemInMoreMenu.style.display = "";

            break;
        
        case aimHiddenPositions.bottom:
            // move ai mode button to top
            let firstButton = getGoogleNavBarMoreMenuButtons(moreMenu)?.at(0) as HTMLElement | null;
            
            if (firstButton)
                moreMenu.moveBefore(aimFirstElemInMoreMenu, firstButton);

            // don't break so we can larp as the top mode
            // (we need to do the same thing anyways)
        
        case aimHiddenPositions.top:
            // move AI Mode to it's original spot
            let savedIndex = aimMoveElemParent.getAttribute("aimMoveElemParent") as string;
            if (savedIndex.length === 0) return;
            const index = parseInt(savedIndex);

            const navBar = await getGoogleNavBar();
            if (!navBar) return;
            
            const allPageNavButton = getGoogleNavBarButtons(navBar)?.at(0);
            if (!allPageNavButton) return;

            navBar.insertBefore(
                AIModeElement,
                allPageNavButton
            );

            // remove AI Mode specific styling
            AIModeElement.querySelectorAll(`[aimCustomStylingCSS]`).forEach(elem => {
                const styling = elem.getAttribute("aimCustomStylingCSS")
                
                if (styling) elem.className = styling;

                elem.removeAttribute("aimCustomStylingCSS");
            });
            
            break;
        
        default:
            break;
    }

    // move more elem back in position
    let savedIndex = aimMoveElemParent.getAttribute("aimMoveElemParent") as string;
    if (savedIndex.length === 0) return;
    const index = parseInt(savedIndex);

    aimMoveElemParent.insertBefore(aimElemToMove, aimMoveElemParent.children[index]);

    unflagMoreMenuButtonAsMoving(aimElemToMove);

    // the width only refreshes when the more menu is reopened
    // thus, recompute width
    if (await isMoreMenuOpen()) {
        refreshMoreMenuWidth(moreMenu);
    }
}

export const aimMoveElemParentSelector = `[aimMoveElemParent]`;
export const aimFirstElemInMoreMenuSelector = `[aimFirstMoreElem]`;
export const aimElemToMoveSelector = `[aimElemToMove]`;

export function hideAIModeButton(aimBtnElem: HTMLElement): void {
    aimBtnElem.setAttribute("aimDisplay", aimBtnElem.style.display);
    aimBtnElem.style.display = "none";

    // remove negative margin
    const googleNavBarElem = aimBtnElem.parentElement;

    if (!googleNavBarElem) return;

    googleNavBarElem.setAttribute("aimMarginLeft", googleNavBarElem.style.marginLeft);
    googleNavBarElem.style.setProperty("margin-left", "0px", "important");
}

export function unhideAIModeButton(aimBtnElem: HTMLElement): void {
    // unhide button
    let origDisplay = aimBtnElem.getAttribute("aimDisplay");
    aimBtnElem.style.display = (origDisplay !== null) ? origDisplay : aimBtnElem.style.display;
    aimBtnElem.removeAttribute("aimDisplay");

    // restore margin
    const googleNavBarElem = aimBtnElem.parentElement;

    if (googleNavBarElem) {
        let origMarginLeft = googleNavBarElem.getAttribute("aimMarginLeft");
        googleNavBarElem.style.marginLeft = (origMarginLeft !== null) ? origMarginLeft : googleNavBarElem.style.marginLeft;
        googleNavBarElem.removeAttribute("aimMarginLeft");
    }
}

function flagMoreMenuButtonAsMoving(elemToMove: Element): boolean {
    elemToMove.setAttribute("aimElemToMove", "");
        
    // set flag on parent
    const aimMoveElemParent = elemToMove.parentElement;
    if (!aimMoveElemParent) return false;

    // save index to "aimParent" attribute
    aimMoveElemParent.setAttribute(
        "aimMoveElemParent",
        [ ...aimMoveElemParent.children ].indexOf(elemToMove).toString()
    );

    return true;
}
function unflagMoreMenuButtonAsMoving(elemToMove: Element): boolean {
    elemToMove.removeAttribute("aimElemToMove");
        
    const aimMoveElemParent = elemToMove.parentElement;
    if (!aimMoveElemParent) return false;
    
    // remove flag on parent
    aimMoveElemParent.removeAttribute("aimMoveElemParent");

    return true;
}

async function refreshMoreMenuWidth(moreMenuElem: HTMLElement) {
    // TODO: make this better
    // literally just click the button twice (flickers)
    const moreBtn = await getMoreBtn();
    moreBtn?.click();
    moreBtn?.click();

    // reset width
    // debugger;
    // moreMenuElem.style.width = "";
    // moreMenuElem.offsetWidth
    
    // // set
    // moreMenuElem.style.maxWidth = Math.round(moreMenuElem.getBoundingClientRect().width).toString() + "px";
    // moreMenuElem.style.width = moreMenuElem.style.maxWidth;

}

// function moveNavButtonToSearchNavBar(elem: HTMLElement, index: number = -1): void {
//     const navButton = getNavButtonElem(elem);
//     if (!navButton) return;
    
//     getGoogleNavBar().then(navMenu => {
//         if (!navMenu) return;

//         const buttons = getGoogleNavBarButtons(navMenu);

//         const offset = navMenu.children.length - (buttons?.length ?? 0);

//         moveElemToContainerAtIndex(
//             navMenu,
//             elem,
//             offset + wrapListIndex(index, buttons?.length ?? navMenu.children.length)
//         );
//     });
// }

// function moveNavButtonToSearchNavMoreMenu(elem: HTMLElement, index: number = -1): void {
//     getGoogleNavBarMoreMenu().then(moreMenu => {
//         if (!moreMenu) return;

//         const buttons = getGoogleNavBarMoreMenuButtons(moreMenu);

//         const offset = moreMenu.children.length - (buttons?.length ?? 0);

//         const trueButtonIndex = offset + wrapListIndex(index, buttons?.length ?? moreMenu.children.length);

//         // const holder = getNavButtonElem()
        
//         moveElemToContainerAtIndex(
//             moreMenu,
//             navButton,
//             offset + wrapListIndex(index, buttons?.length ?? moreMenu.children.length)
//         );
//     });
// }

// function moveElemToContainerAtIndex(container: HTMLElement, elem: HTMLElement, index: number = -1): void {
//     container.insertBefore(
//         elem,
//         container.children[wrapListIndex(index, container.children.length)]
//     );
// }

// function wrapListIndex(index: number, listLength: number): number {
//     // wraps at -children.length < index < children.length
//     // (wraps to 0 but counts up with original sign intact)
//     let actual_index = index % listLength;

//     // remove minus sign                                  (currently negative)
//     if (actual_index < 0 ) actual_index = (listLength + 1) + actual_index;
//     //                              (make `-1` get after last)

//     return actual_index;
// }