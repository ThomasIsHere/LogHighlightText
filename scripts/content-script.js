// When text is highlight it's saved in array and pass to the storage
document.addEventListener('mouseup', function(event) {
    chrome.storage.local.get('state', function(data) {
        if(data.state === 'on'){
            let selectedText = window.getSelection().toString()
            if (selectedText && selectedText.trim() !== ''){
                sendNoteToServiceWorker(selectedText)
            }
        }
    })
})


/**
 * Send note to service worker
 * @param {string} note 
 */
function sendNoteToServiceWorker(note){
    const port = chrome.runtime.connect({ name: "logNotesPort" })
    port.postMessage({type : "saveNote", value : note})
    port.disconnect()
}