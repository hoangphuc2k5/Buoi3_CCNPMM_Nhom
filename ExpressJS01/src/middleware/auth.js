require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  console.log(">>> originalUrl: ", req.originalUrl); // log kiểm tra

  const white_lists = [
    "/v1/api/",
    "/v1/api/register",
    "/v1/api/login",
    "/v1/api/auth/forgot_password",
    "/v1/api/auth/reset_password",
  ];

  if (white_lists.some((item) => req.originalUrl.startsWith(item))) {
    next();
  } else {
    if (req?.headers?.authorization?.split(" ")?.[1]) {
      const token = req.headers.authorization.split(" ")[1];

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          _id: decoded._id,
          email: decoded.email,
          name: decoded.name,
          createdBy: "hoidanit",
        };
        console.log(">>> check token: ", decoded);
        next();
      } catch (error) {
        return res.status(401).json({
          message: "Token bi het han/hoac khong hop le",
        });
      }
    } else {
      return res.status(401).json({
        message: "Ban chua truyen Access Token o header/Hoac token bi het han",
      });
    }
  }
};

module.exports = auth;