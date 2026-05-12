const rateLimit = require(
    "express-rate-limit"
);

const otpLimiter = rateLimit({

    windowMs: 60 * 1000,

    max: 3,

    message: {
        EC: 1,
        EM: "Bạn gửi OTP quá nhiều lần"
    }

});

module.exports = otpLimiter;