const {insertLogs} = require("../utils/InsertLogs");
require("dotenv").config();
const getLogs = async (req, res) => {
    const logy = require("../models/log_table");
    (async () => {
        ret_val = await logy.getAllLogs();
        res.status(200).json(ret_val);
    })().catch((err) => {
        insertLogs({
            status: "failed to get logs",
            description: "Failed to get logs",
            table: "LOG_TABLE",
        })
        res.status(500).send(err);
    });
};


module.exports = {
    getLogs,
}