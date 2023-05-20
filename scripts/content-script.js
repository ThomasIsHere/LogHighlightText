let arrayHighlight = []

chrome.storage.local.get("highlightNotes", function(result) {
    if(result.highlightNotes){
        arrayHighlight = result.highlightNotes
        console.log("Array init with data from storage")
    }
})

document.addEventListener('mouseup', function(event) {
    let selectedText = window.getSelection().toString()
    if (selectedText && selectedText.trim() !== ''){
        try {
            arrayHighlight.push(selectedText)
            saveInChromeStorage(arrayHighlight)
            printDataFromStorage()

        } catch (error) {
            console.log(error)
        }
    }
})


function saveInChromeStorage(value){
    chrome.storage.local.set({ highlightNotes: value }).then(() => {
        console.log("Selected text saved")
    })
}


function printDataFromStorage(){
    chrome.storage.local.get("highlightNotes", function(result) {
        if(result.highlightNotes){
            console.log("Retrieved value:", result.highlightNotes)
        }
    })
}