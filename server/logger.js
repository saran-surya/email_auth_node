const fs = require("fs")
class LOGGER {
    
    /**
     * 
     * @param {string} filePath
     * @param {boolean} createNew 
     */
    constructor(filePath, createNew){
        const OLD_LOGS = path.join(__dirname, "../", "old_logs")

        // Delete old server logs
        if(fs.existsSync(filePath)){
            if(createNew){
                fs.rmSync(filePath)
            } else {
                // create a new directory for copying old logs
                if (!(fs.existsSync(OLD_LOGS))) fs.mkdirSync(OLD_LOGS)

                // Copy the file to the new location (Use random names // OR use old naming with added names)
            }
        }

    }
}