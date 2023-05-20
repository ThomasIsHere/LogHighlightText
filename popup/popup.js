const counterEl = document.getElementById("counter-el")
const ulEl = document.getElementById("ul-el")
const cbxEl = document.getElementById("cbx-el")
const exportBtn = document.getElementById("export-btn")


window.onload = function() {
    ulEl.style.visibility = "collapse"
    cbxEl.checked = false
}


chrome.storage.local.get("highlightNotes", function(result) {
    if(result.highlightNotes){
        let arrayNotes = Object.values(result.highlightNotes)
        counterEl.innerHTML = "Note(s) saved: " + arrayNotes.length

        arrayNotes.forEach(note => {
            let liEl = document.createElement("li")
            liEl.appendChild(document.createTextNode(note))
            ulEl.appendChild(liEl)
        })
    }
})


cbxEl.addEventListener('change', function() {
    if (this.checked) {
        ulEl.style.visibility = "visible"
    } else {
        ulEl.style.visibility = "collapse" //hidden
    }
})


exportBtn.addEventListener("click", function(){
    chrome.storage.local.get("highlightNotes", function(result) {
        if(result.highlightNotes){
            let arrayNotes = Object.values(result.highlightNotes)
            saveFile("test.txt", arrayNotes)
        }
    }) 
})


function saveFile(filename, content) {
    // Create a Blob object with the file content
    const blob = new Blob([content], { type: 'text/plain' });
  
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
  
    // Set the filename for the downloaded file
    link.download = filename;
  
    // Programmatically click the link to trigger the download
    link.click();
  
    // Clean up the URL object
    URL.revokeObjectURL(link.href);
}