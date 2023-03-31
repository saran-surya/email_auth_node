const crypto = require("crypto");

// creating the router
const express = require('express');
const router = express.Router();

// spawn for sending the Mails
const { spawn } = require('child_process');

// environment configuration
const dotenv = require('dotenv');
const path = require("path");
const LOGGER = require("../logger");
dotenv.config({
    path: path.resolve(__dirname, "../", "../", "custom", "config.env")
});

const nodeMailer = require("nodemailer");


let mailData = "";


/**
 * Returns a hashed string value : encodes SHA256
 * @param {String} data : Proceed with a string 
 * @returns {String} Hashed string
 */
function sha256(data) {
    return crypto.createHash("sha256").update(data, "binary").digest("base64");
}

/**
 * This function generates a OTP of min length (3) and max length (6)
 * @param {Number} len The length of the OTP, defaults : max = 6 : min = 3
 * @returns {String} A OTP number of desired length 
 */
function generateOtp(len = 6) {
    let otp = String(Math.floor(100000 + Math.random() * 900000));
    return ((len <= 6 && len > 2) ? otp.slice(0, len) : otp)
}

/**
 * This function validates if the provided string is a valid email ID
 * @param {String} email 
 * @returns {Boolean}
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


function checkServerKey(serverKey) {
    if (!serverKey) {
        LOGGER.ERROR(`Server key is not valid :: Recieved ${serverKey}`)
        return false
    }
    var keyVerificationBuffer = sha256(serverKey) == process.env.SERVER_API_KEY
    LOGGER.INFO("Server Key valid")
    return (keyVerificationBuffer)
}


router.get("/test/fail", async (req, res) => {
    LOGGER.WARN("Accessing test route for verification of failure request")
    res.json({
        status: 404,
        mail: "test Phase",
        error: "The mail id is not valid",
        success: false
    });
})


// Test the basic connection for flutter integration
router.get("/test/dart", async (req, res) => {
    try {
        LOGGER.INFO("Accessing test route : /test/dart")
        res.status(200).json({
            "status": "true",
            "message": "test connection to server is successful"
        })
    } catch (error) {
        // console.log(error)
        LOGGER.ERROR(`Error performing operation of route /test/dart : ${error.message}`)
        res.status(500).json({
            "status": "false",
            "message": `Server error : ${error.message}`
        })
    }

})

router.get('/', async (req, res) => {
    // TODO : create  agood home page for admin management if possible

    LOGGER.INFO(`ROUTE : "/"`)
    res.send("Hello Welcome to the homepage");
})


// Takes care of sending the mails
router.get("/dart/auth/:mail", async (req, res) => {
    try {
        LOGGER.INFO(`ROUTE : "/dart/auth/:mail"`)
        const { mail } = req.params;

        // Handle the server verification
        const { key, otpLength } = req.query;
        let { CompanyName } = req.query;


        LOGGER.INFO("Performing server key verification")
        // console.log("-------- Server Key Verification ---------")
        // console.log(key)
        // console.log(sha256(key))
        // console.log(process.env.SERVER_API_KEY)
        // console.log(checkServerKey(key))
        // console.log("------------------------------------------")

        if (!checkServerKey(key)) {
            res.status(404).json({
                success: false,
                message: "Server Key does not match",
                error: "Server Key does not match"
            })
            // console.log(":: Server Key does not match")
            LOGGER.ERROR("Server key not valid")
            return
        }



        if (CompanyName == undefined || CompanyName.length <= 0) {
            LOGGER.WARN(`sessionName is not defined :: Setting value to -> ""`)
            CompanyName = "";
        }

        if (validateEmail(mail) && mail.length > 0) {
            LOGGER.INFO("Mail validation success")
            let OTP = generateOtp(otpLength ? otpLength : null);
            // console.log(path.resolve(__dirname, "../", 'mailer.py'))
            // return false
            LOGGER.INFO("Calling python process for sending emails")
            
            // TODO : Add migration to NODE JS (100%)
            // sendNodeMail(mail, OTP)
            // return
            mailData = spawn('python', [path.resolve(__dirname, "../", 'mailer.py'), 'dart', mail, OTP, CompanyName])
            mailData.stdout.on('data', async (data) => {
                const readerData = await data.toString();
                // console.log(data.toString());
                LOGGER.INFO(readerData);
                if (readerData.includes('error')) {
                    LOGGER.ERROR(`Error sending email`, readerData)
                    res.json({
                        status: 404,
                        mail: mail,
                        success: false,
                        message: "Unable to send mail",
                        error: readerData
                    })
                } else {
                    LOGGER.INFO(`Successfully sent email : ${mail.slice(0, 3)}... : OTP : ${OTP.toString().slice(0, 3)}...`)
                    res.json({
                        status: 200,
                        mail: mail,
                        OTP: OTP,
                        success: true
                    });
                }
            })
        } else {
            LOGGER.WARN("Provided email ID is not valid", mail)
            res.json({
                status: 404,
                mail: mail,
                error: "The mail id is not valid",
                success: false
            });
        }
    } catch (error) {
        // console.log(error)
        // console.log(error.message);
        LOGGER.ERROR("Server error", error.message)
        res.json({
            status: 501,
            error: "Server error",
            success: false
        });
    }
})


/**
 * Test function to check feasiblity of NODE JS conversion with NODE Mailer and plugins
 * @param {string} mail Email ID of the reciever
 * @param {number} OTP The OTP to be sent to the reciever
 */
function sendNodeMail(mail, OTP){
    var nodeOutlook = require("nodejs-nodemailer-outlook")
    nodeOutlook.sendEmail({
        auth: {
            user: process.env.mailID,
            pass: process.env.password
        },
        from: 'sender@outlook.com',
        to: mail,
        subject: 'This is TEST EMIAL',
        text: "This is OTP" + OTP,

        onError : (e) => console.log(e),
        onSuccess : (i) => console.log(i)
    })
}

module.exports = router;
