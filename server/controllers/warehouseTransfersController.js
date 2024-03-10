const transfers = require("../models/warehouseTransfers");
const order = require("../models/orders");
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

    createHospTransfer: (req, res) => {
        (async () => {
            ret_val = await transfers.createHospTransfer(req.body);
            res.status(200);
        })().catch((err) => {
            console.log("Error Kontroler");
            console.error(err);
            res.status(500).send(err);
        });
    },

};