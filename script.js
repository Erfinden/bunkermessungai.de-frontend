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

function updateKeys() {
    fetch('http://127.0.0.1:5000/get_keys', {
        method: 'GET',
        credentials: 'include',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Get the items container and placeholder message elements
        let itemsContainer = document.querySelector(".items");
        let placeholderMessage = itemsContainer.querySelector(".placeholder-message");

        // Remove all existing items
        let existingItems = itemsContainer.querySelectorAll(".item");
        existingItems.forEach(item => item.remove());

        // Add new items
        data.keys.forEach(key => {
            let newItem = document.createElement("div");
            newItem.className = "item";
            newItem.textContent = key;
            itemsContainer.appendChild(newItem);
        });

        // Toggle the placeholder message
        if (data.keys.length === 0) {
            placeholderMessage.style.display = "block";
        } else {
            placeholderMessage.style.display = "none";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("There was an error fetching the keys. Please try again.");
    });
}

submitButton.onclick = function() {
    // Get the secret key from the input field
    let secretKey = secretKeyInput.value;
    
    // Send the secret key to the server
    fetch('http://127.0.0.1:5000/link_key', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            key: secretKey
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
        alert("There was an error linking the key. Please try again.");
    });
    updateKeys();
    // Close the key box and clear the input field
    keyBox.style.opacity = 0;
    keyBox.style.transform = "scale(0) translateY(50%)";
    secretKeyInput.value = "";
}

document.addEventListener('DOMContentLoaded', (event) => {
    updateKeys();
});