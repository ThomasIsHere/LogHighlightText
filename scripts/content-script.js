// Manipulate DOM and executes when the page loads

// Listener to the text selection
document.addEventListener('mouseup', function(event) {
    let selectedText = window.getSelection().toString()
    sendSelectedTextToServiceWorker(selectedText)
    console.log("content")
})

// Send Highlight Selected Text to Service Worker
async function sendSelectedTextToServiceWorker(highlightSelectedText){
    const response = await chrome.runtime.sendMessage({selectedText: highlightSelectedText})
    console.log(response.messageReceived)
}