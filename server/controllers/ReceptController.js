const {insertLogs} = require("../utils/InsertLogs");
module.exports = {
    insertRecept: (req, res) => {
        const recept = require('../models/recept');
        (async () => {
            ret_val = await recept.insertRecept(req.body);
            res.status(200);
        })().catch((err) => {
            insertLogs({
                status: 'failed to insert recept',
                description: 'Failed to insert recept with body: ' + JSON.stringify(req.body),
                table: 'recept',
            });
            res.status(500).send(err);
        });
    }
};
