// Package Imports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Local Imports
const Database = require('../Database');
const Router = require('../Route');

// Constants
const { port } = require('../config/index');

class Server {
    static server = express();
    static init(){
        const { server } = Server;
        server.use(bodyParser.json());
        server.use(
            bodyParser.urlencoded({
                extended: true,
            })
        );

        // use cors
        server.use(cors( {origin: "*"}));

        server.use(express.json());

        //Initiate the database
        Database.connect();

        //Routes
        const routes = Router.getRoutes(server);

        server.use('/', routes);

        const httpServer = server.listen(port, ()=>{
            console.log(`App is running on port ${port}.`);
        });
    }
}

module.exports = Server;