const fs = require("node:fs")
const path = require("node:path")


/**
 * PROPERTIES FOR LOGGGER HIGHLIGHT
 */
var Reset = "\x1b[0m"
var Bright = "\x1b[1m"
var Dim = "\x1b[2m"
var Underscore = "\x1b[4m"
var Blink = "\x1b[5m"
var Reverse = "\x1b[7m"
var Hidden = "\x1b[8m"

var FgBlack = "\x1b[30m"
var FgRed = "\x1b[31m"
var FgGreen = "\x1b[32m"
var FgYellow = "\x1b[33m"
var FgBlue = "\x1b[34m"
var FgMagenta = "\x1b[35m"
var FgCyan = "\x1b[36m"
var FgWhite = "\x1b[37m"

var BgBlack = "\x1b[40m"
var BgRed = "\x1b[41m"
var BgGreen = "\x1b[42m"
var BgYellow = "\x1b[43m"
var BgBlue = "\x1b[44m"
var BgMagenta = "\x1b[45m"
var BgCyan = "\x1b[46m"
var BgWhite = "\x1b[47m"

class LOGGER {

    LOG_FILE_PATH;

    /**
     * initializes the LOGGER and the LOG file
     * @param {string} filePath
     * @param {boolean} replaceFile 
     */
    static init(replaceFile = true) {
        this.LOG_FILE_PATH = path.join(__dirname, "../", "server.log");

        // Deleting old log file (Creating a new log for execution)
        if (fs.existsSync(this.LOG_FILE_PATH)) {
            if (replaceFile) fs.rmSync(this.LOG_FILE_PATH)
        }

        this.INFO("INITIALIZATION : LOGGER INITIALISED SUCCESSFULLY")
    }


    static async #writeLog(logLevel, ...args) {
        var logMessage = `[${new Date().toLocaleString(undefined, { timeZone: "Asia/Kolkata" })}] >> [${logLevel}] >> ${(typeof args === "object") ? JSON.stringify(args) : args}`
        const messageToFS = `${logMessage}\r\n`


        let logSwitchBuffer = process.env.npm_config_log
        // Exiting once the log switch buffer is not present
        if (!logSwitchBuffer) {
            return
        }

        var buffer = logMessage.split(">>").splice(1)
        logMessage = ` ${buffer[0]} ${Reset}${buffer[1]}`

        // Constructing all log messages
        switch (true) {
            case logLevel === "ERROR": {
                logMessage = `${BgRed}${FgBlack}${logMessage}`
                break
            }

            case logLevel === "WARN": {
                logMessage = `${BgWhite}${FgBlack}${logMessage}`
                break
            }

            case logLevel === "INFO": {
                logMessage = `${BgBlue}${FgWhite}${logMessage}`
                break
            }
        }

        /**@NOTE Only writes to files if logLevel and described log is match */
        if (logSwitchBuffer.toUpperCase() === logLevel || logSwitchBuffer === "true") {
            console.log(logMessage)

            fs.writeFileSync(this.LOG_FILE_PATH, messageToFS, {
                flag: "a+"
            })
        }
    }

    /**
     * Logs all info messages
     * @param args 
     */
    // TODO : log all info messages to console for better exp
    // TODO : Add colour params
    static INFO(...args) {
        this.#writeLog("INFO", ...args)
    }

    /**
     * Logs all warning messages
     * @param args 
     */
    static WARN(...args) {
        this.writeLog("WARN", ...args)
    }

    static ERROR(args) {
        args = (args.message) ? args.message : args
        this.#writeLog("ERROR", args)
    }

}


module.exports = LOGGER
