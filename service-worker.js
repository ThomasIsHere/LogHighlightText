// Runs in background by Chrome Browser and cannot use DOM

let selectedTextArray = []

// Listener of sendSelectedTextToServiceWorker
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.selectedText){
            console.log("service-worker: text received: " + request.selectedText.slice(0,10))
            sendResponse({messageReceived: true})
            //console.log("service-worker: response sent")
            selectedTextArray.push(request.selectedText)
            console.log("service-worker: datas in array")
            console.log("=================================")
            console.log(selectedTextArray)
            console.log("=================================")
            saveInChromeStorage(selectedTextArray)
        }
    }
)

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.clearAll) {
        chrome.storage.local.clear(function() {
            console.log("service-worker: Data cleared successfully!")
        })
    }
})

function saveInChromeStorage(value){
    chrome.storage.local.set({ selectedTextData: value }).then(() => {
        console.log("service-worker: data is saved in local storage:")
        console.log(value)
    })
}