const {insertLogs} = require("../utils/InsertLogs");
module.exports = {
    updateChoroba: (req, res) => {
        const choroba = require("../models/choroba");
        (async () => {
            ret_val = await choroba.updateChoroba(req.body);
            res.status(200).json("success");
        })().catch((err) => {
            insertLogs({
                status: "failed to update disease",
                description: "Failed to update disease with body: " + JSON.stringify(req.body),
                table: "choroba",
            });
            res.status(500).send(err);
        });
    },

    updateZtp: (req, res) => {
        const ztp = require("../models/typ_ztp");
        (async () => {
            ret_val = await ztp.updateZtp(req.body);
            res.status(200).json("success");
        })().catch((err) => {
            insertLogs({
                status: "failed to update ZTP",
                description: "Failed to update ZTP with body: " + JSON.stringify(req.body),
                table: "typ_ztp",
            });
            res.status(500).send(err);
        });
    },
};
