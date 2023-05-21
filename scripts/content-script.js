let arrayHighlightObj = []
let currentUrl = ""

/*
On page load:
Initialize arrayHighlightObj with storage data if they exist
*/
chrome.storage.local.get("highlightNotes", function(result) {
    if(result.highlightNotes){
        arrayHighlightObj = JSON.parse(result.highlightNotes)
        console.log("Array init with data from storage")
    }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.url){
        currentUrl = request.url
        sendResponse("urlReceived")
    }
})

// When text is highlight it's saved in array and pass to the storage
document.addEventListener('mouseup', function(event) {
    let selectedText = window.getSelection().toString()
    if (selectedText && selectedText.trim() !== ''){
        try {
            let newObjToSave = {
                id:generateUniqueId(),
                date: new Date,
                url:currentUrl,
                note:selectedText
            }
            arrayHighlightObj.push(newObjToSave)
            saveInChromeStorage(arrayHighlightObj)
            printDataFromStorage()

        } catch (error) {
            console.log(error)
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