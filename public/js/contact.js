// Function to open the Contact Me form
function openContactForm() {
  document.getElementById("contact-form-container").style.display = "block";
}

// Function to close the Contact Me form
function closeContactForm() {
  document.getElementById("contact-form-container").style.display = "none";
}

document.getElementById("contactForm").addEventListener("submit", function (event) {
  event.preventDefault();
  var name = document.getElementById("cname").value;
  var email = document.getElementById("cemail").value;
  var message = document.getElementById("cmessage").value;
  var requestBody = {
    name: name,
    email: email,
    message: message
  };

  // Send the form data to the server using AJAX
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/send-email", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log("Email sent successfully");
        showSuccessNotification("Email sent successfully");
        closeContactForm();
      } else {
        console.error("Error sending email:", xhr.responseText);
        showErrorNotification("Failed to send email");
        closeContactForm();
      }
    }
  };

  xhr.send(JSON.stringify(requestBody));
  document.getElementById("contactForm").reset();
});

document.getElementById("contact-circle").addEventListener("click", openContactForm);
