import sys
import smtplib
from email.message import EmailMessage

# Email credentials
sender_email = 'iliopoulos.christopher@gmail.com'
sender_password = 'vnrllcoavzjgczsl'
receiver_email = 'iliopoulos.christopher@gmail.com'

# Create the email message
message = EmailMessage()
message["Subject"] = "New contact form submission"
message["From"] = sender_email
message["To"] = receiver_email
message.set_content(sys.argv[1])

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
