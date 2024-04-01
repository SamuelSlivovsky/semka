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
        if(req.params.id === null || req.params.id === "null" || isNaN(req.params.id)) {
            return res.status(400).json({message: `Musíte vybrať nemocnicu zo zoznamu`});
        }
        (async () => {
            let ret_val = await transfers.getHospitalMedication(req.params.id);
            res.status(200).json(ret_val);
        })();
    },

    getSelectedMedications: (req, res) => {
        if(req.params.exp_date !== "null") {
            const date = new Date(req.params.exp_date);
            if(isNaN(date.getTime())) {
                return res.status(400).json({message: `Musíte zadať dátum expirácie`});
            }
            req.params.exp_date = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        }
        (async () => {
            let ret_val = await transfers.getSelectedMedications(req.params.id, req.params.exp_date, req.params.usr_id);
            res.status(200).json(ret_val);
        })();
    },

    createTransfer: (req, res) => {
        const medications = req.body.zoznam_liekov;
        let paramsCheck = false;
        for (let i = 0; i < medications.length; i++) {
            if(isNaN(medications[i].id || isNaN(medications[i].amount) || medications[i].id < 0 || medications[i].amount < 0)) {
                paramsCheck = true;
                break;
            }
        }

        if(paramsCheck || req.body.id_oddelenia < 0 || isNaN(req.body.id_oddelenia)) {
            return res.status(400).json({message: `Nepsrávne vyplnené údaje`});
        }

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
        if(req.body.id_pres < 0 || isNaN(req.body.id_pres)) {
            return res.status(400).json({message: `Nesprávne ID presunu`});
        }
        (async () => {
            let ret_val = await transfers.deniedTransfer(req.body);
            res.status(200);
        })().catch((err) => {
            console.log("Error Kontroler");
            console.error(err);
            res.status(500).send(err);
        });
    },

    confirmTransfer: (req, res) => {
        if(req.body.id_pres < 0 || req.body.id_l < 0 || req.body.poc < 0 || isNaN(req.body.id_pres) || isNaN(req.body.id_l) || isNaN(req.body.poc)) {
            return res.status(400).json({message: `Nesprávne zadané parametre`});
        }

        (async () => {
            let ret_val = await transfers.confirmTransfer(req.body);
            res.status(200).json(ret_val);
        })().catch((err) => {
            console.log("Error Kontroler");
            console.error(err);
            res.status(500).send(err);
        });
    },

    createTransferSelMedAmount : (req, res) => {
        const medCheck = req.body.medications;
        let checkAmount = 0;

        for (const med of medCheck) {
            if(med.quantity > 0) {
                checkAmount+=1;
            }
        }

        if(medCheck.length < 0 || checkAmount === 0) {
            return res.status(400).json({message: `Nesprávne zadané parametre`});
        }

        (async () => {
            let ret_val = await transfers.createTransferSelMedAmount(req.body);
            res.status(200).json(ret_val);
        })().catch((err) => {
            console.log("Error Kontroler");
            console.error(err);
            res.status(500).send(err);
        });
    },

    deleteTransfer: (req, res) => {
        if(req.body.id_presun < 0 || isNaN(req.body.id_presun)) {
            return res.status(400).json({message: `Nesprávne zadané parametre`});
        }

        (async () => {
            let ret_val = await transfers.deleteTransfer(req.body);
            res.status(200);
        })().catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
    }

};