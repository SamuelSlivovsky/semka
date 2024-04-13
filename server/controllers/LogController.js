require("dotenv").config();
const getLogs = async (req, res) => {
    const logy = require("../models/log_table");
    (async () => {
        ret_val = await logy.getAllLogs();
        res.status(200).json(ret_val);
    })().catch((err) => {
        console.log("Error Kontroler");
        console.error(err);
        res.status(500).send(err);
    });
};


module.exports = {
    getLogs,
}