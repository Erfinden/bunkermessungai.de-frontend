


const scrollUpButton = document.getElementById('scrollUpButton');
const scrollDownButton = document.getElementById('scrollDownButton');

function getScrollOffset() {
// Determine the scroll offset based on the device's screen width
const screenWidth = window.innerWidth;
return screenWidth < 900 ? -1000 : -Math.floor(screenWidth / 3);
}

function smoothScrollUp() {
const content = document.getElementById('content');
const scrollOffset = getScrollOffset();
const targetScrollTop = content.scrollTop + scrollOffset;

function scrollAnimation(currentTime) {
    if (!scrollAnimation.startTime) {
        scrollAnimation.startTime = currentTime;
    }

    const progress = (currentTime - scrollAnimation.startTime) / 500; // Adjust the duration (in milliseconds)
    const scrollDistance = targetScrollTop - content.scrollTop;
    const easeFunction = easeOutCubic(progress);

    content.scrollTop += scrollDistance * easeFunction;

    if (progress < 1) {
        requestAnimationFrame(scrollAnimation);
    }
}

requestAnimationFrame(scrollAnimation);
}

function smoothScrollDown() {
const content = document.getElementById('content');
const scrollOffset = getScrollOffset();
const targetScrollTop = content.scrollTop - scrollOffset; // Invert for smooth scroll down

function scrollAnimation(currentTime) {
    if (!scrollAnimation.startTime) {
        scrollAnimation.startTime = currentTime;
    }

    const progress = (currentTime - scrollAnimation.startTime) / 500; // Adjust the duration (in milliseconds)
    const scrollDistance = targetScrollTop - content.scrollTop;
    const easeFunction = easeOutCubic(progress);

    content.scrollTop += scrollDistance * easeFunction;

    if (progress < 1) {
        requestAnimationFrame(scrollAnimation);
    }
}

requestAnimationFrame(scrollAnimation);
}

function easeOutCubic(t) {
return 1 - Math.pow(1 - t, 3);
}

scrollUpButton.addEventListener('click', function () {
setTimeout(smoothScrollUp, 100);
});

scrollDownButton.addEventListener('click', function () {
setTimeout(smoothScrollDown, 100);
});


// Function to toggle the dropdown menu
function toggleDropdown() {
const dropdownMenu = document.getElementById('dropdownMenu');
dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
}

// Function to handle item selection
function selectItem(event) {
const selectedValue = event.target.getAttribute('data-value');
dropdownToggle.textContent = event.target.textContent;
toggleDropdown(); // Close the dropdown menu after selection

// Save the selected value to local storage
localStorage.setItem('selectedDropdownValue', selectedValue);

// Get the stored key from local storage
var storedKey = localStorage.getItem('key');

// Fetch the API with the selected value and key
fetch('http://server:5000/archive', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    key: storedKey,
    selectedValue: selectedValue
    })
})
    .then(response => {
    // Handle the API response here (if needed)
    console.log('API response:', response);
    })
    .catch(error => {
    // Handle any errors that occurred during the API request
    console.error('Error fetching data from API:', error);
    });
}

// Event listener for the dropdown toggle
const dropdownToggle = document.getElementById('dropdownToggle');
dropdownToggle.addEventListener('click', toggleDropdown);

// Event listeners for dropdown items
const dropdownItems = document.querySelectorAll('.dropdown-item');
dropdownItems.forEach(item => item.addEventListener('click', selectItem));

// Default selection from local storage (if available)
const selectedValue = localStorage.getItem('selectedDropdownValue');
if (selectedValue) {
dropdownToggle.textContent = selectedValue;
}

// Check for stored key and trigger API call if available
document.addEventListener('DOMContentLoaded', function () {
var storedKey = localStorage.getItem('key');


function deleteItem(key, name) {
    if (confirm('Willst du dieses Bild wirklich löschen?')) {
        fetch(`http://128.140.90.80:5000/remove_picture/${key}/${name}`, {
            method: 'POST'
        })
        .then(response => {
            console.log('Item deleted:', response);
            window.location.reload();
        })
        .catch(error => {
            console.error('Error deleting item:', error);
            window.location.reload();
        });
    }
}


if (storedKey) {
    // Trigger API call with stored key and selected value
    var selectedValue = localStorage.getItem('selectedDropdownValue');
    if (selectedValue) {
    fetch('http://128.140.90.80:5000/archive', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        key: storedKey,
        selectedValue: selectedValue
        })
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        // Handle the API response here
        console.log('API response:', data);

        // Check if the API response contains names
        if (data.names && data.names.length > 0) {
        var contentDiv = document.getElementById('content');

        // Loop through the names and create items dynamically
        var backgroundDiv = document.getElementById('zoomed-in-background');

        data.names.forEach(name => {
            // Create a new item div
            var itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
        
            // Add an event listener to toggle the zoomed-in class on click
            itemDiv.addEventListener('click', function() {
                itemDiv.classList.remove('zoomed-in');
                backgroundDiv.style.display = 'none';
                if (itemDiv.classList.contains('zoomed-in')) {
                    document.body.removeChild(backgroundDiv);
                    itemDiv.classList.remove('zoomed-in');
                    backgroundDiv.style.display = 'none';
                    bottomText.textContent = itemDiv.getAttribute('data-percentage') + '%';
                } else {
                    itemDiv.classList.add('zoomed-in');
                    backgroundDiv.style.display = 'block';
                    document.getElementById('main').appendChild(backgroundDiv);
                    bottomText.textContent = itemDiv.getAttribute('data-full-text');
        
                    // Add an event listener to the background to zoom out the item when clicked
                    backgroundDiv.addEventListener('click', function() {
                        itemDiv.classList.remove('zoomed-in');
                        backgroundDiv.style.display = 'none';
                        const percentageMatch = itemDiv.getAttribute('data-full-text').match(/Percentage: (\d+(\.\d+)?)%/);
                        if (percentageMatch) {
                            let percentage = parseFloat(percentageMatch[1]);
                            percentage = Math.round(percentage);
                            bottomText.textContent = percentage + '%';
                        }
                    });
                }
            });     

            // Create the top text element
            var topTextDiv = document.createElement('div');
            topTextDiv.classList.add('nameimg');
            var topText = document.createElement('p');
            
            // Extract individual components from the server time
            var [year, month, day, hour, minute, second] = name.split('-').map(Number);
            
            var date = new Date(year, month - 1, day, hour, minute, second);
            date.setTime(date.getTime() + 7200000);
            
            var options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin', hour12: false };
            var formatter = new Intl.DateTimeFormat('de-DE', options);
            
            topText.textContent = formatter.format(date).replace(' ', ' ');
            
            topTextDiv.appendChild(topText);
            
            

            // Create the image element
            var image = document.createElement('img');
            image.src = 'http://128.140.90.80:5000/image/'  + storedKey + '/' + name + '.jpg';

            // Create the bottom text element
            var bottomTextDiv = document.createElement('div');
            bottomTextDiv.classList.add('itemtext');
            var bottomText = document.createElement('p');

            fetch('http://128.140.90.80:5000/text_file/' + storedKey + '/' + name + '.txt')
            .then(response => response.text())
            .then(text => {
                // Use a regular expression to find the percentage value in the text
                const percentageMatch = text.match(/Percentage: (\d+(\.\d+)?)%/);
                
                // Store the full text as a data attribute on the itemDiv
                itemDiv.setAttribute('data-full-text', text);
                
                // Check if a match was found
                if (percentageMatch) {
                    // Get the matched percentage value as a number
                    let percentage = parseFloat(percentageMatch[1]);
                    
                    // Round the percentage to the nearest integer
                    percentage = Math.round(percentage);
                    
                    // Set the rounded percentage as the text content
                    bottomText.textContent = percentage + '%';
                } else {
                    // Handle the case where the percentage could not be found
                    console.error('Could not find percentage in text');
                }
            })
            .catch(error => {
                console.error('Error fetching text:', error);
            });
        

            var trashButton = document.createElement('button');
            trashButton.textContent = '🗑️'; // Papierkorb-Symbol als Textinhalt
            trashButton.addEventListener('click', () => deleteItem(storedKey, name)); // Fügen Sie einen Event-Listener hinzu, um die deleteItem-Funktion aufzurufen
            itemDiv.appendChild(trashButton); // Fügen Sie den Papierkorb-Button dem Artikel hinzu

            // Append the elements to the item div
            bottomTextDiv.appendChild(bottomText);
            itemDiv.appendChild(topTextDiv);
            itemDiv.appendChild(image);
            itemDiv.appendChild(bottomTextDiv);

            // Append the item div to the content div
            contentDiv.appendChild(itemDiv);
        });
        }
    })
    .catch(error => {
        // Handle any errors that occurred during the API request
        console.error('Error fetching data from API:', error);
    });
    }
} else {
    showLoginForm();
}
});