// setting Environment

require("dotenv").config();
// Local Imports

// SettingUp Alias Module
process.env.NODE_PATH = __dirname;
require("module").Module._initPaths();

const Server = require("./Server");

// Starting Server
Server.init();