const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log('verifyJWT');
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    //console.log(authHeader); // Bearer token
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.userid = decoded.UserInfo.userid;
            req.role = decoded.UserInfo.role
            next();
        }
    );
}

module.exports = verifyJWT