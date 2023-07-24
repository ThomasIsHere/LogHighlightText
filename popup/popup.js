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
            saveFile(date.toLocaleDateString() + "_" + date.toLocaleTimeString() + "_notes.txt", JSON.stringify(JSON.parse(result.highlightNotes), null, 2))
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
 * Download file in local
 * @param {string} filename 
 * @param {string} content 
 */
function saveFile(filename, content) {
    // Create a Blob object with the file content
    const blob = new Blob([content], { type: 'text/plain' })
    // Create a temporary link element
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    // Set the filename for the downloaded file
    link.download = filename
    // Programmatically click the link to trigger the download
    link.click()
    // Clean up the URL object
    URL.revokeObjectURL(link.href)
}


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
                const delBtnEl = document.createElement("button")
                delBtnEl.classList.add("btn", "btn-outline-danger", "btn-sm")
                delBtnEl.appendChild(document.createTextNode("Del"))

                delBtnEl.addEventListener("click", function(){
                    deleteOneNote(noteObj.id)
                    sendMessageToServiceWorkerToRefreshNoteList()
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


function deleteOneNote(noteId){
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
}


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
chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((message) => {
        if (message.type === "refreshPopup") {
            renderNoteList()
        }
    })
    // Handle disconnection
    port.onDisconnect.addListener(() => {})
})