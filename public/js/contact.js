// Function to open the Contact Me form
function openContactForm() {
    document.getElementById("contact-form-container").style.display = "block";
  }
  
  // Function to close the Contact Me form
  function closeContactForm() {
    document.getElementById("contact-form-container").style.display = "none";
  }
  
  // Function to handle form submission
  document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault();
    // Perform necessary actions, such as sending the form data to a server
    // You can access form fields using document.getElementById() and retrieve their values
    // Example:
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);
    // Reset the form after submission if needed
    document.getElementById("contactForm").reset();
  });
  