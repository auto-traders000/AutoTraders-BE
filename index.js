// setting Environment

require("dotenv").config();
// Local Imports

// SettingUp Alias Module
process.env.NODE_PATH = __dirname;
require("module").Module._initPaths();

const Server = require("./server");

// Starting Server
Server.init();