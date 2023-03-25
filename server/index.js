const express = require('express');
const path = require('path');
const fs = require("fs")



function createLogs() {
    return new Promise((resolve, reject) => {
        try {
            const LOG_FILE_PATH = path.join(__dirname, "../", "server.log");
            console.log(LOG_FILE_PATH)

            if(fs.existsSync(LOG_FILE_PATH)) {
                fs.rmSync(LOG_FILE_PATH)
            }

            // TODO : Get file writing tech from other project (framework)

        } catch (error) {
            console.log("Error creating logger -> Execution will now be stopped");
            process.exit(-1);
        }
    })
}


createLogs().then(() => { }).catch(e => console.log("Error launching express JS app -> " + e.message()))

// const app = express();

// // Server essentials
// const cors = require('cors');
// const helmet = require('helmet');

// // environment configurations
// const dotenv = require('dotenv');
// dotenv.config({
//     path: path.resolve("../", "custom", "config.env")
// });


// // server configurations

// app.use(helmet());
// app.use(cors());

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // router for the server
// const router = require('./routes/route');
// app.use('/', router);

// const port = process.env.PORT || 5000;

// app.listen(port, ()=>{
//     console.log('server started');
//     console.log('port', port);
// });