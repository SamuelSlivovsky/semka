const bcrypt = require('bcrypt');
const userModel = require('../models/user');


const handleRegister = async (req, res) => {
    const { userid, pwd } = req.body;
    if (!userid || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    // check for duplicate usernames in the db

    try {
        //encrypt the password

        //store the new user

        if (await userModel.userExists(userid)) {
            return res.status(500).json({ 'message': `Already exists` });
        } else {
            const hashedPwd = await bcrypt.hash(pwd, 10);

            let body = req.body;
            body.role = 3;
            body.pwd = hashedPwd;

            await userModel.insertUser(body);

            res.status(201).json({ 'success': `New user ${userid} created!` });
        }

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const handleLogin = async (req, res) => {
    const { userid, pwd } = req.body;
    if (!userid || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    if (!await userModel.userExists(userid)) return res.sendStatus(401); //Unauthorized 

    const foundUser = await userModel.getUser(userid);

    // evaluate password 
    bcrypt.compare(pwd, foundUser.PWD, (err, result) => {
        if (result === true) {
            console.log(match);
            const role = foundUser.ROLE;
            // create JWTs
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "userid": foundUser.userid,
                        "role": role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            const refreshToken = jwt.sign(
                { "userid": foundUser.userid },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            // // Saving refreshToken with current user
            // const otherUsers = usersDB.users.filter(person => person.userid !== foundUser.userid);
            // const currentUser = { ...foundUser, refreshToken };
            // usersDB.setUsers([...otherUsers, currentUser]);
            // await fsPromises.writeFile(
            //     path.join(__dirname, '..', 'model', 'users.json'),
            //     JSON.stringify(usersDB.users)
            // );
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            res.json({ accessToken });
        } else {
            res.status(409).json({ 'message': "Passwords not matching" });
        }
    });
}

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = { ...foundUser, refreshToken: '' };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    );

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}


module.exports = {
    handleRegister,
    handleLogin,
    handleLogout
}