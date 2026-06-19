import { waitForElems, waitForElm } from "../utils";
import { applyHide, revertHide } from "./hide";

// stupid enum workaround
export const aimModes = {
    hidden: "hidden",
    visible: "visible",
} as const;
// create a type from the object values
export type aimModes =
    (typeof aimModes)[keyof typeof aimModes];

export const aimHiddenPositions = {
    top: "top",
    bottom: "bottom",
    hidden: "hidden",
} as const;
export type aimHiddenPositions =
    (typeof aimHiddenPositions)[keyof typeof aimHiddenPositions];


export function apply(mode: aimModes, prevMode: aimModes, hiddenPos: aimHiddenPositions, prevHiddenPos: aimHiddenPositions) {
    getAIModeBtn().then(async aimElem => {
        if (!aimElem) return;

        
        // revert previous
        switch (prevMode) {
            case aimModes.hidden:
                await revertHide(aimElem, prevHiddenPos);
                break;
            case aimModes.visible:
            // do nothing
        }
    
        // apply new
        switch (mode) {
            case aimModes.hidden:
                await applyHide(aimElem, hiddenPos);
                break;
            case aimModes.visible:
            // do nothing
        }
    });

}



// i HATE relying on css hashes ASKDASK:LDJ
const navMenuMoreBtnSelector = `.vH6rvf.FJCJfd.IRx9Tb`;

export async function getGoogleNavBarMoreMenu(): Promise<HTMLElement | undefined> {
    return await waitForElm(navMenuMoreBtnSelector) as HTMLElement | undefined;
}

const googleNavBarElemSelector = `div.beZ0tf.O1uzAe[role="list"]`;

export async function getGoogleNavBar(): Promise<HTMLElement | undefined> {
    return (await waitForElm(googleNavBarElemSelector)) as HTMLElement | undefined;
}

const googleNavBarButtonSelector = `[role="listitem"]`;
// export async function getGoogleNavBarButtons(googleNavBarElem: HTMLElement | undefined): Promise<HTMLElement[] | undefined> {
//     return (await getGoogleNavBar())?.querySelectorAll(googleNavBarButtonSelector)
//                                         .values()
//                                         .map((elem) => elem as HTMLElement)
//                                         .toArray();
// }
export function getGoogleNavBarButtons(googleNavBarElem: HTMLElement): HTMLElement[] | undefined {
    return googleNavBarElem.querySelectorAll(googleNavBarButtonSelector)
                            .values()
                            .map((elem) => elem as HTMLElement)
                            .toArray();
}
export async function getGoogleNavBarButtonsAsync(googleNavBarElem: HTMLElement): Promise<HTMLElement[] | undefined> {
    return (await waitForElems(googleNavBarButtonSelector, googleNavBarElem))?.values()
                            .map((elem) => elem as HTMLElement)
                            .toArray();
}
const googleMoreMenuButtonSelector = `div.bsmXxe[role="none"]`;
export function isElemMoreMenuButton(elem: HTMLElement): boolean {
    return elem.matches(googleMoreMenuButtonSelector);
}

export function getGoogleNavBarMoreMenuButtons(googleMoreMenuElem: HTMLElement): HTMLElement[] | undefined {
    return googleMoreMenuElem.querySelectorAll(googleMoreMenuButtonSelector)
                                .values()
                                .map((elem) => elem as HTMLElement)
                                .toArray();
}

export function getNavButtonElem(elem: HTMLElement): HTMLElement | undefined {
    if (elem.matches(googleNavBarButtonSelector)) return elem;

    return elem.querySelector(googleNavBarButtonSelector) as HTMLElement | undefined;
}

export function createMoreMenuButtonTemplate(googleMoreMenuElem: HTMLElement): HTMLElement | undefined {
    // copy a regular more menu button and remove the specific stuff 
    const currentButtons = getGoogleNavBarMoreMenuButtons(googleMoreMenuElem);
    if (!currentButtons) return;

    const template = currentButtons?.at(0);
}

export function getElemWithTextContent(containerElem: HTMLElement, textContent: string): HTMLElement | undefined {
    return [...containerElem.children].filter(elem => elem instanceof HTMLElement)
                                        .find(node => node.textContent === textContent);
}

export async function getAIModeBtn(): Promise<HTMLElement | undefined> {
    // get it if in nav bar
    const googleNavBarElem = await getGoogleNavBar();
    if (!googleNavBarElem) return;

    const elemInNavBar = getElemWithTextContent(googleNavBarElem, "AI Mode");

    if (elemInNavBar) return elemInNavBar;

    // get it if in more menu (and more menu is open)
    const moreMenuElem = await getGoogleNavBarMoreMenu();
    if (!moreMenuElem) return;

    const elemInMoreMenu = getElemWithTextContent(moreMenuElem, "AI Mode");
    if (elemInMoreMenu)
        return getNavButtonElem(elemInMoreMenu);
}

const googleOpenMoreMenuButtonSelector = `[role="button"]`;
export async function getMoreBtn(): Promise<HTMLElement | undefined> {
    const googleNavBarElem = await getGoogleNavBar();
    if (googleNavBarElem)
        return getElemWithTextContent(googleNavBarElem, "More")?.querySelector(googleOpenMoreMenuButtonSelector) as HTMLElement | undefined;
}

const isOpenMoreMenuButtonExpandedSelector = `[aria-expanded="true"]`;
export async function isMoreMenuOpen(): Promise<boolean> {
    const moreBtn = await getMoreBtn();
    if (!moreBtn) return false;
    
    return moreBtn.matches(isOpenMoreMenuButtonExpandedSelector);
}