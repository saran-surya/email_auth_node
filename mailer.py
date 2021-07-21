from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import smtplib
import ssl
import email
import sys
import dotenv
import os

from pathlib import Path
env_path = Path('.') / 'config.env'
dotenv.load_dotenv(dotenv_path=env_path)


OrgMail = os.getenv("mailID")
OrgPass = os.getenv("password")


port = os.getenv("mailPort")
fromMail = "Auth@gmail.com"
toMail = sys.argv[2]
otp = sys.argv[3]
CompanyName = ""
try:
    CompanyName = sys.argv[4]
except IndexError:
    CompanyName = ""


html = ""
with open("template.html", "r") as template:
    for line in template:
        if(html != ""):
            html += line
        else:
            html = line
html += f'Please find your OTP for logging into <b>{CompanyName}</b>'
html += f'<h2>{otp}</h2>\n'

if(sys.argv[1] == 'node'):
    html += f'</div>\n<br>\n<a href="https://www.npmjs.com/package/two-step-auth" target="_blank" rel="noopener noreferrer">\n<div class="closing-banner">\nThis mail was sent with the help of two_step_auth\n</div>\n</a>\n</div>\n</body>\n</html>'
else:
    html += f'</div>\n<br>\n<a href="https://pub.dev/packages/email_auth" target="_blank" rel="noopener noreferrer">\n<div class="closing-banner">\nThis mail was sent with the help of email_auth\n</div>\n</a>\n</div>\n</body>\n</html>'

message = MIMEMultipart('alternative')
message['Subject'] = f"Login OTP for {CompanyName}"
message['From'] = fromMail
converted = MIMEText(html, 'html')
message.attach(converted)
server = smtplib.SMTP('smtp.gmail.com', port)
server.starttls()
try:
    server.login(OrgMail, OrgPass)
    server.sendmail(fromMail, [toMail], message.as_string())
    server.quit()
    print("success sent mail")
except Exception:
    print("Server error cannot send mail")
finally:
    sys.exit(0)
