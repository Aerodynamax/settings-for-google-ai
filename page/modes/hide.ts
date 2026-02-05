export function applyHide(overviewElem: HTMLElement) {
    if (overviewElem)
        overviewElem.style.display = "none"

    // remove padding
    const otherOverviewElemContainer: HTMLElement | null = document.querySelector(`div.YNk70c.EjQTId`)
    const overviewElemContainer: HTMLElement | null = document.querySelector(`div.Kevs9.SLPe5b`)

    if (otherOverviewElemContainer)
        otherOverviewElemContainer.style.display = "none"

    if (overviewElemContainer)
        overviewElemContainer.style.display = "none"
}

export function revertHide(overviewElem: HTMLElement) {
    if (overviewElem)
        overviewElem.style.display = "block"

    // remove padding
    const otherOverviewElemContainer: HTMLElement | null = document.querySelector(`div.YNk70c.EjQTId`)
    const overviewElemContainer: HTMLElement | null = document.querySelector(`div.Kevs9.SLPe5b`)

    if (otherOverviewElemContainer)
        otherOverviewElemContainer.style.display = "block"

    if (overviewElemContainer)
        overviewElemContainer.style.display = "block"
}
