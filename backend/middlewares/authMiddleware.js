const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    let token;

    if (authorization?.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "You are not logged in. Please login to get access.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ userName: decoded.id });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "You are not logged in. Please login to get access.",
    });
  }
};

module.exports = authMiddleware;
