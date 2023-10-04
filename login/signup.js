document.querySelector(".login-form").addEventListener("submit", function(e){
    e.preventDefault(); 

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.querySelector("input[type='password']:nth-child(3)").value;

    // Basic validation
    if(password !== confirmPassword){
        alert("Passwords do not match!");
        return;
    }

    fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
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
        if(data.message === "Signup successful!") {
            window.location.href = "/login"; 
        }
        else {
            alert(data.message); 
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert("There was an error signing up. Please try again.");
    });
});
