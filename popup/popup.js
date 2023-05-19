const ulEl = document.getElementById("ul-el")
const refreshBtn = document.getElementById("refresh-btn")

refreshBtn.addEventListener("click",
    chrome.storage.local.get("selectedTextData", function(result) {
        let textResults = result.selectedTextData || []
        console.log("Data retrieve from local storage: ", textResults)
        renderSelectedTextList(textResults)
    })
)

function renderSelectedTextList(arraySelectedTextData){
    let listItems = ""
    console.log(arraySelectedTextData)
    arraySelectedTextData.forEach(text => {
        listItems +=`<li>${text}</li>`
    });
    ulEl.innerHTML = listItems
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.refreshPopup) {
        chrome.storage.local.get("selectedTextData", function(result) {
            let textResults = result.selectedTextData || []
            console.log("Data retrieve from local storage: ", textResults)
            renderSelectedTextList(textResults)
        })
    }
})
  