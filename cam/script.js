window.addEventListener('load', function () {
    var storedKey = localStorage.getItem('key');
    if (storedKey) {
        showData(storedKey);
    } else {
        logout();
    }
});

//document.getElementById('delete-account-button').addEventListener('click', function () {
//    deleteAccount();
//});

var sendpercentupper = 50;
var sendpercentlower = 50;

function showData(key) {
    fetch(`${CONFIG.API_URL}/user_read`, {
        method: 'POST',
        body: new URLSearchParams({ key }),
        credentials: 'include'
    })
        .then(response => {
            if (response.status === 429) {
                document.getElementById('toomanyrequests').style.display = 'block';
                console.log("Rate limit exceeded");
                //turn off anglue-down
                document.getElementById("angle-down").style.display = "none";
                document.getElementById("status-light").style.display = "none";
                throw new Error("Rate limit exceeded"); 
            }
            if(response.status === 401){
                window.location.href = "/login"; 
            }
            if(response.status === 402){
                var statuslight = document.getElementById('status-light');
                statuslight.style.backgroundColor = "grey";
                statuslight.title ="Kamera war noch nie Online";
                document.getElementById("camera-not-setup").style.display = "flex"; 
                throw new Error("Camera not setup");
            }
            return response.json(); 
        })
        .then(function (data) {
            if (data.error === "Invalid key.") {
                console.log(data.error)
                document.getElementById('invalidkey').style.display = 'block';
                logout()
                return;
            }

            // Hide the loader after the fetch request is completed
            const loader = document.getElementById('loading');
            loader.style.display = 'none';

            var imageUrl = data.image_url;
            var textFileUrl = data.text_file_url;
            var email = data.email;
            var name =  data.name;
            var username = data.username;
            var status = data.status;
            sendpercentlower = data.sendpercentlower;
            sendpercentupper = data.sendpercentupper;

            if(username){
                document.querySelector("#account_name").innerHTML = username;
            }

            var datetop = document.getElementById('datetop');
            datetop.style.display = 'block';
            // Extract date-time string from the imageUrl
            var match = imageUrl.match(/(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})\.jpg$/);
            if (match) {
                var dateTimeStr = match[1];

                // Extract individual components from the date-time string
                var [year, month, day, hour, minute, second] = dateTimeStr.split('-').map(Number);

                var date = new Date(year, month - 1, day, hour, minute, second);
                
                // Date is now in UCT, convert to local time zone
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

                var options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin', hour12: false };
                var formatter = new Intl.DateTimeFormat('de-DE', options);

                var formattedDate = formatter.format(date);
                
                // Do what you want with formattedDate. For instance, set it as innerHTML:
                datetop.innerHTML = formattedDate;
            } else {
                console.error("Failed to extract date-time from imageUrl");
            }



            var emailInput = document.getElementById('email');
            if (email != null){
                emailInput.placeholder = email;
            }

            var sliderupper = document.getElementById("uppervalue");
            var outputupper = document.getElementById("uppervaluepercent");
            sliderupper.value = sendpercentupper;
            outputupper.innerHTML = sendpercentupper;
            outputupper.innerHTML = sliderupper.value;
            
            sliderupper.oninput = function() {
                outputupper.innerHTML = this.value;
            }
            var sliderlower = document.getElementById("lowervalue");
            var outputlower = document.getElementById("lowervaluepercent");
            sliderlower.value = sendpercentlower;
            outputlower.innerHTML = sendpercentlower;   
            outputlower.innerHTML = sliderlower.value;
            
            // Function to update the background color after the pointer for the lower slider
            function updateLowerSliderBackground() {
                var percent = (sliderlower.value - sliderlower.min) / (sliderlower.max - sliderlower.min) * 100;
                sliderlower.style.background = `linear-gradient(to right, rgb(52, 52, 52) ${percent}%, transparent ${percent}%)`;
            }
            
            // Function to update the background color after the pointer for the upper slider
            function updateUpperSliderBackground() {
                var percent = (sliderupper.value - sliderupper.min) / (sliderupper.max - sliderupper.min) * 100;
                sliderupper.style.background = `linear-gradient(to left, rgb(52, 52, 52) ${100 - percent}%, transparent ${100 - percent}%)`;
            }
            
            // Call the functions to set the initial background color for both sliders
            updateLowerSliderBackground();
            updateUpperSliderBackground();
            
            // Add event listeners to update the output elements and background colors when slider values change
            sliderlower.oninput = function() {
                outputlower.innerHTML = this.value;
                updateLowerSliderBackground();
            };
            
            sliderupper.oninput = function() {
                outputupper.innerHTML = this.value;
                updateUpperSliderBackground();
            };

            var nameInput = document.getElementById('name');
            if (name != null){
                nameInput.placeholder = name;
            }
                
            var titlename = document.getElementById("header-title")
            if(name){
                titlename.innerHTML = name
            }
            
            var container = document.querySelector('.container');
            container.classList.add('show');

            var imageContainer = document.getElementById('image-container');
            var imageElement = document.createElement('img');
            imageElement.src = imageUrl;
            imageElement.alt = "latest pic";
            imageContainer.innerHTML = '';
            imageContainer.appendChild(imageElement);

            var textFileContainer = document.getElementById('text-file-container');
            textFileContainer.innerHTML = '';
            fetch(textFileUrl, {
                credentials: 'include'
            })
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


                    // Create a bar chart
                    var barColor;
                    if (roundedPercentage < sendpercentlower) {
                        barColor = 'rgba(255, 50, 50, 1)'; // Red
                    } else { 
                        barColor = 'rgba(0, 128, 0, 1)'; // Green
                    }

                    var chartCanvas = document.getElementById('barChart');
                    chartCanvas.className = 'chart';
                    chartCanvas.style.maxWidth = '50px';

                    var chartData = {
                        labels: ['Füllstand'],
                        datasets: [{
                            label: '',
                            data: [roundedPercentage],
                            backgroundColor: barColor,
                            borderWidth: 1,
                            barThickness: 20 
                        }]
                    };

                    var chartOptions = {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            },
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
                                    stepSize: 10,
                                    display: false,
                                }
                                
                            },
                            x: {
                                beginAtZero: true,
                                ticks: {
                                    color: 'white' 
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

            var archive_btn= document.getElementById('archive_btn');
            archive_btn.style.display = 'flex';

            var camlink= document.getElementById('camlink');
            camlink.style.display = 'flex';

            var camlinktop= document.getElementById('camlinktop');
            camlinktop.style.display = 'none';

            var emailGroup = document.getElementById('email-group');
            emailGroup.style.display = 'flex';

            var emailGroup = document.getElementById('name-group');
            emailGroup.style.display = 'flex';

            var statuslight = document.getElementById('status-light');
            statuslight.style.display = 'flex';

            var emailGroup = document.getElementById('slider-container');
            emailGroup.style.display = 'flex';

            var angledown = document.getElementById('angle-down');
            angledown.style.display = 'flex';

            if (status == 1){
                statuslight.style.backgroundColor = "rgba(26, 255, 0)";
                statuslight.title ="Online";
                // Show content
                document.getElementById('content').style.display = 'flex';
            }
            else if (status == 0){
                statuslight.style.backgroundColor = "red";
                statuslight.title ="Offline";
                // Show content
                document.getElementById('content').style.display = 'flex';
            } else{
                statuslight.style.backgroundColor = "grey";
                statuslight.title ="Kamera war noch nie Online";
                document.getElementById("camera-not-setup").style.display = "flex";
            }

            var emailInput = document.getElementById('email');
            var emailButton = document.getElementById('email-button');

            emailButton.disabled = false;

            var keyInput = document.getElementById('key');
            keyInput.value = key;
            keyInput.readOnly = true;

            document.querySelector('#email-group .submit-button').style.display = 'block';
        
            })


    .catch(error => {
        if (error.message && error.message.includes('NetworkError')) {
            var networkerr = document.getElementById('networkerr');
            networkerr.style.display = 'block';
            console.error('Network error:', error);
        } else {
            console.error('Other error:', error);
        }
        // Hide the loader even if there is an error
        const loader = document.getElementById('loading');
        loader.style.display = 'none';
    });
}


