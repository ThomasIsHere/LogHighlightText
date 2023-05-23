// When text is highlight it's saved in array and pass to the storage
document.addEventListener('mouseup', function(event) {
    /*let selectedText = window.getSelection().toString()
    if (selectedText && selectedText.trim() !== ''){
        
    }*/
    let selectedText = window.getSelection().toString()
    if (selectedText && selectedText.trim() !== ''){
        sendNoteToServiceWorker(selectedText)
    }
})

function sendNoteToServiceWorker(note){
    chrome.runtime.sendMessage({messageNote : note}, (response) => {
        console.log(response);
    })
}