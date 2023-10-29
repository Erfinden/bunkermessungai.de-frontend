document.querySelector(".login-form").addEventListener("submit", function(e){
    e.preventDefault(); // Prevents the default form submission

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch(`${CONFIG.API_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json()) 
    .then(data => {
        if(data.message === "Login successful!") {
            alert("Login successful!");
            window.location.href = "/.."; 
        }
        else {
            alert("Invalid credentials!");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert("There was an error logging in. Please try again.");
    });
});
