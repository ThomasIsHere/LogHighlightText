const counterEl = document.getElementById("counter-el")
const ulEl = document.getElementById("ul-el")
const cbxElDisplay = document.getElementById("cbx-el-display")
const exportBtn = document.getElementById("export-btn")
const cbxOnOff = document.getElementById("cbx-on-off")
const clearBth = document.getElementById("clear-notes-btn")

// On popup load:
// Set list notes visibility and uncheck checkbox when popup loads
// And populate list of notes as raw objects
chrome.tabs.query({active: true}, (tabs) => {
    setCheckboxAndListVisibility()
    renderNoteList()
})

// On load check state of the extension to turn extension on or off
chrome.storage.local.get('state', function(data) {
    console.log('On Load data.state: ', data.state)
    if (data.state === 'on') {
        cbxElDisplay.disabled = false
        exportBtn.disabled = false
        cbxOnOff.checked = true
    } else { // off or undefined
        cbxElDisplay.disabled = true
        exportBtn.disabled = true
        cbxOnOff.checked = false
    }
})

// Listen on off button
cbxOnOff.addEventListener('change', function() {
    chrome.storage.local.get('state', function(data) {
        console.log('Checkbox data.state: ', data.state)
        if (data.state === 'on') {
            chrome.storage.local.set({state: 'off'})
            cbxElDisplay.disabled = true
            exportBtn.disabled = true
            console.log('set data.state to off')
        } else {
            chrome.storage.local.set({state: 'on'})
            cbxElDisplay.disabled = false
            exportBtn.disabled = false
            console.log('set data.state to on')
        }
    })
})

// Listen checkbox change to display note list in popup
cbxElDisplay.addEventListener('change', function() {
    if (this.checked) {
        ulEl.style.visibility = "visible"
    } else {
        ulEl.style.visibility = "collapse"
    }
})

// Listen export button click
exportBtn.addEventListener("click", function(){
    chrome.storage.local.get("highlightNotes", function(result) {
        if(result.highlightNotes){
            let arrayNotes = JSON.parse(result.highlightNotes)
            let contentString = ""
            arrayNotes.forEach(note => {
                console.log(note)
                contentString += JSON.stringify(note) + "\n"
            })
            saveFile("test.txt", contentString)
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
 * Set checkbox and list visibility
 */
function setCheckboxAndListVisibility(){
    ulEl.style.visibility = "collapse"
    cbxElDisplay.checked = false
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
                let text = noteObj.note //noteObj.id +"|"+noteObj.date +"|"+noteObj.url +"|"+noteObj.note +"|"
                liEl.appendChild(document.createTextNode(text))
                ulEl.appendChild(liEl)
            })
        }else{
            counterEl.innerHTML = "No note saved"
            ulEl.innerHTML = ""
        }
    })
}

/**
 * Send message to empty the array of notes from service worker in order to clear notes everywhere
 */
function sendMessageToEmptyNotesArrayToServiceWorker(){
    const port = chrome.runtime.connect({ name: "logNotesPort" })
    port.postMessage({type : "clearNotes"})
    port.disconnect()
    console.log("Notes cleared")
}