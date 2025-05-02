
// https://stackoverflow.com/a/61511955
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    });
}

// "Searching" preview
waitForElm('.hoqQCc.MyTwIe').then((overview_panel) => {

    // shrink size
    overview_panel.style.setProperty('height', '48px');
    
    // make AI Overview panel be same size as search results
    document.querySelector(".Kevs9.SLPe5b:has(>div[jscontroller='qTdDb']>#eKIzJc)").className += "s6JM6d ufC5Cb";

});

// "Generating" preview
waitForElm('[class="hoqQCc MyTwIe"]').then((progress_elem) => {

    // shrink size
    progress_elem.style.setProperty('height', '48px');

    // make animation less intrusive
    progress_elem.style.setProperty('opacity', '0.2');

    // remove overflowing animation elements
    while ( progress_elem.children[2] ) {
        progress_elem.childNodes.item(2).remove()
    }
    

});

// wait for the AI overview panel to appear
waitForElm('[jsaction="trigger.OiPALb"]').then((btn_showMore) => {

    // shrink AI overview panel height
    overview_panel = document.querySelector(".h7Tj7e");

    overview_panel.style.setProperty('min-height', '150px');
    overview_panel.style.setProperty('max-height', '150px');

    // hide AI text
    AI_text = document.querySelector(".RJPOee.mNfcNd");
    AI_text.style.setProperty('display', 'none');

    // fade
    fade_btn = document.querySelector(".RDmXvc");
    fade_btn.style.removeProperty('background-image');
    // fade_btn.style.setProperty('background', '#101218');

    fade_btn.style.setProperty('min-height', '80px');
    fade_btn.style.setProperty('max-height', '80px');
    
    fade_btn.addEventListener('click', onOpen);
    
    // "Show More" button
    document.querySelector(".clOx1e.sjVJQd>span").textContent = "Show Overview";
    
    // Add openning logic to all "Show More" buttons
    document.querySelectorAll('[jsaction="trigger.OiPALb"]').forEach( btn_elem => btn_elem.addEventListener('click', onOpen) );
    

});

function onOpen() {
    // make AI Overview panel return to default size
    document.querySelector(".Kevs9.SLPe5bs6JM6d.ufC5Cb").className = "Kevs9 SLPe5b";

    // unhide AI text
    AI_text = document.querySelector(".RJPOee.mNfcNd");
    AI_text.style.setProperty('display', 'block');
}