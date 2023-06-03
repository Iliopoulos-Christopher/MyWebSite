// Open signup form
document.getElementById('signupButton').addEventListener('click', function() {
  document.querySelector('.signup-container').style.display = 'block';
  document.querySelector('.contact-form-overlay').style.display = 'block';
});

// Close signup form
document.querySelector('.signup-container .close').addEventListener('click', function() {
  document.querySelector('.signup-container').style.display = 'none';
  document.querySelector('.contact-form-overlay').style.display = 'none';
});
