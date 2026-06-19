import { waitForElm } from "../utils";
import { applyCondensed, revertCondensed } from "./condensed";
import { applyHide, revertHide } from "./hide";

// stupid enum workaround
export const overviewModes = {
    hidden: "hidden",
    condensed: "condensed",
    visible: "visible",
} as const;
// create a type from the object values
export type overviewModes =
    (typeof overviewModes)[keyof typeof overviewModes];

export async function apply(mode: overviewModes, prevMode: overviewModes) {
    getOverviewElem().then(overviewElem => {
        if (!overviewElem) return;
    
        // revert previous
        switch (prevMode) {
            case overviewModes.hidden:
                revertHide(overviewElem as HTMLElement);
                break;
            case overviewModes.condensed:
                revertCondensed(overviewElem as HTMLElement);
                break;
            case overviewModes.visible:
                // do nothing
                break;
        }

        debugger;
    
        // apply new
        switch (mode) {
            case overviewModes.hidden:
                applyHide(overviewElem as HTMLElement);
                break;
            case overviewModes.condensed:
                applyCondensed(overviewElem as HTMLElement);
                break;
            case overviewModes.visible:
                // do nothing
                break;
        }
    });
}

// get AI Overview element
// gen vs cache properties: [https://www.diffchecker.com/1hSMKGfo/]
const overviewElemJsName = "dEwkXc";

export async function getOverviewElem(): Promise<HTMLElement | null> {
    return await waitForElm(`[jsname="${overviewElemJsName}"]`) as HTMLElement | null;
}