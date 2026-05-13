const express = require("express");

const router = express.Router();

const {
    forgotPassword,
    resetPassword
} = require(
    "../controllers/forgotPasswordController"
);

const otpLimiter = require(
    "../middleware/otpLimiter"
);

// gửi otp
router.post(
    "/forgot_password",
    otpLimiter,
    forgotPassword
);

// reset password
router.post(
    "/reset_password",
    resetPassword
);

module.exports = router;