const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  //console.log(authHeader); // Bearer token
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        //TODO Pridat Expiraciu tokenu ku kazdemu fetchu je na res.status(410)
        return res.status(410).json({ message: 'Token has expired' });
      } else {
        return res.sendStatus(403); // Invalid token for other reasons
      }
    }
    req.userid = decoded.UserInfo.userid;
    req.role = decoded.UserInfo.role;
    next();
  });
};

module.exports = verifyJWT;
