// Initialize current url empty
let currentUrl = ""

// Set current url when tab is first loaded
chrome.webNavigation.onCommitted.addListener(function(details) {
    if (details.frameId === 0) {
        currentUrl = details.url
    }
});
  
// Set current url when tab is activated (user moves into it)
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        currentUrl = tab.url;
    })
})

// Initialize Array of notes (empty if no notes saved or populate with data from local storage)
let arrayHighlightObj = []
if(getArrayNotesFromLocalStorage()){
    arrayHighlightObj = getArrayNotesFromLocalStorage()
}

// Listener of message note send from content-script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.messageNote) {
        try {
            let newObjToSave = {
                id:generateUniqueId(),
                date: new Date,
                url: currentUrl,
                note:message.messageNote
            }
            arrayHighlightObj.push(newObjToSave)
            console.log(arrayHighlightObj)
            saveInChromeStorage(arrayHighlightObj)
            printDataFromStorage()
            sendResponse({messageReceived : true})
        } catch (error) {
            console.log(error)
            sendResponse({messageReceived : false})
        }
    }
})

/**
 * Save array in storage as JSON string
 * @param {array} value 
 */
function saveInChromeStorage(value){
    chrome.storage.local.set({ highlightNotes: JSON.stringify(value) }).then(() => {
        console.log("Selected text saved")
    })
}

/**
 * Test function to print storage content
 */
function printDataFromStorage(){
    chrome.storage.local.get("highlightNotes", function(result) {
        if(result.highlightNotes){
            console.log("Retrieved value:", JSON.parse(result.highlightNotes))
        }
    })
}

/**
 * Manually generate unique id
 * @returns uniqueId
 */
function generateUniqueId() {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    const randomValue = array[0].toString(16)
    const timestamp = Date.now().toString(16)
    const uniqueId = `${randomValue}${timestamp}`
    return uniqueId;
}

/**
 * Returns array of notes from local storage
 * @returns arrayNotes
 */
function getArrayNotesFromLocalStorage(){
    chrome.storage.local.get("highlightNotes", function(result) {
        if(result.highlightNotes){
            console.log("returnArrayNotesFromLocalStorage")
            return JSON.parse(result.highlightNotes)
        }
    })
}