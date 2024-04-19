const transfers = require("../models/warehouseTransfers");
const {insertLogs} = require("../utils/InsertLogs");
module.exports = {
    getFinishedTransfers: (req, res) => {
        (async () => {
            ret_val = await transfers.getFinishedTransfers();
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get finished transfers",
                description: "Failed to get finished transfers",
                table: "transfer",
            });
            res.status(500).send(err);
        });
    },

    getWaitingTransfers: (req, res) => {
        (async () => {
            ret_val = await transfers.getWaitingTransfers();
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get waiting transfers",
                description: "Failed to get waiting transfers",
                table: "transfer",
            });
            res.status(500).send(err);
        });
    },

    getListTransfers: (req, res) => {
        (async () => {
            ret_val = await transfers.getListTransfers(req.params.id);
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get list transfers",
                description: "Failed to get list transfers with id: " + req.params.id,
                table: "transfer",
            });
            res.status(500).send(err);
        });
    },

    getWarehouses: (req, res) => {
        (async () => {
            ret_val = await transfers.getWarehouses();
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get warehouses",
                description: "Failed to get warehouses",
                table: "transfer",
            });
            res.status(500).send(err);
        });
    },

    getHospitalMedication: (req, res) => {
        (async () => {
            ret_val = await transfers.getHospitalMedication(req.params.id);
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get hospital medication",
                description: "Failed to get hospital medication with id: " + req.params.id,
                table: "transfer",
            });
            res.status(500).send(err);
        });
    },

};