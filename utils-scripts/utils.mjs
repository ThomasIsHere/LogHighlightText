/**
 * Note
 */
export class Note {
    constructor(id, date, url, note) {
        this.id = id
        this.date = date
        this.url = url
        this.note = note
    }

    getSiteName() {
        return this.url.split('/')[2]
    }
}


/**
 * Download file in local
 * @param {string} filename 
 * @param {string} content 
 */
export function saveFile(filename, content) {
    try {   
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
    } catch (error) {
        console.error(error)
    }
}


/**
 * Take an array with note objects and returns a string of notes to be export
 * @param {Note[]} arrayNote 
 * @returns string strToPrint
 */
export function notesArrayToPrint(arrayNote){
    let strToPrint = ""
    for(let i=0; i<arrayNote.length; i++){
        let currentNote = new Note(arrayNote[i].id, arrayNote[i].date, arrayNote[i].url, arrayNote[i].note)
        strToPrint = strToPrint + currentNote.getSiteName() + '\n'
        strToPrint = strToPrint + '-'.repeat(currentNote.getSiteName().length) + '\n'
        strToPrint = strToPrint + currentNote.note + '\n\n'
    }
    return strToPrint
}


/**
 * Manually generate unique id
 * @returns uniqueId
 */
export function generateUniqueId() {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    const randomValue = array[0].toString(16)
    const timestamp = Date.now().toString(16)
    const uniqueId = `${randomValue}${timestamp}`
    return uniqueId;
}


/**
 * Removes a specific note id from an array and returns a new array
 * @param {*} noteId 
 * @param {*} arrayNotes 
 * @returns Array of notes minus the removed note
 */
export function deleteOneNoteInNotesArray(noteId, arrayNotes){
    for (let i = 0; i < arrayNotes.length; i++) {
        if (arrayNotes[i].id === noteId) {
            arrayNotes.splice(i, 1)
            break
        }
    }
    return arrayNotes
}