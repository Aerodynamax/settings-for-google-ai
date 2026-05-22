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

export async function getFromStorageOrDefault(key: string, defaultValue: string): Promise<string> {
    let value = await chrome.storage.local.get([key]);
    
    if (value) {
        if (typeof value[key] === "string" || value[key] instanceof String) {
            return value[key] as string;
        }
    }
    return defaultValue;
}