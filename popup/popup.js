const counterEl = document.getElementById("counter-el")
const ulEl = document.getElementById("ul-el")
const cbxEl = document.getElementById("cbx-el")
const exportBtn = document.getElementById("export-btn")

// On popup load:
// Set list notes visibility and uncheck checkbox when popup loads
// And populate list of notes as raw objects
chrome.tabs.query({active: true}, (tabs) => {
    setCheckboxAndListVisibility()
    renderNoteList()
})

// Listen checkbox change to display note list in popup
cbxEl.addEventListener('change', function() {
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
    cbxEl.checked = false
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
                let text = noteObj.id +"|"+noteObj.date +"|"+noteObj.url +"|"+noteObj.note +"|"
                liEl.appendChild(document.createTextNode(text))
                ulEl.appendChild(liEl)
            })
        }else{
            counterEl.innerHTML = "No note saved"
        }
    })
}