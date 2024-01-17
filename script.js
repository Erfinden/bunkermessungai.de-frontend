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

function logout(){
    localStorage.removeItem('key');
    fetch(`${CONFIG.API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
    })
    .then(response => {
        if (!response.ok) {
            alert("Error Logging out!")
        }
        else{
            window.location.href = "/login";
        }
    })
}

logout_button = document.getElementById("logout_button");
logout_button.style="display:none";

function show_logout_botton(){
    if (logout_button.style.display === "none") {
        	logout_button.style="display:block";
    }
    else{
        logout_button.style="display:none";
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
    fetch(`${CONFIG.API_URL}/get_keys`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(response => {
        if (!response.ok) {
            if(response.status === 429) {
                throw new Error('Too many requests. Please try again in a minute.');
            } 
            if(response.status === 401){
                window.location.href = "/login"; 
            }
            else {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
        }
        return response.json();
    })
    .then(data => {
        // Get the items container and placeholder message elements
        let itemsContainer = document.querySelector(".items");
        let placeholderMessage = itemsContainer.querySelector(".placeholder-message");
        let titlePlural = document.getElementById("title-plural");

        // Remove all existing items
        let existingItems = itemsContainer.querySelectorAll(".item");
        existingItems.forEach(item => item.remove());

        if(data.name){
            document.querySelector("#account_name").innerHTML = data.name;
        }

        // Add new items
        data.keys.forEach(keyData => {
            let newItem = document.createElement("div");
            newItem.className = "item";
            newItem.textContent = keyData.name ? keyData.name : `key: ${keyData.key}`;
        
            // Make the item clickable and navigate to /cam when clicked
            newItem.onclick = function() {
                localStorage.setItem('key', keyData.key);
                window.location.href = '/cam';
            };
        
            // Add unlink button
            let unlinkButton = document.createElement("button");
            unlinkButton.className = "unlink-button";
            unlinkButton.innerHTML = "&#10006;"; // "x" symbol
            unlinkButton.onclick = function(e) {
                e.stopPropagation(); // Prevent triggering newItem.onclick
                unlinkKey(keyData.key);
            }
            newItem.appendChild(unlinkButton);
            
            itemsContainer.appendChild(newItem);

            let statuslight = document.createElement("div");
            statuslight.className = "statuslight";
            newItem.appendChild(statuslight)
            itemsContainer.appendChild(newItem)
            if (keyData.status == null){
                statuslight.style.backgroundColor = "grey";
                statuslight.title ="Kamera war noch nie Online";
            }
            else if (keyData.status == 1){
                statuslight.style.backgroundColor = "rgba(26, 255, 0)";
                statuslight.title ="Online";
            }
            else if (keyData.status == 0){
                statuslight.style.backgroundColor = "red";
                statuslight.title ="Offline";
            }
        });



        // Toggle the placeholder message
        if (data.keys.length === 0) {
            placeholderMessage.style.display = "block";
        } else {
            placeholderMessage.style.display = "none";
        }
        // Toggle the titlePlural visibility
        if (data.keys.length >= 2) {
            titlePlural.style.visibility = "visible";
        } else {
            titlePlural.style.visibility = "hidden";
        }
    })
    .then(() => {
        const loader = document.getElementById('loading');
        loader.style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
        const loader = document.getElementById('loading');
        loader.style.display = 'none';
    });
}

submitButton.onclick = function() {
    // Get the secret key from the input field
    let secretKey = secretKeyInput.value;
    
    // Send the secret key to the server
    fetch(`${CONFIG.API_URL}/link_key`, {
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
        updateKeys();
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
        alert("There was an error linking the key. Please try again.");
    });
    // Close the key box and clear the input field
    keyBox.style.opacity = 0;
    keyBox.style.transform = "scale(0) translateY(50%)";
    secretKeyInput.value = "";
}

function unlinkKey(key) {
    if (confirm(`Kamera mit key: "${key}" wirklich von dem Account entfernen?`)){
        // Send a request to unlink the key
        fetch(`${CONFIG.API_URL}/unlink_key`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key: key
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            updateKeys();
        })
        .catch(error => {
            console.error('Error:', error);
            alert("There was an error unlinking the key. Please try again.");
        });
    }
}


document.addEventListener('DOMContentLoaded', (event) => {
    updateKeys();
});