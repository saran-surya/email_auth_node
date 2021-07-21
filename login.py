import smtplib
import ssl
import email
import sys
import dotenv
import os
from pathlib import Path

env_path = Path('.') / 'config.env'
dotenv.load_dotenv(dotenv_path=env_path)

OrgMail = sys.argv[1]
OrgPass = sys.argv[2]
port = os.getenv("mailPort")


server = smtplib.SMTP('smtp.gmail.com', port)
server.starttls()
try:
  server.login(OrgMail, OrgPass)
  server.quit()
  print("success")
except smtplib.SMTPAuthenticationError or smtplib.SMTPException:
  print("Server error cannot login")
finally:
  sys.exit(0)