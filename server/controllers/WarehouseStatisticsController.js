const skladStats = require("../models/warehouseStats");

module.exports = {
    getMedAmount: (req, res) => {

        if(req.params.id === null || req.params.id === "null" || isNaN(req.params.id)) {
            return res.status(400).json({message: `Neplatné ID`});
        }

        (async () => {
            ret_val = await skladStats.getMedAmount(req.params.id);
            res.status(200).json(ret_val);
        })().catch((err) => {
            console.log("Error Kontroler");
            console.error(err);
            res.status(500).send(err);
        });
    },

    getMedications: (req, res) => {

        if(req.params.id === null || req.params.id === "null" || isNaN(req.params.id)) {
            return res.status(400).json({message: `Neplatné ID`});
        }

        (async () => {
            ret_val = await skladStats.getMedications(req.params.id);
            res.status(200).json(ret_val);
        })().catch((err) => {
            console.log("Error Kontroler");
            console.error(err);
            res.status(500).send(err);
        });
    },

    getMedStats: (req, res) => {

        if(req.params.id === null || req.params.id === "null" || isNaN(req.params.id)
        || req.params.emp === null || req.params.emp === "null" || isNaN(req.params.emp)) {
            return res.status(400).json({message: `Neplatné ID`});
        }

        (async () => {
            ret_val = await skladStats.getMedStats(req.params.id);
            res.status(200).json(ret_val);
        })().catch((err) => {
            console.log("Error Kontroler");
            console.error(err);
            res.status(500).send(err);
        });
    },
}