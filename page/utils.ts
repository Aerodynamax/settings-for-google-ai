// TODO: move ts to somewhere with a real filename

// [https://stackoverflow.com/a/61511955]
export function waitForElm(selector: string, fromElem: Element | Document = document): Promise<Element | null> {
    return new Promise((resolve) => {
        if (fromElem.querySelector(selector)) {
            return resolve(fromElem.querySelector(selector));
        }

        const observer = new MutationObserver((mutations) => {
            if (fromElem.querySelector(selector)) {
                observer.disconnect();
                resolve(fromElem.querySelector(selector));
            }
        });

        observer.observe(fromElem, {
            childList: true,
            subtree: true,
        });
    });
}
export function waitForElems(selector: string, fromElem: Element | Document = document): Promise<NodeListOf<Element> | null> {
    return new Promise((resolve) => {
        if (fromElem.querySelectorAll(selector).length) {
            return resolve(fromElem.querySelectorAll(selector));
        }

        const observer = new MutationObserver((mutations) => {
            if (fromElem.querySelectorAll(selector).length) {
                observer.disconnect();
                resolve(fromElem.querySelectorAll(selector));
            }
        });

        observer.observe(fromElem, {
            childList: true,
            subtree: true,
        });
    });
}

export async function getFromStorageOrDefault<ValueType>(key: string, defaultValue: ValueType): Promise<ValueType> {
    let value = await chrome.storage.local.get([key]);
    
    // i don't remember what this was for but i'm not brave enough atm to delete it
    if (value) {
        if (typeof value[key] === "string" || value[key] instanceof String) {
            return value[key] as ValueType;
        }
    }
    return defaultValue as ValueType;
}