const hospitalizacia = require("../models/hospitalizacia");
const {insertLogs} = require("../utils/InsertLogs");

module.exports = {
    get: (req, res) => {
        res.send("Prisli ste na stranku hospitalizacie");
    },

    getHospitalizacie: (req, res) => {
        (async () => {
            let hospitalizacie = JSON.stringify(
                await hospitalizacia.getHospitalizacie(),
                null,
                4
            ); //JSON.stringify used just to have prettier format in dev tools response
            res.status(200).send(hospitalizacie);
        })().catch((err) => {
            insertLogs({
                table: "HOSPITALIZACIA",
                status: "failed to get hospitalizations",
                description: "Failed to get hospitalizations",
            })
            res.status(500).send(err);
        });
    },

    endHospitalization: (req, res) => {
        (async () => {
            ret_val = await hospitalizacia.endHospitalization(req.body);
            res.status(200);
        })().catch((err) => {
            insertLogs({
                table: "HOSPITALIZACIA",
                status: "failed to end hospitalization",
                description: "Failed to end hospitalization",
            })
            res.status(500).send(err);
        });
    },
};
