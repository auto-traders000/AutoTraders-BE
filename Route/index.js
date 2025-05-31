const userRoutes = require('../Route/user.route.js');

const express = require("express");
const router = express.Router();

class Router {
    static getRoutes = () => {
      // Routes
      router.use("/users", userRoutes);
  
      // default index route
      router.get("/", (_, res) => res.send("Welcome to app."));
  
      return router;
    };
}
module.exports = Router;