// TODO: move ts to somewhere with a real filename

// [https://stackoverflow.com/a/61511955]
export function waitForElm(selector: string): Promise<Element | null> {
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true,
        });
    });
}

export function isPeopleAlsoAskBox(peopleAlsoAskElem: Element): boolean {
    if (!(peopleAlsoAskElem instanceof HTMLDivElement))
        return false;
    
    if (peopleAlsoAskElem.getAttribute("jsname") !== "yEVEwb")
        return false;
    
    return true;
}

export function isPeopleAlsoAskBoxAI(peopleAlsoAskElem: Element): boolean {
    if (!isPeopleAlsoAskBox(peopleAlsoAskElem))
        return false;
    
    return null !== peopleAlsoAskElem.querySelector(
        `a[aria-label="Learn more about generative AI. Opens in a new tab."]`
    );
}