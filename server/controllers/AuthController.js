const bcrypt = require("bcrypt");
const userModel = require("../models/user");
var jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRegister = async (req, res) => {
  const { userid, pwd } = req.body;
  if (!userid || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  // check for duplicate usernames in the db

  try {
    if (await userModel.userExists(userid)) {
      return res.status(409).json({ message: `Already exists` });
    } else {
      bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          return next(err);
        }

        bcrypt.hash(pwd, salt, function (err, hash) {
          if (err) {
            return next(err);
          }
          const accessToken = jwt.sign(
            {
              UserInfo: {
                userid: userid,
                role: 3,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "3600s" }
          );

          let body = req.body;
          body.userid = userid;
          body.role = 3;
          body.pwd = hash;
          body.accessToken = accessToken;

          userModel.insertUser(body);
          return res
            .status(200)
            .json({ success: `New user created!`, accessToken: accessToken });
        });
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleLogin = async (req, res) => {
  const { userid, pwd } = req.body;
  console.log(req.body);
  if (!userid || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  if (!(await userModel.userExists(userid))) return res.sendStatus(401); //Unauthorized

  const foundUser = await userModel.getUserByUserId(userid);
  const match = await bcrypt.compare(pwd, foundUser.PWD);
  if (match == true) {
    const accessToken = jwt.sign(
      {
        UserInfo: {
          userid: foundUser.USERID,
          role: foundUser.ROLE,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3600s" }
    );

    const refreshToken = jwt.sign(
      { userid: foundUser.USERID },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    userModel.updateUserRefreshToken({
      userid: foundUser.USERID,
      refresh_token: refreshToken,
    });

    res.cookie("jwt", refreshToken, { httpOnly: true }); //1 day httponly cookie is not available to javascript
    res.status(200).json({ accessToken }); //store in memory not in local storage
  } else {
    res.status(409).json({ message: "Passwords not matching" });
  }
};

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;
  // Is refreshToken in db?
  const foundUser = await userModel.getUserByRefreshToken(refreshToken);
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true }); // vymazat sameSite, secure ak budu bugy
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  userModel.updateUserRefreshToken({
    userid: foundUser.USERID,
    refresh_token: null,
  });

  res.clearCookie("jwt", { httpOnly: true });
  res.sendStatus(204);
};

const handleRefreshToken = async (req, res) => {
  console.log(req.cookies);

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  const foundUser = await userModel.getUserByRefreshToken(refreshToken);
  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    console.log(decoded);
    if (err || foundUser.USERID !== decoded.userid) return res.sendStatus(403);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          userid: foundUser.USERID,
          role: foundUser.ROLE,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3600s" }
    );
    res.json({ accessToken });
  });
};

module.exports = {
  handleRegister,
  handleLogin,
  handleLogout,
  handleRefreshToken,
};
