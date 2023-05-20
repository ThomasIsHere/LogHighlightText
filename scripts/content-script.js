// Manipulate DOM and executes when the page loads

// Listener to the text selection
document.addEventListener('mouseup', function(event) {
    let selectedText = window.getSelection().toString()
    if (selectedText && selectedText.trim() !== ''){
        console.log("content-script: text not empty: " + selectedText.slice(0,10) + " ...")
        sendSelectedTextToServiceWorker(selectedText)
    }
})

// Send Highlight Selected Text to Service Worker
//async 
function sendSelectedTextToServiceWorker(highlightSelectedText){
    //const response = await 
    //chrome.runtime.sendMessage({selectedText: highlightSelectedText})
    // Envoie un message au service worker avec les données
    console.log("content-script: sending text")
    chrome.runtime.sendMessage({ selectedText: highlightSelectedText }, function(response) {
        // Gérer la réponse du service worker si nécessaire
        console.log("content-script: response from service worker :", response);
    })
    console.log("content-script: text was send")
    //console.log("content-script: message with text was send")
    //console.log(response.messageReceived)
}