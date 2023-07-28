// When text is highlight it's saved in array and pass to the storage
document.addEventListener('mouseup', function(event) {
    try {
        chrome.storage.local.get('state', function(data) {
            if(data.state === 'on'){
                let selectedText = window.getSelection().toString()
                if (selectedText && selectedText.trim() !== ''){                    
                    sendNoteToServiceWorker(selectedText)
                    createToast('Selected text is saved', 2000)
                }
            }
        })
    } catch (error){
        console.error(error)
    }
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


/**
 * Display a toast message on the user screen for a specific duration
 * @param {*} message 
 * @param {*} duration 
 */
function createToast(message, duration){
    let toastDiv1 = document.createElement('div')
    toastDiv1.classList.add("toast", "align-items-center")
    toastDiv1.setAttribute('role', 'alert')
    toastDiv1.setAttribute('aria-live', 'assertive')
    toastDiv1.setAttribute('aria-atomic', 'true')

    let toastDiv2 = document.createElement('div')
    toastDiv2.classList.add("d-flex")
    toastDiv1.appendChild(toastDiv2)

    let toastDiv3 = document.createElement('div')
    toastDiv3.classList.add("toast-body")
    toastDiv3.innerHTML = message
    toastDiv3.style.color = 'black'
    toastDiv2.appendChild(toastDiv3)

    document.body.appendChild(toastDiv1)

    toastDiv1.style.opacity = 1
    toastDiv1.style.visibility = 'visible'

    setTimeout(() => {
        toastDiv1.style.opacity = 0;
        toastDiv1.style.visibility = 'hidden';
        setTimeout(() => {
          document.body.removeChild(toastDiv1);
        }, 300);
      }, duration);
}