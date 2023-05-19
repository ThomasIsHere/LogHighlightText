// Runs in background by Chrome Browser and cannot use DOM

let selectedTextArray = []

// Listener of sendSelectedTextToServiceWorker
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        sendResponse({messageReceived: true})
        selectedTextArray.push(request.selectedText)
        saveInChromeStorage(selectedTextArray)
        refreshPopup()
    }
);

function saveInChromeStorage(value){
    chrome.storage.local.set({ selectedTextData: value }).then(() => {
        console.log("Worker data is saved in local storage:")
        console.log(value)
    })
}

function refreshPopup(){
    chrome.runtime.sendMessage({ refreshPopup: true })
}
