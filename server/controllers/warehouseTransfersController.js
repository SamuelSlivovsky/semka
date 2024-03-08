const transfers = require("../models/warehouseTransfers");
module.exports = {
    getFinishedTransfers: (req, res) => {
        (async () => {
            ret_val = await transfers.getFinishedTransfers();
            res.status(200).json(ret_val);
        })();
    },

    getWaitingTransfers: (req, res) => {
        (async () => {
            ret_val = await transfers.getWaitingTransfers();
            res.status(200).json(ret_val);
        })();
    },

    getListTransfers: (req, res) => {
        (async () => {
            ret_val = await transfers.getListTransfers(req.params.id);
            res.status(200).json(ret_val);
        })();
    },

    getWarehouses: (req, res) => {
        (async () => {
            ret_val = await transfers.getWarehouses();
            res.status(200).json(ret_val);
        })();
    },

    getHospitalMedication: (req, res) => {
        (async () => {
            ret_val = await transfers.getHospitalMedication(req.params.id);
            res.status(200).json(ret_val);
        })();
    },

};