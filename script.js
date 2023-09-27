// add button
var btn = document.querySelector(".add-button");
var keyBox = document.querySelector(".key-box");
keyBox.onclick = function(event) {
    event.stopPropagation(); 
}
btn.onclick = function(event) {
    event.stopPropagation(); 
    if (keyBox.style.opacity == 0 || keyBox.style.opacity == "") {
        keyBox.style.opacity = 1;
        keyBox.style.transform = "scale(1)";
    } else {
        keyBox.style.opacity = 0;
        keyBox.style.transform = "scale(0)";
    }
}

document.onclick = function(event) {
    if (event.target !== keyBox && event.target !== btn) {
        keyBox.style.opacity = 0;
        keyBox.style.transform = "scale(0)";
    }
}


// no cam text
var itemsContainer = document.querySelector(".items");
var items = itemsContainer.querySelectorAll(".item");
var placeholderMessage = itemsContainer.querySelector(".placeholder-message");

if (items.length === 0) {
    placeholderMessage.style.display = "block";
} else {
    placeholderMessage.style.display = "none";
}
//


// add key box logic 
var secretKeyInput = document.getElementById("secretKeyInput");
var submitButton = document.getElementById("submitButton");

// Ihre bisherigen Event-Listener ...

document.onclick = function(event) {
    if (event.target !== keyBox && event.target !== btn) {
        keyBox.style.opacity = 0;
        keyBox.style.transform = "scale(0) translateY(50%)";
        secretKeyInput.value = ""; // Setzt das Input-Feld zurück
    }
}

submitButton.onclick = function() {
    // Hier können Sie den Wert von secretKeyInput verarbeiten
    console.log("Secret Key:", secretKeyInput.value);
    
    // Optional: Schließen Sie die Box, nachdem der "Submit"-Button geklickt wurde
    keyBox.style.opacity = 0;
    keyBox.style.transform = "scale(0) translateY(50%)";
    secretKeyInput.value = ""; // Setzt das Input-Feld zurück
}
//