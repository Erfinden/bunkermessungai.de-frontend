document.addEventListener('DOMContentLoaded', function () {
    var storedKey = localStorage.getItem('key');

    if (storedKey) {
        showData(storedKey);
    } else {
        showLoginForm();
    }
});

document.querySelector('#key-form').addEventListener('submit', function (event) {
    event.preventDefault();
    var key = document.getElementById('key').value;
    localStorage.setItem('key', key);
    showData(key);
});

document.getElementById('logout-button').addEventListener('click', function () {
    window.location.reload();
    logout();
    window.location.reload();
});


document.getElementById('delete-account-button').addEventListener('click', function () {
    deleteAccount();
    window.location.reload();
    logout();
    window.location.reload();
});


function showLoginForm() {
    var quickmenu = document.getElementById("quickmenu");
    quickmenu.classList.remove("show"); 
    var keyForm = document.getElementById('key-form');
    keyForm.style.display = 'flex';

    document.getElementById('email-button').disabled = true;
    document.querySelector('#key-form .submit-button').style.display = 'flex';
    document.getElementById('delete-account-button').style.display = 'none';
}

function logout() {
    localStorage.removeItem('key');
    showLoginForm();
    document.getElementById('logout-button').style.display = 'none';
    document.getElementById('delete-account-button').style.display = 'none';
}

function showData(key) {
    fetch('http://128.140.90.80:5000/user_read', {
        method: 'POST',
        body: new URLSearchParams({ key })
    })
        .then(response => response.json())
        .then(function (data) {
            if (data.error) {
                var container = document.querySelector('.container');
                container.classList.remove('show');
                container.innerHTML = '';
                var errorMessage = document.createElement('p');
                errorMessage.textContent = 'Invalid Key!';
                errorMessage.style.fontSize = '24px';
                errorMessage.style.fontWeight = 'bold';
                errorMessage.style.color = 'red';
                errorMessage.style.textAlign = 'center';
                container.appendChild(errorMessage);

                setTimeout(function () {
                    window.location.reload();
                    logout();
                    window.location.reload();
                }, 3000); // Log out after 3 seconds

                return;
            }

            var imageUrl = data.image_url;
            var textFileUrl = data.text_file_url;
            var email = data.email;
            var name =  data.name;

            var emailInput = document.getElementById('email');
            emailInput.placeholder = email;

            var nameInput = document.getElementById('name');
            nameInput.placeholder = name;
            
            var container = document.querySelector('.container');
            container.classList.add('show');

            var imageContainer = document.getElementById('image-container');
            var imageElement = document.createElement('img');
            imageElement.src = imageUrl;
            imageContainer.innerHTML = '';
            imageContainer.appendChild(imageElement);

            var textFileContainer = document.getElementById('text-file-container');
            textFileContainer.innerHTML = '';
            fetch(textFileUrl)
                .then(response => response.text())
                .then(function (text) {
                    var textElement = document.createElement('pre');
                    textElement.textContent = text;
                    textFileContainer.appendChild(textElement);

                    // Extract and round the percentage value
                    var percentage = parseFloat(text.match(/Percentage: (\d+\.\d+)%/)[1]);
                    var roundedPercentage = Math.round(percentage);

                    // Extract the prediction and confidence values
                    var prediction = text.match(/Prediction: (.+)/)[1];
                    var confidence = parseFloat(text.match(/Confidence: (\d+\.\d+)/)[1]);

                    var textContainer = document.getElementById('text-container');
                    textContainer.innerHTML = '';

                    // Display the prediction and confidence values
                    var predictionElement = document.createElement('p');
                    predictionElement.textContent = 'Prediction: ' + prediction;
                    textContainer.appendChild(predictionElement);

                    var confidenceElement = document.createElement('p');
                    confidenceElement.textContent = 'Percentage: ' + percentage + "%";
                    textContainer.appendChild(confidenceElement);

                    var confidenceElement = document.createElement('p');
                    confidenceElement.textContent = 'Confidence: ' + confidence;
                    textContainer.appendChild(confidenceElement);

                    // Display the rounded percentage at the bottom of the page
                    var percentageElement = document.createElement('p');
                    //percentageElement.textContent = 'Rounded Percentage: ' + roundedPercentage + '%';
                    document.body.appendChild(percentageElement);

                    // Create a bar chart

                    var chartCanvas = document.getElementById('barChart');
                    chartCanvas.className = 'chart';
                    chartCanvas.style.maxWidth = '70px';

                    var chartData = {
                        labels: ['Füllstand'],
                        datasets: [{
                            label: '',
                            data: [roundedPercentage],
                            backgroundColor: 'rgba(255, 50, 50, 1)',
                            borderColor: 'rgba(255, 0, 0, 1)',
                            borderWidth: 0,
                        }]
                    };

                    var chartOptions = {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: '',
                                font: {
                                    size: 10
                                    
                                }
                            }
                        },



                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100,
                                ticks: {
                                    stepSize: 10
                                }
                                
                            }
                        }
                    };

                    var barChart = new Chart(chartCanvas, {
                        type: 'bar',
                        data: chartData,
                        options: chartOptions
                    });
                })
                .catch(function (error) {
                    console.error('Error:', error);
                });

            var keyForm = document.getElementById('key-form');
            keyForm.classList.remove('hide');
            keyForm.style.display = 'none';

            var logoutButton = document.getElementById('logout-button');
            logoutButton.style.display = 'block';

            var emailGroup = document.getElementById('email-group');
            emailGroup.style.display = 'flex';

            var emailGroup = document.getElementById('name-group');
            emailGroup.style.display = 'flex';

            var emailInput = document.getElementById('email');
            var emailButton = document.getElementById('email-button');

            emailButton.disabled = false;

            var keyInput = document.getElementById('key');
            keyInput.value = key;
            keyInput.readOnly = true;

            const test = document.querySelector('#email-group .submit-button');
            console.log(test == null, "isNull");

            const test2 = document.querySelector('#name-group .submit-button');
            console.log(test2 == null, "isNull");

            document.querySelector('#email-group .submit-button').style.display = 'block';
            document.querySelector('#name-group .submit-button').style.display = 'block';
            var deleteAccountButton = document.getElementById('delete-account-button');
            deleteAccountButton.style.display = 'block';
            deleteAccountButton.addEventListener('click', deleteAccount);

        });
}

