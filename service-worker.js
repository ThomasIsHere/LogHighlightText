import { Note, generateUniqueId } from './utils-scripts/utils.mjs'
import { getArrayNotesFromLocalStorage, saveAllNotesInChromeStorage } from './utils-scripts/utils-storage.mjs';


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
        if (message.type === "saveNote") { // content-script
            try {
                let newObjToSave = new Note(generateUniqueId(), new Date,currentUrl, message.value)
                arrayHighlightObj.push(newObjToSave)
                saveAllNotesInChromeStorage(arrayHighlightObj)
                sendRefreshMessageToPopup()
            } catch (error) {
                console.log(error)
            }
        } else if (message.type === "clearNotes") { // popup
            arrayHighlightObj.length = 0
        } else if (message.type === "refreshNoteList") { // popup
            if(getArrayNotesFromLocalStorage()){
                arrayHighlightObj = getArrayNotesFromLocalStorage()
            }
        }
    })
    // Handle disconnection
    port.onDisconnect.addListener(() => {})
})


// Send request to popup to refresh
// To be used when note is created
// May be not needed => comment
function sendRefreshMessageToPopup(){
    const port = chrome.runtime.connect({ name: "logNotesPort" })
    port.postMessage({type : "refreshPopup"})
    port.disconnect()
}