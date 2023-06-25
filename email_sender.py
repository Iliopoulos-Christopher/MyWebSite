import sys
import smtplib
from email.message import EmailMessage
from configpy import sender_email, sender_password, receiver_email

# Retrieve command-line arguments
name = sys.argv[1]
email = sys.argv[2]
message = sys.argv[3]

# Create the email message
email_body = f"Name: {name}\nEmail: {email}\nMessage: {message}"

message = EmailMessage()
message["Subject"] = "New contact form submission"
message["From"] = sender_email
message["To"] = receiver_email
message.set_content(email_body)

try:
    # Connect to the SMTP server
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        # Login to the email account
        server.login(sender_email, sender_password)

        # Send the email
        server.send_message(message)

except smtplib.SMTPAuthenticationError:
    print("Failed to authenticate. Check your email credentials.")
except Exception as e:
    print(f"An error occurred while sending the email: {str(e)}")
