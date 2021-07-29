#!/usr/bin/env node
const readline = require("readline");
const crypto = require('crypto')

let API_KEY;

let mailID;
let password;
let SERVER_API_KEY;

const mailPort = 587

function displayHelp() {
    console.log("----------------- Package Help -----------------\n")
    console.log("Options available with 'email-auth-node' : ")
    console.log("Options : ")
    console.log("\t - init : Starts a user interaction for creating a custom configuration file.")
    console.log("\n\t - example : npx email-auth-node init")
    console.log("\nemail-auth-node >> New features are coming soon...")
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

console.log(process.argv)

function main() {
    // Display help and quit the process if the help command is present
    if (process.argv.slice(2).length == 0 || process.argv.slice(2).includes("--help") || process.argv.slice(2).includes("-h")) {
        displayHelp()
        return
    }

    // Quit the process if there are unknown or extra options present
    if (process.argv.slice(2).length > 1) {
        console.log("email-auth-node >> Extra unknown options present")
        displayHelp()
        return
    }


    const read_line_interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    read_line_interface.question("Kindly enter your email ID : ", function (mailId) {
        if (mailId.length < 5 && !validateEmail(mailID)) {
            console.log("Please enter a valid Email ID...")
            read_line_interface.close();
        }
        read_line_interface.question("Kindly enter your password : ", function (pwd) {
            if (pwd.length < 3) {
                console.log("Please enter a valid password...")
                read_line_interface.close()
            }
            mailID = mailId;
            password = pwd;

            read_line_interface.question("Kindly create a server key // press Enter to automatically generate a key : ", function (key) {
                if (key == '') {
                    console.log("Generating server key...")
                    API_KEY = makeid(6)
                    SERVER_API_KEY = sha256(API_KEY)
                } else {
                    console.log(`email-auth-node >> '${key}' will be used as your server key`)
                    API_KEY = key
                    SERVER_API_KEY = sha256(API_KEY)
                }
                console.log(API_KEY)
                console.log(SERVER_API_KEY)
                console.log("\nemail-auth-node >> Generating server configuration...");
                read_line_interface.close();
            })
        });
    });

    read_line_interface.on("close", function () {
        process.exit(0);
    });


}

main()


