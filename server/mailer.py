"""
Module sends the mail as a helper for the node spawn process
"""

# path module
from pathlib import Path

# SMTP server essentials
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib

# Configuration section
import sys
import os
import re
import dotenv

try:

    env_path = os.path.join(Path.cwd(), "custom", "config.env")
    dotenv.load_dotenv(dotenv_path=env_path)

    OrgMail = os.getenv("mailID")
    OrgPass = os.getenv("password")


    port = os.getenv("mailPort")
    FROM_MAIL = "Medcore.gp@outlook.com"
    TO_MAIL = sys.argv[2]
    OTP = sys.argv[3]
    COMPANY_NAME = ""
    try:
        COMPANY_NAME = sys.argv[4]
    except IndexError:
        print("No company name present")
        COMPANY_NAME = ""

    # Create the HTML file
    HTML = ""
    STYLESHEET = ""

    with open(os.path.join(Path.cwd(), "custom", "style.css"), "r", encoding="utf-8") as template:
        STYLESHEET = template.readlines()

    with open(os.path.join(Path.cwd(), "custom", "index.html"), "r", encoding="utf-8") as template:
        for LINE in template:
            REGEX = r"({.*})"

            # Checking the presence of the style element
            if ("{style}" in re.findall(REGEX, LINE)):
                LINE += "\n<style>\n"
                LINE += "".join(STYLESHEET)
                LINE += "\n</style>\n"

            # Check the presence of the company name
            if ("{COMPANY_NAME}" in re.findall(REGEX, LINE)):
                splitLINE = LINE.split()
                for element in splitLINE:
                    if(re.match(REGEX, element)):
                        # print(splitLINE.index(element))
                        splitLINE[splitLINE.index(element)] = COMPANY_NAME
                LINE = " ".join(splitLINE)

            # Checking the presence of the OTP
            if ("{OTP}" in re.findall(REGEX, LINE)):
                splitLINE = LINE.split()
                for element in splitLINE:
                    if(re.match(REGEX, element)):
                        splitLINE[splitLINE.index(element)] = OTP
                LINE = " ".join(splitLINE)

            # Creating the HTML
            if ("</body>" in LINE) :
                # Adding the footer for the package
                HTML += '<br/><a href="https://pub.dev/packages/email_auth" target="_blank" rel="noopener noreferrer">Sent using email_auth</a>'
            HTML = HTML + LINE if(HTML != "") else LINE

    # with open("template.HTML", "w") as template:
    #     template.writeLINEs(HTML)

    message = MIMEMultipart('alternative')
    message['Subject'] = f"Login OTP for {COMPANY_NAME} is {OTP}"
    converted = MIMEText(HTML, 'HTML')
    message.attach(converted)
    # server = smtplib.SMTP('smtp.gmail.com', port)
    server = smtplib.SMTP('smtp.office365.com', port)
    server.starttls()
    try:
        server.login(OrgMail, OrgPass)
        server.sendmail(FROM_MAIL, [TO_MAIL], message.as_string())
        server.quit()
        print("PYTHON SERVER :: success sent mail")
    except Exception as error:
        print(error)
        print("PYTHON SERVER :: Server error -> Mailing section")
    finally:
        sys.exit(0)
except Exception as error:
    print(error)
    print("Server error cannot send mail : section main")
