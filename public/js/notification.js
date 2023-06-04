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
      if (message === 'Logged in successfully!') {
        const email = formData.get('email');
        return fetch(`/getusername/${email}`);
      } else {
        throw new Error(message);
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
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      updateAccountDropdown(username); 
      window.location.href = './index.html';
    })
    .catch(error => showErrorNotification(error.message));
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
        document.querySelector('.signup-container').style.display = 'none';
        document.querySelector('.login-container').style.display = 'block';
        this.reset();
        showSuccessNotification(data.message);
      } else {
        showErrorNotification(data.error);
        document.querySelector('.signup-container').style.display = 'block';
      }
    })
    .catch(error => showErrorNotification(error.message));
});

window.addEventListener('load', function() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const username = localStorage.getItem('username');

  if (isLoggedIn === 'true') {
    showSuccessNotification('Successfully Logged In!');
    const usernameDisplay = document.getElementById('usernameDisplay');
    usernameDisplay.textContent = "Hey " + username;
    usernameDisplay.style.display = 'inline-block'; 
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.style.display = 'inline-block'; 

    logoutButton.addEventListener('click', function() {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      location.reload();
      showSuccessNotification('Successfully Logged Out!');
    });

    updateAccountDropdown(username); 
  } else {
    const usernameDisplay = document.getElementById('usernameDisplay');
    usernameDisplay.style.display = 'none';
    updateAccountDropdown(null); 
  }
});

function updateAccountDropdown(username) {
  const signupButton = document.getElementById('signupButton');
  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');

  if (username) {
    signupButton.style.display = 'none';
    loginButton.style.display = 'none';
    logoutButton.style.display = 'inline-block';
  } else {
    signupButton.style.display = 'inline-block';
    loginButton.style.display = 'inline-block';
    logoutButton.style.display = 'none';
  }
}
