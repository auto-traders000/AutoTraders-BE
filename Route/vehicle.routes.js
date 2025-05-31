const vehicleController  = require('../Controller/vehicle.controller');
const auth = require("../middlewares/token.middleware");

const express = require('express');
const router = express.Router();


router.post("/create", auth, vehicleController.create);
router.put("/update/", auth, vehicleController.update);
router.delete("/delete/", auth, vehicleController.delete);

module.exports = router;