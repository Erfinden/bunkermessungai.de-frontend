document.addEventListener('DOMContentLoaded', function() {
    var storedKey = localStorage.getItem('key');
  
    if (storedKey) {
      showData(storedKey);
    } else {
      showLoginForm();
    }
});
  
document.querySelector('#key-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var key = document.getElementById('key').value;
    localStorage.setItem('key', key);
    showData(key);
});
  
document.getElementById('logout-button').addEventListener('click', function() {
    window.location.reload();
    logout(); 
    window.location.reload();
});


document.getElementById('delete-account-button').addEventListener('click', function() {
    deleteAccount();
    window.location.reload();
    logout();
    window.location.reload();
});


function showLoginForm() {
    var keyForm = document.getElementById('key-form');
    keyForm.style.display = 'block';
  
    // Reset other elements
    document.getElementById('email').value = '';
    document.getElementById('email-button').disabled = true;
    document.querySelector('#key-form .submit-button').style.display = 'block';
    document.getElementById('delete-account-button').style.display = 'none';
}

function logout() {
    localStorage.removeItem('key');
    showLoginForm();
    document.getElementById('logout-button').style.display = 'none';
    document.getElementById('delete-account-button').style.display = 'none';
}

function showData(key) {
    fetch('http://<server-ip>//:5000/user_read', {
        method: 'POST',
        body: new URLSearchParams({ key })
    })
    .then(response => response.json())
    .then(function(data) {
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

            setTimeout(function() {
                window.location.reload();
                logout();
                window.location.reload();
            }, 3000); // Log out after 3 seconds

            return;
        }

        var imageUrl = data.image_url;
        var textFileUrl = data.text_file_url;

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
            .then(function(text) {
                var textElement = document.createElement('pre');
                textElement.textContent = text;
                textFileContainer.appendChild(textElement);
            })
            .catch(function(error) {
                console.error('Error:', error);
            });

        var keyForm = document.getElementById('key-form');
        keyForm.classList.remove('hide');

        var logoutButton = document.getElementById('logout-button');
        logoutButton.style.display = 'block';

        var emailGroup = document.getElementById('email-group');
        emailGroup.style.display = 'flex';

        var emailInput = document.getElementById('email');
        var emailButton = document.getElementById('email-button');

        emailInput.value = data.email;
        emailButton.disabled = false;

        var keyInput = document.getElementById('key');
        keyInput.value = key;
        keyInput.readOnly = true;

        document.querySelector('#key-form .submit-button').style.display = 'none';
        var deleteAccountButton = document.getElementById('delete-account-button');
        deleteAccountButton.style.display = 'block';
        deleteAccountButton.addEventListener('click', deleteAccount);
    });
}

function updateEmail() {
    var key = document.getElementById('key').value;
    var email = document.getElementById('email').value;  
  
    fetch('http://<server-ip>:5000/update_email', {
        method: 'POST',
        body: new URLSearchParams({ key, email })
    })
    .then(response => response.json())
    .then(function(data) {
        if (data && data.error) {
            console.error('Error:', data.error);      
        } else {
            console.log('Email updated successfully');
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
    });
}

function deleteAccount() {
    var result = confirm("Are you sure?");

    if (result) {
        var key = document.getElementById('key').value;

        fetch('http://<server-ip>:5000/remove', {
            method: 'POST',
            body: new URLSearchParams({ key })
        })
        .then(response => response.text())
        .then(function(result) {
            console.log(result);
            logout();
        })
        .catch(function(error) {
            console.error('Error:', error);
        });
    }
}


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
