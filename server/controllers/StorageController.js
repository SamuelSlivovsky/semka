const {insertLogs} = require("../utils/InsertLogs");
module.exports = {
    getDrugsOfDeparment: (req, res) => {
        const storage = require("../models/sklad");
        (async () => {
            console.log(req.params);
            ret_val = await storage.getDrugsOfDepartment(req.params.id);
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get drugs",
                description: "Failed to get drugs of department with id: " + req.params.id,
                table: "sklad",
            });
            res.status(500).send(err);
        });
    },

    insertDrug: (req, res) => {
        const sklad = require("../models/sklad");
        (async () => {
            ret_val = await sklad.insertDrug(req.body);
            res.status(200);
        })().catch((err) => {
            insertLogs({
                status: "failed to insert drug",
                description: "Failed to insert drug with body: " + JSON.stringify(req.body),
                table: "sklad",
            });
            res.status(500).send(err);
        });
    },

    updateQuantity: (req, res) => {
        const sklad = require("../models/sklad");
        (async () => {
            ret_val = await sklad.updateQuantity(req.body);
            res.status(200);
        })().catch((err) => {
            insertLogs({
                status: "failed to update quantity",
                description: "Failed to update quantity of drug with body: " + JSON.stringify(req.body),
                table: "sklad",
            });
            res.status(500).send(err);
        });
    },

    deleteSarza: (req, res) => {
        const sklad = require("../models/sklad");
        (async () => {
            ret_val = await sklad.deleteSarza(req.body);
            res.status(200);
        })().catch((err) => {
            insertLogs({
                status: "failed to delete sarza",
                description: "Failed to delete sarza with body: " + JSON.stringify(req.body),
                table: "sklad",
            });
            res.status(500).send(err);
        });
    },
};
