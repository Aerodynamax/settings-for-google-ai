// POPUP SETTINGS

(async () => {
    const optionsForm = document.getElementById("overviewSettings");
    if (!optionsForm) return;

    // load saved settings
    const { overviewDisplay = "condensed" } =
        await chrome.storage.local.get("overviewDisplay");

    const radio = optionsForm.querySelector(
        `input[name="overviewDisplay"][value="${overviewDisplay}"]`,
    );
    if (radio) radio.checked = true;

    // save settings changes
    optionsForm.addEventListener("change", (event) => {
        var formData = new FormData(optionsForm);

        const options = Object.fromEntries(formData);

        chrome.storage.local.set({
            overviewDisplay: options.overviewDisplay,
        });
    });
})();
