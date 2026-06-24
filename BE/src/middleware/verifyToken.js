// verify token
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("auth header", req.headers.authorization);

  if (!authHeader) {
    return res.status(403).json({ message: "token not found" });
  }

  const token = authHeader.split(" ")[1];
  console.log("extracted token", token);
  if (!token) return res.status(401).json({ message: "token  missing" });
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.log("decoded token", user);
    req.user = user;
    next();
  });
};
