import { waitForElm } from "../utils";
import { applyHide, revertHide } from "./hide";

export type aimModes = "hidden" | "visible";

export function apply(mode: aimModes, prevMode: aimModes) {
    getAIModeBtn().then(aimElem => {
        if (!aimElem) return;

        
        // revert previous
        switch (prevMode) {
            case "hidden":
                revertHide(aimElem);
                break;
            case "visible":
            // do nothing
        }
    
        // apply new
        switch (mode) {
            case "hidden":
                applyHide(aimElem);
                break;
            case "visible":
            // do nothing
        }
    });

}

export const googleNavBarElemSelector = `div.beZ0tf.O1uzAe[role="list"]`;

export async function getGoogleNavBar(): Promise<HTMLElement | undefined> {
    return (await waitForElm(googleNavBarElemSelector)) as HTMLElement | undefined;
}

export function getElemWithTextContent(containerElem: HTMLElement, textContent: string): HTMLElement | undefined {
    return [...containerElem.children].filter(elem => elem instanceof HTMLElement)
                                        .find(node => node.textContent === textContent);
}

export async function getAIModeBtn(): Promise<HTMLElement | undefined> {
    const googleNavBarElem = await getGoogleNavBar();
    if (!googleNavBarElem) return;

    return getElemWithTextContent(googleNavBarElem, "AI Mode");
}