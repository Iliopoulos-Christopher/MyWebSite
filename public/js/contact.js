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

  // Get form field values
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;

  // Prepare email body
  var emailBody = "Name: " + name + "       " +
                  "Email: " + email + "       " +
                  "Message: " + message;

  // Send emailBody to Python script using AJAX
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/send-email", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  console.log(xhr.status)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log("Email sent successfully");
        // Display a success notification to the user
        showSuccessNotification("Email sent successfully");
        // Close the contact form
        closeContactForm();
      } else {
        console.error("Error sending email:", xhr.responseText);
        // Display an error notification to the user
        showErrorNotification("Failed to send email");
        // Close the contact form
        closeContactForm();
      }
    }
  };

  xhr.send(JSON.stringify({ emailBody: emailBody }));

  // Reset the form after submission
  document.getElementById("contactForm").reset();
});

document.getElementById("contact-circle").addEventListener("click", openContactForm);
