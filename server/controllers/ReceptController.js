module.exports = {
    insertRecept: (req, res) => {
        const recept = require('../models/recept');
        (async () => {
            ret_val = await recept.insertRecept(req.body);
            res.status(200);
        })();
    }
};
