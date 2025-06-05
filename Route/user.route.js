const userController  = require('../Controller/user.controller');
const auth = require("../middlewares/token.middleware");

const express = require('express');
const router = express.Router();

router.post("/request-otp", userController.requestOtp);
router.post("/resend-otp", userController.resendOtp);
router.post("/create", userController.create);
router.get("/", auth, userController.getUser)
router.delete("/delete/", auth, userController.delete);
router.put("/update/", auth, userController.update);
router.post("/login/", userController.login);
router.put("/resetPassword/", userController.resetPassword);
router.post("/forgotPassword/", userController.forgotPassword);

module.exports = router;