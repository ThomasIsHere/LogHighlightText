//let currentUrl = ""

// Get current url of the tab user is working on
/*chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0]
    currentUrl = currentTab.url;
})*/

// Sent current tab to content-script
/*chrome.runtime.sendMessage({ url: currentUrl }, (response) => {
    console.log(response);
})*/