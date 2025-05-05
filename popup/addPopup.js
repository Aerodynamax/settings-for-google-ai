// https://github.com/iamOmarFaruk/chrome-extension-rounded-popup-corners/blob/main/background.js

// Listen for the extension icon to be clicked
chrome.action.onClicked.addListener((tab) => {
    // Get the current tab ID
    const tabId = tab.id;
    
    // Inject the content script into the current tab
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['popup/createPopup.js']
    });
    
    console.log(`Content script injected into tab ${tabId}`);
  }); 