function updateEmail() {
    var key = document.getElementById('key').value;
    var email = document.getElementById('email').value;
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(validRegex)) {
        fetch('http://128.140.90.80:5000/update_email', {
            method: 'POST',
            body: new URLSearchParams({ key, email })
        })
            alert("Email successfully updated to \"" + [email]+ "\"!");
    }
    else{
        alert("Invalid email address!");
    }
}

function updateName() {
    var key = document.getElementById('key').value;
    var name = document.getElementById('name').value;
    fetch('http://128.140.90.80:5000/update_name', {
        method: 'POST',
        body: new URLSearchParams({ key, name })
    })
    alert("Camera Name successfully updated to \"" + [name]+ "\"!");
}

function deleteAccount() {
    var result = confirm("Are you sure?");

    if (result) {
        var key = document.getElementById('key').value;

        fetch('http://128.140.90.80:5000/remove', {
            method: 'POST',
            body: new URLSearchParams({ key })
        })
            .then(response => response.text())
            .then(function (result) {
                console.log(result);
                logout();
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
    }
}
function toggleDarkLightMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    // Store the current mode in localStorage to remember the user's preference
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Check if Dark Mode is already enabled from localStorage
document.addEventListener('DOMContentLoaded', function () {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
});

// Event listener for the Dark/Light Mode button click
document.getElementById('dark-light-mode-button').addEventListener('click', toggleDarkLightMode);

var keyInput = document.getElementById('key');

function toggleKeyVisibility() {
    var revealButton = document.getElementById('reveal-button');

    if (keyInput.type === 'password') {
        keyInput.type = 'text';
        revealButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        keyInput.type = 'password';
        revealButton.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

function openquickmenu(x) {
    x.classList.toggle("change");
    var quickmenu = document.getElementById("quickmenu");
    quickmenu.classList.toggle("show");
}
