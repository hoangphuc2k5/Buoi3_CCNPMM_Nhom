const express = require("express");

const router = express.Router();

const forgotPasswordRoutes = require(
    "./forgotPasswordRoutes"
);

// auth
router.use(
    "/auth",
    forgotPasswordRoutes
);

module.exports = router;