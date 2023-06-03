const successNotification = document.getElementById('success-notification');
const errorNotification = document.getElementById('error-notification');

function showSuccessNotification(message) {
  successNotification.textContent = message;
  successNotification.style.display = 'block';
  setTimeout(() => {
    successNotification.style.display = 'none';
  }, 3000);
}

function showErrorNotification(message) {
  errorNotification.textContent = message;
  errorNotification.style.display = 'block';
  setTimeout(() => {
    errorNotification.style.display = 'none';
  }, 3000);
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(this);

  fetch('/login', {
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(formData)),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        return response.text();
      } else if (response.status === 401) {
        throw new Error('Incorrect email or password.');
      } else if (response.status === 404) {
        throw new Error('Email not found.');
      } else {
        throw new Error('Error: ' + response.statusText);
      }
    })
    .then(message => {
      // Check if login was successful or not
      if (message === 'Logged in successfully!') {
        // Make a GET request to retrieve the username
        const email = formData.get('email');
        return fetch(`/getusername/${email}`);
      } else {
        throw new Error(message); // Login error
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to retrieve the username.');
      }
    })
    .then(data => {
      const { username } = data;
      // Store authentication information
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);

      // Perform actions for successful login
      // For example, redirect to another page
      window.location.href = './index.html';
    })
    .catch(error => showErrorNotification(error.message)); // Show error notification
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(this);

  fetch('/signup', {
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(formData)),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 400) {
        throw new Error('Email already in use!');
      } else {
        throw new Error('Error: ' + response.statusText);
      }
    })
    .then(data => {
      if (data.redirect) {
        // Redirect to the login popup
        document.querySelector('.signup-container').style.display = 'none';
        document.querySelector('.login-container').style.display = 'block';

        // Clear the signup form
        this.reset();

        // Display a success notification
        showSuccessNotification(data.message);
      } else {
        // Handle other error cases
        showErrorNotification(data.error);

        // Reopen the signup window
        document.querySelector('.signup-container').style.display = 'block';
      }
    })
    .catch(error => showErrorNotification(error.message)); // Show error notification
});

window.addEventListener('load', function() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const username = localStorage.getItem('username');

  if (isLoggedIn === 'true') {
    showSuccessNotification('Successfully Logged In!');

    // Display the user's name on the navbar
    const usernameDisplay = document.getElementById('usernameDisplay');
    usernameDisplay.textContent = "Hey " + username;
    usernameDisplay.style.display = 'inline-block'; // Show the username

    // Add a logout functionality
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.style.display = 'inline-block'; // Show the logout button

    logoutButton.addEventListener('click', function() {
      // Clear the stored authentication information and refresh the page
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      location.reload();

      // Show logout notification
      showSuccessNotification('Successfully Logged Out!');
    });
  } else {
    const usernameDisplay = document.getElementById('usernameDisplay');
    usernameDisplay.style.display = 'none'; // Hide the username display
  }
});
