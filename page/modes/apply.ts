import { waitForElm } from "../utils";
import { applyCondensed, revertCondensed } from "./condensed";
import { applyHide, revertHide } from "./hide";

export type overviewModes = "hidden" | "condensed" | "visible";

export function apply(mode: overviewModes, prevMode: overviewModes) {
    getOverviewElem().then(overviewElem => {
        if (!overviewElem) return;
    
        // revert previous
        switch (prevMode) {
            case "hidden":
                revertHide(overviewElem as HTMLElement);
                break;
            case "condensed":
                revertCondensed(overviewElem as HTMLElement);
                break;
            case "visible":
            // do nothing
        }
    
        // apply new
        switch (mode) {
            case "hidden":
                applyHide(overviewElem as HTMLElement);
                break;
            case "condensed":
                applyCondensed(overviewElem as HTMLElement);
                break;
            case "visible":
            // do nothing
        }
    });
}

// get AI Overview element
// gen vs cache properties: [https://www.diffchecker.com/1hSMKGfo/]
const overviewElemJsName = "dEwkXc";

export async function getOverviewElem(): Promise<HTMLElement | null> {
    return await waitForElm(`[jsname="${overviewElemJsName}"]`) as HTMLElement | null;
}