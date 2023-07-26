import { Note, generateUniqueId } from './utils-scripts/utils.mjs'

// On installed set extension state value to off
chrome.runtime.onInstalled.addListener(details => {
    chrome.storage.local.set({state: 'off'})
})


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
        currentUrl = tab.url
    })
})


// Initialize Array of notes (empty if no notes saved or populate with data from local storage)
let arrayHighlightObj = []
if(getArrayNotesFromLocalStorage()){
    arrayHighlightObj = getArrayNotesFromLocalStorage()
}


// Listener of message note send from content-script
chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((message) => {
        if (message.type === "saveNote") {
            try {
                let newObjToSave = new Note(generateUniqueId(), new Date,currentUrl, message.value)
                arrayHighlightObj.push(newObjToSave)
                saveInChromeStorage(arrayHighlightObj)
                printDataFromStorage()
            } catch (error) {
                console.log(error)
            }
        } else if (message.type === "clearNotes") {
            arrayHighlightObj.length = 0
        } else if (message.type === "refreshNoteList") {
            // To be done
        }
    })
    // Handle disconnection
    port.onDisconnect.addListener(() => {})
})


/**
 * Save array in storage as JSON string
 * @param {array} value 
 */
function saveInChromeStorage(value){
    chrome.storage.local.set({ highlightNotes: JSON.stringify(value) }).then(() => {
        sendRefreshMessageToPopup()
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
 * Returns array of notes from local storage
 * @returns arrayNotes
 */
function getArrayNotesFromLocalStorage(){
    chrome.storage.local.get("highlightNotes", function(result) {
        if(result.highlightNotes){
            return JSON.parse(result.highlightNotes)
        }
    })
}


// Send request to popup to refresh
// To be used when note is created
function sendRefreshMessageToPopup(){
    const port = chrome.runtime.connect({ name: "logNotesPort" })
    port.postMessage({type : "refreshPopup"})
    port.disconnect()
}