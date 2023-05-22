// Port listener ofr content-script
/*chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((message) => {
        if (message === "getTabUrl") {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs && tabs.length > 0) {
                    port.postMessage(tabs[0].url)
                }
            })
        }
    })
})*/

// Background service worker script

// Event listener for tab creation
chrome.tabs.onCreated.addListener((tab) => {
    const tabUrl = tab.url;
    console.log("New tab created with URL:", tabUrl);
    // Do something with the URL
  });
  
  // Event listener for tab activation
  chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      const tabUrl = tab.url;
      console.log("Tab activated with URL:", tabUrl);
      // Do something with the URL
    });
  });
  