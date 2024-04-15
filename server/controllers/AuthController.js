const bcrypt = require("bcrypt");
const userModel = require("../models/user");
var jwt = require("jsonwebtoken");
const sklad = require("../models/sklad");
const logy = require("../models/log_table");
const {insertLog} = require("../models/log_table");
const {insertLogs} = require("../utils/InsertLogs");
require("dotenv").config();

const handleRegister = async (req, res) => {
    const {userid, pwd, role} = req.body;
    if (!userid || !pwd)
        return res
            .status(400)
            .json({message: "Vyžaduje sa používateľské meno a heslo."});

    if (pwd.length < 8) {
        return res
            .status(400)
            .json({message: "Heslo musí mať aspoň 8 znakov."});
    }
    if (!pwd.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
        return res
            .status(400)
            .json({message: "Heslo musí obsahovať aspoň jedno veľké písmeno, jedno malé písmeno, jednu číslicu a jeden špeciálny znak."});
    }

    try {
        // check for duplicate usernames in the db
        if (await userModel.userExists(userid)) {
            return res
                .status(409)
                .json({message: `Používateľ s týmto menom už existuje`});
            // Kontrola ci uzivatel existuje v pacientoch/zamestnancoch
        } else if (await userModel.userExistsInDB(userid)) {
            return res
                .status(409)
                .json({message: `Používateľ neexistuje`});
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
                                userid: !isNaN(userid) ? Number(userid) : userid,
                                role: role,
                            },
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        {expiresIn: "3600s"}
                    );

                    let body = req.body;
                    body.userid = userid;
                    body.role = role;
                    body.pwd = hash;
                    body.accessToken = accessToken;

                    userModel.insertUser(body);
                    return res
                        .status(200)
                        .json({success: `New user created!`, accessToken: accessToken});
                });
            });
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

const handleLogin = async (req, res) => {
    const logbodyFailed = {
        ip: req.body.ip,
        table: "USER_TAB",
        status: "failed login",
        description: "User with ip " + req.body.ip + " has failed to log in",
    }
    const logbodyWrongParam = {
        ip: req.body.ip,
        table: "USER_TAB",
        status: "Wrong parameters",
        description: "User with ip " + req.body.ip + " has used wrong parameters to log in",
    }
    function checkIP(ip) {
        const ipFormat = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipFormat.test(ip);
    }
    const numberOfWrongLogins = await logy.getNumberOfWrongLogins(req.body.ip);

    if (!checkIP(req.body.ip) || numberOfWrongLogins) {
        if (numberOfWrongLogins) {
            return res
                .status(401)
                .json({message: "Príliš veľa neúspešných pokusov o prihlásenie z tejto IP adresy. Skúste to prosím neskôr."});
        }
        insertLogs(logbodyFailed);
        return res
            .status(400)
            .json({message: "Neplatna IP adresa."});
    }
    const {userid, pwd} = req.body;
    if (!userid || !pwd) {
        insertLogs(logbodyWrongParam)
        return res
            .status(400)
            .json({message: "Vyžaduje sa používateľské meno a heslo."});
    }
    if (!(await userModel.userExists(userid))) {
        insertLogs(logbodyFailed)
        return res
            .status(400)
            .json({message: "Používateľ s týmto prihlasovacím menom neexistuje"});
    }

    const foundUser = await userModel.getUserByUserId(userid);
    const match = await bcrypt.compare(pwd, foundUser.PWD);
    if (match == true) {
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    userid: !isNaN(foundUser.USERID)
                        ? Number(foundUser.USERID)
                        : foundUser.USERID,
                    role: foundUser.ROLE,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "1d"}
        );

        const refreshToken = jwt.sign(
            {userid: foundUser.USERID},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: "3600s"}
        );

        userModel.updateUserRefreshToken({
            userid: foundUser.USERID,
            refresh_token: refreshToken,
        });

        res.cookie("jwt", refreshToken, {httpOnly: true}); //1 day httponly cookie is not available to javascript
        res.status(200).json({accessToken}); //store in memory not in local storage
    } else {
        insertLogs(logbodyFailed)
        res.status(409).json({message: "Používateľské meno alebo heslo je neplatné"});
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
        res.clearCookie("jwt", {httpOnly: true}); // vymazat sameSite, secure ak budu bugy
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    userModel.updateUserRefreshToken({
        userid: foundUser.USERID,
        refresh_token: null,
    });

    res.clearCookie("jwt", {httpOnly: true});
    res.sendStatus(204);
};

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    const foundUser = await userModel.getUserByRefreshToken(refreshToken);
    if (!foundUser) return res.sendStatus(403); //Forbidden
    // evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.USERID !== decoded.userid) return res.sendStatus(403);

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    userid: foundUser.USERID,
                    role: foundUser.ROLE,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "3600s"}
        );
        res.json({accessToken});
    });
};

module.exports = {
    handleRegister,
    handleLogin,
    handleLogout,
    handleRefreshToken,
};
