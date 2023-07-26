/**
 * 
 */
export class Note {
    constructor(url, note) {
        this.id = generateUniqueId()
        this.date = new Date
        this.url = url
        this.note = note
    }

    /*introduce() {
        console.log(`Hello, my name is ${this.name}`);
    }*/
}


/**
 * Download file in local
 * @param {string} filename 
 * @param {string} content 
 */
export function saveFile(filename, content) {
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
 * Take an array with note objects and returns a string of notes to be export
 * @param {note} arrayJson 
 * @returns string strToPrint
 */
export function notesArrayToPrint(arrayJson){
    let strToPrint = ""
    for(let i=0; i<arrayJson.length; i++){
        let siteName = arrayJson[i].url.split('/')[2]
        strToPrint = strToPrint + siteName + '\n'
        strToPrint = strToPrint + '-'.repeat(siteName.length) + '\n'
        strToPrint = strToPrint + arrayJson[i].note + '\n\n'
    }
    return strToPrint
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