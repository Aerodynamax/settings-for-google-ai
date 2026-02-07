// POPUP SETTINGS

(async () => {
    const optionsForm = document.getElementById("overviewSettings");
    if (!optionsForm) return;

    // load saved settings
    const { overviewDisplay = "condensed" } =
        await chrome.storage.local.get("overviewDisplay");

    const overviewRadio = optionsForm.querySelector(
        `input[name="overviewDisplay"][value="${overviewDisplay}"]`,
    );
    if (overviewRadio) overviewRadio.checked = true;

    const { peopleAlsoAskDisplay = "labelled" } =
        await chrome.storage.local.get("peopleAlsoAskDisplay");

    const peopleAlsoAskRadio = optionsForm.querySelector(
        `input[name="peopleAlsoAskDisplay"][value="${peopleAlsoAskDisplay}"]`,
    );
    if (peopleAlsoAskRadio) peopleAlsoAskRadio.checked = true;

    // save settings changes
    optionsForm.addEventListener("change", (event) => {
        var formData = new FormData(optionsForm);

        const options = Object.fromEntries(formData);

        chrome.storage.local.set({
            overviewDisplay: options.overviewDisplay,
            peopleAlsoAskDisplay: options.peopleAlsoAskDisplay,
        });
    });
})();
