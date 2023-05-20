const ulEl = document.getElementById("ul-el")
const clearAllBtn = document.getElementById("clear-all-btn")
const refreshBtn = document.getElementById("refresh-btn")

clearAllBtn.addEventListener("click", function(){
    console.log("popup: clear all clicked")
    //chrome.runtime.sendMessage({ clearAll: true })
})


refreshBtn.addEventListener("click", function(){
    getDataFromLocalStorage()
})

function renderSelectedTextList(arraySelectedTextData){
    let listItems = ""
    console.log(arraySelectedTextData)
    arraySelectedTextData.forEach(text => {
        listItems +=`<li>${text}</li>`
    });
    ulEl.innerHTML = listItems
}

function getDataFromLocalStorage(){
    // Retrieve data from local storage
    chrome.storage.local.get("selectedTextData", function(result) {
        console.log("Retrieved value:", result.selectedTextData)
        renderSelectedTextList(result.selectedTextData)
    });
  
}