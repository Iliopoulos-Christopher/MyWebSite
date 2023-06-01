
  // Function to open the sign-up pop-up
  function openSignupPopup() {
    window.open('signup.html', '_blank', 'width=500,height=400');
  }

  // Function to open the login pop-up
  function openLoginPopup() {
    window.open('login.html', '_blank', 'width=500,height=400');
  }

  // Add event listeners to the buttons
  document.getElementById('signupButton').addEventListener('click', openSignupPopup);
  document.getElementById('loginButton').addEventListener('click', openLoginPopup);

