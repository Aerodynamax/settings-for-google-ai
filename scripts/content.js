
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

// "Generating" preview
waitForElm('[class="hoqQCc MyTwIe"]').then((progress_elem) => {

    // remove overflowing animation elements
    while ( progress_elem.children[2] ) {
        progress_elem.childNodes.item(2).remove()
    }

});

// wait for final AI overview panel to appear
waitForElm('[jsaction="trigger.OiPALb"]').then((btn_showMore) => {

    // shrink AI overview panel height
    overview_panel = document.querySelector(".h7Tj7e");

    overview_panel.style.setProperty('min-height', '150px');
    overview_panel.style.setProperty('max-height', '150px');

    // "Show More" button
    document.querySelector(".clOx1e.sjVJQd>span").textContent = "Show Overview";
    
    // Add openning logic to all "Show More" buttons
    document.querySelectorAll('[jsaction="trigger.OiPALb"]').forEach( btn_elem => btn_elem.addEventListener('click', onOpen) );
    
});

function onOpen() {
    // make AI Overview panel return to default size

    search_size_overview = document.querySelector(".Kevs9.SLPe5bs6JM6d.ufC5Cb")
    
    if (search_size_overview) {
        search_size_overview.className = "Kevs9 SLPe5b";
    }
}


// center if needed
waitForElm("#Odp5De:not(:has(.Kevs9.SLPe5b.HdCKGe)) .Kevs9:has( #eKIzJc )").then((overview_container) => {

    waitForElm("#center_col").then((search_results) => {

        overview_container = document.querySelector("#Odp5De:not(:has(.Kevs9.SLPe5b.HdCKGe)) .Kevs9:has( #eKIzJc )");

        if (overview_container != null) { overview_container.className += "s6JM6d ufC5Cb"; }
    });

    // make AI Overview panel be same size as search results
    
    // "searching" often messes with this, delete incorrect styling.Kevs9.SLPe5bs6JM6d.ufC5Cb
    // document.querySelector("#Odp5De:has(.Kevs9.SLPe5b.HdCKGe) .Kevs9.SLPe5bs6JM6d.ufC5Cb").className = "Kevs9 SLPe5b";
    // (change the size if there isn't a long snippet at the top)
    // document.querySelector("#Odp5De:not(:has(.Kevs9.SLPe5b.HdCKGe)) .Kevs9.SLPe5b:has(>div[jscontroller='qTdDb']>#eKIzJc)")
    
    // if (document.querySelectorAll("#Odp5De>.YNk70c.EjQTId").length < 3) {
    //     document.querySelector(".Kevs9.SLPe5b:has(>div[jscontroller='qTdDb']>#eKIzJc)").className += "s6JM6d ufC5Cb";
    // }

});