function updatelowervalue() {
    var key = document.getElementById('key').value;
    var lowervalue = document.getElementById('lowervalue').value;
    if (lowervalue.match(/^(100|[1-9][0-9]?)$/)) {
        // Compare lowervalue with sendpercentlower before sending the fetch request
        if (lowervalue == sendpercentlower) {
        } else {
            fetch(`${CONFIG.API_URL}/update_lowervalue`, {
                method: 'POST',
                body: new URLSearchParams({ key, lowervalue }),
                credentials: 'include'
            });
            alert("Low Value successfully updated to " + lowervalue + "% !");
        }
    } else {
        alert("Invalid Low Value!");
    }
}


function updateuppervalue() {
    var key = document.getElementById('key').value;
    var uppervalue = document.getElementById('uppervalue').value;
    if (uppervalue.match(/^(100|[1-9][0-9]?)$/)) {
        // Compare uppervalue with sendpercentupper before sending the fetch request
        if (uppervalue == sendpercentupper) {
        } else {
            fetch(`${CONFIG.API_URL}/update_uppervalue`, {
                method: 'POST',
                body: new URLSearchParams({ key, uppervalue }),
                credentials: 'include'
            });
            alert("High Value successfully updated to " + uppervalue + "% !");
        }
    } else {
        alert("Invalid High Value!");
    }
}


