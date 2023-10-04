document.querySelector(".login-form").addEventListener("submit", function(e){
    e.preventDefault(); // Prevents the default form submission

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch('http://127.0.0.1:5000/login', {
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
            document.cookie = `access_token_cookie=${data.access_token}; max-age=${7*24*3600}; samesite=Lax;`;
        
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
