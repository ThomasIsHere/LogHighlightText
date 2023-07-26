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