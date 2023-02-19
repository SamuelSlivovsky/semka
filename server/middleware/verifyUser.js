const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.role) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    let result = false;
    rolesArray.forEach((element) => {
      if (element === req.role) {
        result = true;
        return;
      }
    });

    if (!result) return res.sendStatus(401);

    next();
  };
};

const checkForCorrectId = () => {
  return (req, res, next) => {
    if (!req?.userid) return res.sendStatus(401);

    const id = parseInt(req.params.id);
    console.log(req.params);
    if (id !== req.userid) {
      return res.sendStatus(401);
    }
    next();
  };
};

module.exports = {
  verifyRoles,
  checkForCorrectId,
};
