/**
 * Returns array of notes from local storage
 * @returns arrayNotes
 */
export function getArrayNotesFromLocalStorage(){
    chrome.storage.local.get("highlightNotes", function(result) {
        if(result.highlightNotes){
            return JSON.parse(result.highlightNotes)
        }
    })
}


/**
 * Test function to print storage content
 */
export function printNotesSavedInStorage(){
    chrome.storage.local.get("highlightNotes", function(result) {
        if(result.highlightNotes){
            console.log("Retrieved value:", JSON.parse(result.highlightNotes))
        }
    })
}


/**
 * Save array in storage as JSON string
 * @param {array} value 
 */
export function saveAllNotesInChromeStorage(value){
    chrome.storage.local.set({ highlightNotes: JSON.stringify(value) })
}