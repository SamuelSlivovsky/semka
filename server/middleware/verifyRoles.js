const verifyRoles = (...allowedRoles) => {

    return (req, res, next) => {
        if (!req?.role) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        let result = false;
        rolesArray.forEach((element) => {
            console.log(element);
            if (element === req.role) {
                result = true;
                return;
            }
        });
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles