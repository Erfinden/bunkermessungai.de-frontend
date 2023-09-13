


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
        data.names.forEach(name => {
            // Create a new item div
            var itemDiv = document.createElement('div');
            itemDiv.classList.add('item');

            // Create the top text element
            var topTextDiv = document.createElement('div');
            topTextDiv.classList.add('nameimg');
            var topText = document.createElement('p');
            topText.textContent = name;
            topTextDiv.appendChild(topText);

            // Create the image element
            var image = document.createElement('img');
            image.src = 'http://128.140.90.80:5000/image/'  + storedKey + '/' + name + '.jpg';

            // Create the bottom text element
            var bottomTextDiv = document.createElement('div');
            bottomTextDiv.classList.add('itemtext');
            var bottomText = document.createElement('p');

            // Fetch the text content for each name
            fetch('http://128.140.90.80:5000/text_file/' + storedKey + '/' + name + '.txt')
            .then(response => response.text())
            .then(text => {
                bottomText.textContent = text;
            })
            .catch(error => {
                console.error('Error fetching text:', error);
            });

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