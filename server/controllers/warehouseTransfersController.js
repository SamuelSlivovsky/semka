const transfers = require("../models/warehouseTransfers");
module.exports = {
    getFinishedTransfers: (req, res) => {
        (async () => {
            let ret_val = await transfers.getFinishedTransfers();
            res.status(200).json(ret_val);
        })();
    },

    getWaitingTransfers: (req, res) => {
        (async () => {
            let ret_val = await transfers.getWaitingTransfers();
            res.status(200).json(ret_val);
        })();
    },

    getListTransfers: (req, res) => {
        (async () => {
            let ret_val = await transfers.getListTransfers(req.params.id);
            res.status(200).json(ret_val);
        })();
    },

    getWarehouses: (req, res) => {
        (async () => {
            let ret_val = await transfers.getWarehouses();
            res.status(200).json(ret_val);
        })();
    },

    getHospitalMedication: (req, res) => {
        (async () => {
            let ret_val = await transfers.getHospitalMedication(req.params.id);
            res.status(200).json(ret_val);
        })();
    },

    getSelectedMedications: (req, res) => {
        (async () => {
            let ret_val = await transfers.getSelectedMedications(req.params.id);
            res.status(200).json(ret_val);
        })();
    },

    createHospTransfer: (req, res) => {
        (async () => {
            let ret_val = await transfers.createHospTransfer(req.body);
            res.status(200).json(ret_val);
        })().catch((err) => {
            console.log("Error Kontroler");
            console.error(err);
            res.status(500).send(err);
        });
    },

    deleteTransfer: (req, res) => {
        (async () => {
            let ret_val = await transfers.deleteTransfer(req.body);
            res.status(200);
        })().catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
    }

};