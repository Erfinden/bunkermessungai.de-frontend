function loadPage() {
    fetch(`${CONFIG.API_URL}/get_userdata`, {
        credentials: 'include',
        method: 'GET'
    })
        .then(response => {
            if (response.status === 401) {
                window.location.href = "/login";
            }
            return response.json();
        })
        .then(data => {
            if (!data) {
                logout();
            }
            if (data.error) {
                alert(data.error);
            } else {
                document.getElementById('username').innerHTML = data.username;
                document.getElementById('email').innerHTML = data.user_email;
                document.getElementById('full_name').innerHTML = data.fullname;
                document.getElementById('region').innerHTML = data.region;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

loadPage();

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
            window.location.href = "/../login";
        }
    })
}

function toggleEdit() {

    const usernameElement = document.getElementById('username');
    const fullNameElement = document.getElementById('full_name');
    const emailElement = document.getElementById('email');
    const regionElement = document.getElementById('region');
    
    if (usernameElement.contentEditable === 'true') {
        usernameElement.contentEditable = 'false';
        fullNameElement.contentEditable = 'false';
        emailElement.contentEditable = 'false';
        document.getElementById('save_button').style.display = 'none';
        document.getElementById('map_popup_button').style.display = 'none';
    } else {
        usernameElement.contentEditable = 'true';
        fullNameElement.contentEditable = 'true';
        emailElement.contentEditable = 'true';
        document.getElementById('save_button').style.display = 'inline-block';
        document.getElementById('map_popup_button').style.display = 'block';
    }
}

function save(){
    const usernameElement = document.getElementById('username');
    const fullNameElement = document.getElementById('full_name');
    const emailElement = document.getElementById('email');
    const regionElement = document.getElementById('region');

    fetch(`${CONFIG.API_URL}/update_userdata`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_email: emailElement.innerHTML,
            fullname: fullNameElement.innerHTML,
            new_username: usernameElement.innerHTML,
            region: regionElement.innerHTML
        }),
    })
    .then(response => {
        if (!response.ok) {
            response.json().then(data => {
                const errorMessage = data.message;
                alert(errorMessage);
                loadPage();
            });
        }
        else{
            toggleEdit();
            loadPage();
        }
    })
}


// username validation
var usernameElement = document.getElementById('username');

usernameElement.addEventListener('input', function() {
    if (this.innerText.includes(' ')) {
        this.style.color = 'red';
    } else {
        this.style.color = 'white';
    }
});

// email validation
var emailElement = document.getElementById('email');
emailElement.addEventListener('input', function() {
    const user_email = this.innerText;
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailRegex.test(user_email)) {
        this.style.color = 'red';
    } else {
        this.style.color = 'white';
    }
});

// full name validation
var fullNameElement = document.getElementById('full_name');
fullNameElement.addEventListener('input', function() {
    if (this.innerText.split(' ').length > 2) {
        this.style.color = 'red';
    } else {
        this.style.color = 'white';
    }
});

// region autocomplete with google api

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 52.5200, lng: 13.4050}, // default location
        zoom: 4,
        streetViewControl: false, // Remove Street View Pegman
        mapTypeControlOptions: {
            mapTypeIds: []
        } // Remove satellite view option
    });

    var geocoder = new google.maps.Geocoder;

    map.addListener('click', function(event) {
        geocodeLatLng(geocoder, map, event.latLng);
    });
}

function geocodeLatLng(geocoder, map, latLng) {
    geocoder.geocode({'location': latLng}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                document.getElementById('region').innerHTML = results[0].formatted_address;
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}

async function loadGoogleMapsAPI() {
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAc5JtU8XE0eKgOY6dan2S4u83qLHSBgVA&callback=initMap';
    script.async = true;
    document.head.appendChild(script);
}

function showMapPopup() {
    document.getElementById('mapPopup').style.display = 'block';
    loadGoogleMapsAPI();
    document.getElementById('map').style.display = 'block';
    document.getElementById('close_button').style.display = 'block';
}

function closeMapPopup() {
    document.getElementById('mapPopup').style.display = 'none';
    document.getElementById('map').style.display = 'none';
    document.getElementById('close_button').style.display = 'none';
}
