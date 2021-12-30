# path module
from pathlib import Path

# SMTP server essentials
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import smtplib
import ssl
import email

# Configuration section
import sys
import dotenv
import os
import re

try:

    env_path = os.path.join(Path.cwd(), "custom", "config.env")
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
        print("No company name present")
        CompanyName = ""

    # Create the HTML file
    html = ""
    styleSheet = ""

    with open(os.path.join(Path.cwd(), "custom", "style.css"), "r") as template:
        styleSheet = template.readlines()

    with open(os.path.join(Path.cwd(), "custom", "index.html"), "r") as template:
        for line in template:
            regex = r"({.*})"

            # Checking the presence of the style element
            if ("{style}" in re.findall(regex, line)):
                line += "\n<style>\n"
                line += "".join(styleSheet)
                line += "\n</style>\n"

            # Check the presence of the company name
            if ("{CompanyName}" in re.findall(regex, line)):
                splitLine = line.split()
                for element in splitLine:
                    if(re.match(regex, element)):
                        # print(splitLine.index(element))
                        splitLine[splitLine.index(element)] = CompanyName
                line = " ".join(splitLine)

            # Checking the presence of the OTP
            if ("{OTP}" in re.findall(regex, line)):
                splitLine = line.split()
                for element in splitLine:
                    if(re.match(regex, element)):
                        splitLine[splitLine.index(element)] = otp
                line = " ".join(splitLine)

            # Creating the html
            if("</body>" in line):
                # Adding the footer for the package
                html += f'<br/><a href="https://pub.dev/packages/email_auth" target="_blank" rel="noopener noreferrer">Sent using email_auth</a>'
            html = html + line if(html != "") else line

    # with open("template.html", "w") as template:
    #     template.writelines(html)

    message = MIMEMultipart('alternative')
    message['Subject'] = f"Login OTP for {CompanyName}"
    message['to'] = f"{toMail}"
    converted = MIMEText(html, 'html')
    message.attach(converted)
    server = smtplib.SMTP('smtp.gmail.com', port)
    server.starttls()
    try:
        server.login(OrgMail, OrgPass)
        server.sendmail(fromMail, [toMail], message.as_string())
        server.quit()
        print("success sent mail")
    except Exception as error:
        print(error)
        print("Server error cannot send mail : section 1")
    finally:
        sys.exit(0)
except Exception as error:
    print(error)
    print("Server error cannot send mail : section main")
