export function applyHide(overviewElem: HTMLElement) {
    if (overviewElem)
        overviewElem.style.display = "none"

    // remove padding
    const didYouMeanElemContainer: HTMLElement | null = document.querySelector(`div.YNk70c.EjQTId`)
    const overviewElemContainer: HTMLElement | null = document.querySelector(`div.Kevs9.SLPe5b`)

    if (didYouMeanElemContainer && didYouMeanElemContainer.getElementsByTagName("dynamic-visibility-control").length === 0) {
        didYouMeanElemContainer.style.display = "none"
    }

    if (overviewElemContainer)
        overviewElemContainer.style.display = "none"
}

export function revertHide(overviewElem: HTMLElement) {
    if (overviewElem)
        overviewElem.style.display = ""

    // remove padding
    const otherOverviewElemContainer: HTMLElement | null = document.querySelector(`div.YNk70c.EjQTId`)
    const overviewElemContainer: HTMLElement | null = document.querySelector(`div.Kevs9.SLPe5b`)

    if (otherOverviewElemContainer)
        otherOverviewElemContainer.style.display = ""

    if (overviewElemContainer)
        overviewElemContainer.style.display = ""
}
