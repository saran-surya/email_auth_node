const express = require('express');
const path = require('path');
const LOGGER = require('./logger');

LOGGER.init(false)

/**
 * Main method to start express server
 */
function main() {
    try {
        LOGGER.INFO("Starting express server")

        const app = express();

        // Server essentials
        const cors = require('cors');
        const helmet = require('helmet');

        // environment configurations
        const dotenv = require('dotenv');
        dotenv.config({
            path: path.resolve("../", "custom", "config.env")
        });


        // server configurations

        app.use(helmet());
        app.use(cors());

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.use(express.static(path.join(__dirname, "static")))

        // router for the server
        const router = require('./routes/route');
        app.use('/', router);

        const port = process.env.PORT || 5000;

        app.listen(port, () => {
            LOGGER.INFO(`STARTING NODE JS SERVER :: ON PORT :: ${port}`)
            // console.log('server started');
            // console.log('port', port);
        });
    } catch (e) {
        LOGGER.ERROR(e)
        LOGGER.ERROR("Error launching express JS app")
    }
}


main()