
export function appyHide(AIModeElement: HTMLElement) {
    AIModeElement.setAttribute("AIMDisplay", AIModeElement.style.display);
    AIModeElement.style.display = "none";

    const googleNavBarElem = AIModeElement.parentElement;

    console.log("nav elem: ");
    console.log(googleNavBarElem);

    if (googleNavBarElem !== null) {
        googleNavBarElem.setAttribute("AIMMarginLeft", googleNavBarElem.style.marginLeft);
        googleNavBarElem.style.setProperty("margin-left", "0px", "important");
    }
}


export function revertHide(AIModeElement: HTMLElement) {
    let origDisplay = AIModeElement.getAttribute("AIMDisplay");
    AIModeElement.style.display = (origDisplay !== null) ? origDisplay : AIModeElement.style.display;

    const googleNavBarElem = AIModeElement.parentElement;

    if (googleNavBarElem) {
        let origMarginLeft = googleNavBarElem.getAttribute("AIMMarginLeft");
        googleNavBarElem.style.marginLeft = (origMarginLeft !== null) ? origMarginLeft : googleNavBarElem.style.marginLeft;
    }

}