function updateEmail() {
    var key = document.getElementById('key').value;
    var email = document.getElementById('email').value;
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(validRegex)) {
        fetch(`${CONFIG.API_URL}/update_email`, {
            method: 'POST',
            body: new URLSearchParams({ key, email }),
            credentials: 'include'
        })
            alert("Email successfully updated to \"" + [email]+ "\"!");
    }else if (!email){
        
    }else{
        alert("Invalid email address!");
    }
}

function updateName() {
    var key = document.getElementById('key').value;
    var name = document.getElementById('name').value;
    if(name){
        fetch(`${CONFIG.API_URL}/update_name`, {
            method: 'POST',
            body: new URLSearchParams({ key, name }),
            credentials: 'include'
        })
        alert("Camera Name successfully updated to \"" + [name]+ "\"!");
    }
}

function deleteAccount() {
    var result = confirm("Are you sure, that you want to delete the account?");
    if (result){
        var result2 = confirm("Are you really sure?");
        
        if (result2) {
            var key = document.getElementById('key').value;

            fetch(`${CONFIG.API_URL}/remove`, {
                method: 'POST',
                body: new URLSearchParams({ key }),
                credentials: 'include'
            })
                .then(response => response.text())
                .then(function (result) {
                    console.log(result);
                    alert("Account successfully deleted!")
                    logout();
                    window.location.reload()
                })
                .catch(function (error) {
                    console.error('Error:', error);
                });
        }
    }
}

document.body.classList.add('dark-mode');

function openquickmenu(x) {
    x.classList.toggle("change");
    document.getElementById("quickmenu").classList.toggle("show");
}



var isOpen = false;

function openadv() {
    var adv = document.getElementById("adv");
    var angleDownIcon = document.getElementById("angle-down");

    if (isOpen) {
        adv.style.maxHeight = "0";
        adv.style.opacity = "0";
        setTimeout(function() {
            adv.style.display = "none";
        }, 300); // Set the same duration as the CSS transition (0.3s)
    } else {
        adv.style.display = "flex";
        setTimeout(function() {
            adv.style.maxHeight = "500px"; // Adjust the height as needed
            adv.style.opacity = "1";
        }, 0); // Allow some time for the element to be displayed before animating
    }

    isOpen = !isOpen;
    var rotationDegree = isOpen ? 180 : 0;
    angleDownIcon.style.transform = `rotate(${rotationDegree}deg)`;
}

function adjustPlotlyChart() {
    var plotlyChart = document.querySelector('#diagramm .plotly-graph-div');
    if (plotlyChart) {
        plotlyChart.style.width = '100%';
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
            window.location.href = "/../login";
        }
    })
}


function account_page(){
    window.location.href = "/../account";
}
