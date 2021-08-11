#!/usr/bin/env node
const readline = require("readline");
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');



// Globals
let mailID;
let password;
let SERVER_API_KEY;
const mailPort = 587;

// Local
let API_KEY;

/**
 * This function handles the main package errors
 * @param {Error} error 
 */
function handlePackageErrors(error) {
    console.log("\n--- package Error ---")
    console.log(error)
    console.log("--- package Error ---")
    console.log(`\nemail-auth-node >> (ERROR) : ${error.message}`)
    console.log("email-auth-node >> Error from package, Kindly raise an issue here")
    process.exit(0)
}


function displayHelp() {
    console.log("----------------- Package Help -----------------\n")
    console.log("Options available with 'email-auth-node' : ")
    console.log("Options : ")
    console.log("\t --verify : This will verify the index.html file for the mandatory fields.")
    console.log("\t >> usage >> npx email-auth-node --verify")
    console.log("\n\t --generate : This will create a command line interface for generating the server config")
    console.log("\t >> usage >> npx-email-auth-node --generate")
    console.log("\n\nemail-auth-node >> New features are coming soon...")
    console.log("\n----------------- Package Help -----------------")
}


// Generates a random serverKey
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

/**
 * Returns a hashed string value
 * @param {String} data : Proceed with a string 
 * @returns {String} Hashed string
 */
function sha256(data) {
    return crypto.createHash("sha256").update(data, "binary").digest("base64");
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

function createConfig(reader) {
    return new Promise((resolve, reject) => {
        let writer = fs.createWriteStream(path.resolve(__dirname, "../", "config.env"))
        writer.write(`mailID = ${mailID.toString()}\n`)
        writer.write(`password = ${password}\n`)
        writer.write(`mailPort = 587\n`)
        // Closing the read stream
        writer.write(`SERVER_API_KEY = ${SERVER_API_KEY}\n\n# ------ Flutter guidlines ------\n# In your Flutter project create a config.env file in the lib folder\n# server = server url \n# key = ${API_KEY}`, () => {
            reader.close()
        })

        writer.close()
        resolve()
    })

}

function verifyHTML() {
    return new Promise((resolve, reject) => {
        try {
            let htmlData = fs.readFileSync(path.resolve(__dirname, "../", "index.html"))
            const htmlRegEx = /({.*})/gm
            const verificationParams = ['{style}', '{CompanyName}', '{OTP}'].toString()
            if (htmlData.toString().match(htmlRegEx).toString() == verificationParams) {
                console.log("email-auth-node >> verification success...")
                resolve(true)
            } else {
                console.log("\n\temail-auth-node >> The HTML has missing parameters")
                throw new Error("Run Time Error")
            }
        } catch (error) {
            reject(error)
        }
    })
}


function init() {
    return new Promise((resolve, reject) => {
        try {


            const read_line_interface = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            read_line_interface.question("\nemail-auth-node >> Kindly enter your email ID : ", function (mailId) {
                // Pre validation checks
                if (mailId.length < 5 || !validateEmail(mailId)) {
                    console.log("email-auth-node >> (Error) Please enter a valid Email ID...")
                    read_line_interface.close();
                }
                read_line_interface.question("email-auth-node >> Kindly enter your password : ", function (pwd) {
                    // prevalidation checks
                    if (pwd.length < 3) {
                        console.log("email-auth-node >> (Error) Please enter a valid password...")
                        read_line_interface.close()
                    }

                    // Assignment to global variables
                    mailID = mailId;
                    password = pwd;

                    read_line_interface.question("email-auth-node >> Kindly create a server key // press Enter to automatically generate a key : ", async function (key) {
                        if (key == '') {
                            console.log("email-auth-node >> Generating server key...")
                            // generate a new server key
                            API_KEY = makeid(6)
                            // hash the generated server key
                            SERVER_API_KEY = sha256(API_KEY)
                        } else if (key.split(" ").length > 1 || /[^\w\*]/.test(key) || key.length < 1) {
                            // the server key has spaces in it or contains special characters.
                            console.log("\nemail-auth-node >> Create a server key without spaces and special characters")
                            read_line_interface.close();
                        }
                        else {
                            console.log(`\nemail-auth-node >> '${key}' will be used as your server key`)
                            API_KEY = key
                            SERVER_API_KEY = sha256(API_KEY)
                        }


                        console.log(`\nemail-auth-node >> Configurations made. \n\t >> your server key = ${API_KEY} \n\t >> For more details check the 'config.env' file`);
                        await createConfig(read_line_interface)
                        resolve()
                    })
                });
            });

            read_line_interface.on("close", function () {
                process.exit(0);
            });
        } catch (error) {
            reject(error)
        }
    })
}


/**
 * The main function for the CLI
 * @returns void 
 */
async function main() {
    try {
        // Display help and quit the process if the help command is present
        if (process.argv.slice(2).length == 0 || process.argv.slice(2).includes("--help") || process.argv.slice(2).includes("-h")) {
            displayHelp()
            return
        }


        const defaultOptions = ["--generate", "--verify"]

        // Quit the process if there are unknown or extra options present
        process.argv.slice(2).forEach(element => {
            if (defaultOptions.indexOf(element) < 0) {
                displayHelp()
                return
            }
        });

        // Verify by HTML if the verify flag is present (explicit)
        let verifyFlag = false
        if (process.argv.slice(2).includes(defaultOptions[1])) {
            await verifyHTML()
            verifyFlag = !verifyFlag
        }

        if (process.argv.slice(2).includes(defaultOptions[0])) {
            // Default verification (checks if verify flag is present exiplicitly)
            if (!verifyFlag) {
                await verifyHTML()
            }
            await init()
        }

    } catch (error) {
        handlePackageErrors(error)
    }
}

main()
