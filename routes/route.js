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
    return ((len <= 6 && len >= 2) ? otp.slice(len) : otp)
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


function checkServerKey(serverKey){
    return sha256(serverKey) == ""
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

router.get("/dart/auth/:serverKey/:mail", async (req, res) => {
    try {
        const { mail, serverKey } = req.params;
        // Handle the server verification
        if(!checkServerKey(serverKey)){
            res.status(404).json({
                success: false,
                message: "Server Key does not match"
            })
        }

        let { CompanyName, otpLength } = req.query;
        console.log(CompanyName)
        if (CompanyName == undefined || CompanyName.length <= 0) {
            CompanyName = "";
        }
        if (validateEmail(mail) && mail.length > 0) {
            let OTP = generateOtp(otpLength);
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
        console.log(error.message);
        res.json({
            status: 404,
            error: "Server error",
            success: false
        });
    }
})

// router.get("/check", async (req, res) => {
//     const { emailId } = req.query;
//     const { password } = req.query;
//     if (validateEmail(emailId)) {
//         const mailData = spawn('python', ['login.py', emailId, password])
//         mailData.stdout.on('data', async (data) => {
//             const result = await data.toString();
//             console.log(result);
//             console.log(result.includes('error'))
//             if (result.includes('error')) {
//                 res.json({
//                     status: 404,
//                     error: "Unable to login",
//                     success: false
//                 })
//             } else {
//                 orgMail = emailId;
//                 orgPass = password;
//                 flag = true;
//                 res.json({
//                     status: 200,
//                     success: true,
//                     message: "Login successful"
//                 })
//             }
//         })
//     } else {
//         res.json({
//             status: 404,
//             success: false,
//             error: "The email ID provided is not valid"
//         })
//     }
// })

// router.get("/pollutionData/:state/:city", async(req, res)=>{
//     try {
//         const {state, city} = req.params;
//         const response = axios.get(`https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key=579b464db66ec23bdd0000014366186ff4384d9c68a2960eb431e72a&format=json&offset=0&filters[state]=${state}&filters[city]=${city}`);
//         console.log(response);
//     } catch (error) {
//         console.log(error.message);
//     }

// })

let _backup = [];
router.get("/fromTravel", async (req, res) => {
    try {
        let isPresent = false, url, availableOptions = [];
        const { from, to } = req.query;
        console.log(from)
        console.log(to)
        if (to !== undefined) {
            isPresent = true;
            // url = `https://api.data.gov.in/resource/1f10d3eb-a425-4246-8800-3f72bf7ad2b0?api-key=${process.env.GOVT_API_KEY}&format=json&filters[from]=${from}&filters[to]=${to}`;
        }
        url = `https://api.data.gov.in/resource/1f10d3eb-a425-4246-8800-3f72bf7ad2b0?api-key=${process.env.GOVT_API_KEY}&format=json&filters[from]=${from}`;
        const response = await axios.get(url);
        if (!isPresent) {
            availableOptions = Object.entries(response.data.records).map((e) => {
                return (e[1].to);
            });
            _backup = response.data.records;
            res.status(200).json({
                toArray: [... new Set(availableOptions)]
            });
            console.log("data sent")
        } else {
            console.log(_backup);
            availableOptions = _backup.filter((place) => {
                if (place.to === to) {
                    return place;
                }
            })

            res.status(200).json({
                toArray: [...availableOptions]
            })
            console.log("Backup Data")
        }
        // console.log(responseOut);
    } catch (error) {
        console.log(error.message)
        res.status(404).json({
            message: "server error",
            success: false
        })
    }
})



module.exports = router