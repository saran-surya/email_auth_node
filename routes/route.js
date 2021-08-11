const crypto = require("crypto");

// creating the router
const express = require('express');
const router = express.Router();

// spawn for sending the Mails
const { spawn } = require('child_process');

// environment configuration
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});


let mailData = "";


/**
 * Returns a hashed string value
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
        return false
    }
    return (sha256(serverKey) == process.env.SERVER_API_KEY)
}


router.get("/test/fail", async (req, res) => {
    res.json({
        status: 404,
        mail: "test Phase",
        error: "The mail id is not valid",
        success: false
    });
})

router.get('/', async (req, res) => {
    res.send("Hello Welcome to the homepage");
})


// Takes care of sending the mails
router.get("/dart/auth/:mail", async (req, res) => {
    try {
        const { mail } = req.params;
       
        // Handle the server verification
        const { key, otpLength } = req.query;
        let { CompanyName } = req.query;

        console.log("-------- Server Key Verification ---------")
        // console.log(key)
        // console.log(sha256(key))
        // console.log(process.env.SERVER_API_KEY)
        console.log(process.env.SERVER_API_KEY == sha256(key))
        console.log("------------------------------------------")


        if (!checkServerKey(key)) {
            res.status(404).json({
                success: false,
                message: "Server Key does not match"
            })
            console.log(":: Server Key does not match")
            return
        }

        if (CompanyName == undefined || CompanyName.length <= 0) {
            CompanyName = "";
        }

        if (validateEmail(mail) && mail.length > 0) {
            let OTP = generateOtp(otpLength ? otpLength : null);
            mailData = spawn('python', ['mailer.py', 'dart', mail, OTP, CompanyName])
            mailData.stdout.on('data', async (data) => {
                const readerData = await data.toString();
                console.log(data.toString());
                if (readerData.includes('error')) {
                    res.json({
                        status: 404,
                        mail: mail,
                        success: false,
                        message: "Unable to send mail"
                    })
                } else {
                    res.json({
                        status: 200,
                        mail: mail,
                        OTP: OTP,
                        success: true
                    });
                }
            })
        } else {
            res.json({
                status: 404,
                mail: mail,
                error: "The mail id is not valid",
                success: false
            });
        }
    } catch (error) {
        console.log(error)
        console.log(error.message);
        res.json({
            status: 404,
            error: "Server error",
            success: false
        });
    }
})



module.exports = router