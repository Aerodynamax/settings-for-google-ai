
(function() {

popup = document.getElementById("BetterAIOverviewSettings");

// delete if already on screen
if ( popup != null ) { 
    popup.remove();
    return;
}

popup = document.createElement("iframe");

popup.id = "BetterAIOverviewSettings";

popup.style.zIndex = "9999";
popup.style.border = "0";
popup.style.borderRadius = "10px";

popup.style.position = "fixed";
popup.style.top = "10px";
popup.style.right = "10px";

popup.style.width = "399px";
popup.style.height = "399px";

document.body.appendChild(popup);

popup.src = chrome.runtime.getURL('/popup/index.html');

})();