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
export function printNotesSavedInStorage(logText){
    chrome.storage.local.get("highlightNotes", function(result) {
        if(result.highlightNotes){
            console.log(logText + " - Retrieved value:", JSON.parse(result.highlightNotes))
        }else{
            console.log(logText + " - Storage is empty")
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


/**
 * Gest storage space in MB
 * @returns bytes in MB
 */
export function getStorageSpaceMb(){
    chrome.storage.local.getBytesInUse(null, function(bytesInUse) {
        return bytesInUse / 1000000
    })
}