const transfers = require("../models/warehouseTransfers");
module.exports = {
    getFinishedTransfers: (req, res) => {
        (async () => {
            let ret_val = await transfers.getFinishedTransfers(req.params.id);
            res.status(200).json(ret_val);
        })();
    },

    getWaitingTransfers: (req, res) => {
        (async () => {
            let ret_val = await transfers.getWaitingTransfers(req.params.id);
            res.status(200).json(ret_val);
        })();
    },

    getDeclinedTransfers: (req, res) => {
        (async () => {
            let ret_val = await transfers.getDeclinedTransfers(req.params.id);
            res.status(200).json(ret_val);
        })();
    },

    getRequestedTransfers: (req, res) => {
        (async () => {
            let ret_val = await transfers.getRequestedTransfers(req.params.id);
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
        if(req.params.exp_date !== null) {
            const date = new Date(req.params.exp_date);
            if(isNaN(date.getTime())) {
                return res.status(500).json({message: `Musíte zadať dátum expirácie`});
            }
            req.params.exp_date = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        }
        (async () => {
            let ret_val = await transfers.getSelectedMedications(req.params.id, req.params.exp_date);
            res.status(200).json(ret_val);
        })();
    },

    createTransfer: (req, res) => {
        (async () => {
            let ret_val = await transfers.createTransfer(req.body);
            res.status(200).json(ret_val);
        })().catch((err) => {
            console.log("Error Kontroler");
            console.error(err);
            res.status(500).send(err);
        });
    },

    deniedTransfer: (req, res) => {
        (async () => {
            let ret_val = await transfers.deniedTransfer(req.body);
            res.status(200).json(ret_val);
        })().catch((err) => {
            console.log("Error Kontroler");
            console.error(err);
            res.status(500).send(err);
        });
    },

    confirmTransfer: (req, res) => {
        (async () => {
            let ret_val = await transfers.confirmTransfer(req.body);
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