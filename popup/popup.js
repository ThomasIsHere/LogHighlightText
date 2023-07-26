import { saveFile } from "../utils-scripts/utils.mjs"

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
        exportBtn.disabled = false
        clearBth.disabled = false

        const buttons = ulEl.querySelectorAll("button")
        buttons.forEach((button) => {button.disabled = false})
        
        cbxOnOff.checked = true
        lblOnOff.innerText = "On"
    } else { // off or undefined
        exportBtn.disabled = true
        clearBth.disabled = true

        const buttons = ulEl.querySelectorAll("button")
        buttons.forEach((button) => {
            button.disabled = true
        })

        cbxOnOff.checked = false
        lblOnOff.innerText = "Off"
    }
})


// Listen on off button
cbxOnOff.addEventListener('change', function() {
    chrome.storage.local.get('state', function(data) {
        if (data.state === 'on') {
            chrome.storage.local.set({state: 'off'})
            exportBtn.disabled = true
            clearBth.disabled = true

            const buttons = ulEl.querySelectorAll("button")
            buttons.forEach((button) => {button.disabled = true})

            lblOnOff.innerText = "Off"
        } else {
            chrome.storage.local.set({state: 'on'})
            exportBtn.disabled = false
            clearBth.disabled = false
            
            const buttons = ulEl.querySelectorAll("button")
            buttons.forEach((button) => {button.disabled = false})

            lblOnOff.innerText = "On"
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
                /*const delBtnEl = document.createElement("button")
                delBtnEl.classList.add("btn", "btn-outline-danger", "btn-sm")
                delBtnEl.appendChild(document.createTextNode("Del"))

                delBtnEl.addEventListener("click", function(){
                    deleteOneNote(noteObj.id)
                    sendMessageToServiceWorkerToRefreshNoteList()
                })*/

                liEl.appendChild(document.createTextNode(text))
                //liEl.appendChild(delBtnEl)

                ulEl.appendChild(liEl)
                ulEl.style.visibility = "visible"
            })
        }else{
            counterEl.innerHTML = "No note saved"
            ulEl.innerHTML = ""
        }
    })
}


/*function deleteOneNote(noteId){
    chrome.storage.local.get("highlightNotes", function(result) {
        arrayHighlightObj = JSON.parse(result.highlightNotes)
        console.log("BEFORE", arrayHighlightObj)
        for (let i = 0; i < arrayHighlightObj.length; i++) {
            if (arrayHighlightObj[i].id === noteId) {
                console.log("TO DELETE", arrayHighlightObj[i])
                arrayHighlightObj.splice(i, 1)
                break
            }
        }
        console.log("AFTER", arrayHighlightObj)
    })
}*/


/*function sendMessageToServiceWorkerToRefreshNoteList(){
    const port = chrome.runtime.connect({ name: "logNotesPort" })
    port.postMessage({type : "refreshNoteList"})
    port.disconnect()
}*/


/**
 * Send message to empty the array of notes from service worker in order to clear notes everywhere
 */
function sendMessageToEmptyNotesArrayToServiceWorker(){
    const port = chrome.runtime.connect({ name: "logNotesPort" })
    port.postMessage({type : "clearNotes"})
    port.disconnect()
}


// Listener of message send from service-worker
chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((message) => {
        if (message.type === "refreshPopup") {
            renderNoteList()
        }
    })
    // Handle disconnection
    port.onDisconnect.addListener(() => {})
})


function notesArrayToPrint(arrayJson){
    let strToPrint = ""
    for(let i=0; i<arrayJson.length; i++){
        let siteName = arrayJson[i].url.split('/')[2]
        strToPrint = strToPrint + siteName + '\n'
        strToPrint = strToPrint + '-'.repeat(siteName.length) + '\n'
        strToPrint = strToPrint + arrayJson[i].note + '\n\n'
    }
    return strToPrint
}