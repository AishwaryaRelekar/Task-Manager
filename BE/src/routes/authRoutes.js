const express = require("express");

const router = express.Router();

const {
  
  register,
  login,
  forgotPwd,
} = require("../controllers/authController");

// router.post("/send-otp", sendOtp);
// router.post("/verify-otp", verifyOtp);
router.post("/register", register);

router.post("/login", login);
router.post("/forgotPwd", forgotPwd);

module.exports = router;
