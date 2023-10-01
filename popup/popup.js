import { saveFile, notesArrayToPrint, deleteOneNoteInNotesArray } from "../utils-scripts/utils.mjs"
import { saveAllNotesInChromeStorage, getArrayNotesFromLocalStorage } from "../utils-scripts/utils-storage.mjs"


const counterEl = document.getElementById("counter-el")
const ulEl = document.getElementById("ul-el")
const exportBtn = document.getElementById("export-btn")
const cbxOnOff = document.getElementById("cbx-on-off")
const lblOnOff = document.getElementById("lbl-on-off")
const clearBth = document.getElementById("clear-notes-btn")


// On popup js script load render note list and notes count
renderNoteList()


// On load check state of the extension to turn extension on or off
chrome.storage.local.get('state', function(data) {
    if (data.state === 'on') {
        appIsOnElmentBehavior(true)
    } else { // off or undefined
        appIsOnElmentBehavior(false)
    }
})


// Listen on off button
cbxOnOff.addEventListener('change', function() {
    chrome.storage.local.get('state', function(data) {
        if (data.state === 'on') {
            chrome.storage.local.set({state: 'off'})
            appIsOnElmentBehavior(false)
        } else {
            chrome.storage.local.set({state: 'on'})
            appIsOnElmentBehavior(true)
        }
    })
})


// Listen export button click
exportBtn.addEventListener("click", function(){
    chrome.storage.local.get("highlightNotes", function(result) {
        if(result.highlightNotes){
            let date = new Date(Date.now())
            let strToPrint = notesArrayToPrint(JSON.parse(result.highlightNotes))
            saveFile(date.toLocaleDateString() + "_" + date.toLocaleTimeString() + "_notes.txt", strToPrint)
        }
    }) 
})


// Listen clear notes button click
clearBth.addEventListener("click", function(){
    chrome.storage.local.remove(["highlightNotes"],function(){
        var error = chrome.runtime.lastError
           if (error) {
               console.error(error)
           }
    })

    sendMessageToEmptyNotesArrayToServiceWorker()

    renderNoteList()  
})


/**
 * Render list of notes
 */
function renderNoteList(){
    chrome.storage.local.get("highlightNotes", function(result) {
        if(result.highlightNotes){
            let arrayHighlightObj = JSON.parse(result.highlightNotes)
            counterEl.innerHTML = "Note(s) saved: " + arrayHighlightObj.length

            // Empty ul before inserting li
            ulEl.innerHTML = ''

            arrayHighlightObj.forEach(noteObj => {
                let liEl = document.createElement("li")
                liEl.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start") //Boostrap li class
                let text = ""
                if(noteObj.note.length > 50){
                    text = noteObj.note.substring(0, 50) + " ..."
                } else {
                    text = noteObj.note
                }

                // Add delete button to li
                const delBtnEl = document.createElement("button")
                delBtnEl.classList.add("btn", "btn-outline-danger", "btn-sm")
                delBtnEl.appendChild(document.createTextNode("Del"))

                delBtnEl.addEventListener("click", function(){
                    let newNotesArray = deleteOneNoteInNotesArray(noteObj.id, arrayHighlightObj)
                    saveAllNotesInChromeStorage(newNotesArray)
                    sendMessageToServiceWorkerToRefreshNoteList()
                    renderNoteList()
                })

                liEl.appendChild(document.createTextNode(text))
                liEl.appendChild(delBtnEl)

                ulEl.appendChild(liEl)
                ulEl.style.visibility = "visible"
            })
        }else{
            counterEl.innerHTML = "No note saved"
            ulEl.innerHTML = ""
        }
    })
}


/**
 * Request the sw to refresh his list of notes
 */
function sendMessageToServiceWorkerToRefreshNoteList(){
    const port = chrome.runtime.connect({ name: "logNotesPort" })
    port.postMessage({type : "refreshNoteList"})
    port.disconnect()
}


/**
 * Send message to empty the array of notes from service worker in order to clear notes everywhere
 */
function sendMessageToEmptyNotesArrayToServiceWorker(){
    const port = chrome.runtime.connect({ name: "logNotesPort" })
    port.postMessage({type : "clearNotes"})
    port.disconnect()
}


// Listener of message send from service-worker
// May not be needed => comment
chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((message) => {
        if (message.type === "refreshPopup") {
            renderNoteList()
        }
    })
    // Handle disconnection
    port.onDisconnect.addListener(() => {})
})


/**
 * When state is on or of those elements have to be enable or disable:
 * exportBtn clearBth cbxOnOff lblOnOff ulEl
 * @param {*} boolFlag 
 */
function appIsOnElmentBehavior(boolFlag){
    exportBtn.disabled = !boolFlag
    clearBth.disabled = !boolFlag

    if(boolFlag) {
        exportBtn.style.visibility = 'visible'
        clearBth.style.visibility = 'visible'
    } else {
        exportBtn.style.visibility = 'hidden'
        clearBth.style.visibility = 'hidden'
    }

    cbxOnOff.checked = boolFlag
    lblOnOff.innerText = boolFlag ? "On" : "Off"
    
    // Buttons on ul
    const buttons = ulEl.querySelectorAll("button")
    buttons.forEach((button) => {button.disabled = !boolFlag})
}