// Url not prioritize
/*
let currentUrl = ""

chrome.tabs.onCreated.addListener((tab) => {
    currentUrl = tab.url
    console.log("New tab created with URL:", currentUrl)
})

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        currentUrl = tab.url;
        console.log("Tab activated with URL:", currentUrl)
    })
})

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((message) => {
        if (message === "getTabUrl") {
            port.postMessage(currentUrl)
        }
    })
})
*/