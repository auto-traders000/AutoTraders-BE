const userRoutes = require('../Route/user.route.js');
const vehicleRoutes = require('../Route/vehicle.routes.js');

const express = require("express");
const router = express.Router();

class Router {
    static getRoutes = () => {
      // Routes
      router.use("/users", userRoutes);
      router.use("/vehicles", vehicleRoutes);
  
      // default index route
      router.get("/", (_, res) => res.send("Welcome to app."));
  
      return router;
    };
}
module.exports = Router;