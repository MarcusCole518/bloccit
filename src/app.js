const express = require("express");
const app = express();
<<<<<<< HEAD
=======

>>>>>>> checkpoint-routing-controllers-view
const appConfig = require("./config/main-config.js");
const routeConfig = require("./config/route-config.js");

appConfig.init();
routeConfig.init(app);

module.exports = app;