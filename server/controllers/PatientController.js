const {hashPacienti, hashZdravotnaKarta,} = require("../utils/hashData");
const pacient = require("../models/pacient");
const {insertLogs} = require("../utils/InsertLogs");

module.exports = {
    getPacientInfo: (req, res) => {
        const pacient = require("../models/pacient");
        (async () => {
            ret_val = await pacient.getInfo(req.params.id);
            if (req.role === 0) {
                ret_val = hashPacienti(ret_val);
            }
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get patient info",
                description: "Failed to get info of patient with id: " + req.params.id,
                table: "pacient",
            });
            res.status(500).send(err);
        });
    },

    getRecepty: (req, res) => {
        const pacient = require("../models/pacient");
        (async () => {
            if (req.role === 0) {
                ret_val = await pacient.getReceptyAdmin();
                ret_val = hashZdravotnaKarta(ret_val);
            } else {
                ret_val = await pacient.getRecepty(req.params.id);
            }
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get prescriptions",
                description: "Failed to get prescriptions of patient with id: " + req.params.id,
                table: "recept",
            });
            res.status(500).send(err);
        });
    },

    getZdravZaznamy: (req, res) => {
        const pacient = require("../models/pacient");
        (async () => {
            if (req.role === 0) {
                ret_val = await pacient.getZdravZaznamyAdmin();
                ret_val = hashZdravotnaKarta(ret_val);
            } else {
                ret_val = await pacient.getZdravZaznamy(req.params.id);
            }
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get medical records",
                description: "Failed to get medical records of patient with id: " + req.params.id,
                table: "zdravotny_zaznam",
            });
            res.status(500).send(err);
        });
    },

    getChoroby: (req, res) => {
        const pacient = require("../models/pacient");
        (async () => {
            if (req.role === 0) {
                ret_val = await pacient.getChorobyAdmin();
                ret_val = hashZdravotnaKarta(ret_val);
            } else {
                ret_val = await pacient.getChoroby(req.params.id);
            }
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get diseases",
                description: "Failed to get diseases of patient with id: " + req.params.id,
                table: "choroba",
            });
            res.status(500).send(err);
        });
    },

    getTypyZTP: (req, res) => {
        const pacient = require("../models/pacient");
        (async () => {
            if (req.role === 0) {
                ret_val = await pacient.getTypyZTPAdmin();
                ret_val = hashZdravotnaKarta(ret_val);
            } else {
                ret_val = await pacient.getTypyZTP(req.params.id);
            }
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get types of ZTP",
                description: "Failed to get types of ZTP of patient with id: " + req.params.id,
                table: "typ_ztp",
            });
            res.status(500).send(err);
        });
    },

    getDoctorsOfPatient: (req, res) => {
        const pacient = require("../models/pacient");
        (async () => {
            ret_val = await pacient.getDoctorsOfPatient(req.params.id);
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get doctors",
                description: "Failed to get doctors of patient with id: " + req.params.id,
                table: "doktor",
            });
            res.status(403).send(err);
        });
    },

    getIdPacienta: (req, res) => {
        const pacient = require("../models/pacient");
        (async () => {
            ret_val = await pacient.getIdPacienta(req.params.id);
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get patient id",
                description: "Failed to get id of patient with id: " + req.params.id,
                table: "pacient",
            });
            res.status(403).send(err);
        });
    },

    getOckovania: (req, res) => {
        const pacient = require("../models/pacient");
        (async () => {
            if (req.role === 0) {
                ret_val = await pacient.getOckovaniaAdmin();
                ret_val = hashZdravotnaKarta(ret_val);
            } else {
                ret_val = await pacient.getOckovania(req.params.id);
            }
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get vaccinations",
                description: "Failed to get vaccinations of patient with id: " + req.params.id,
                table: "ockovanie",
            });
            res.status(403).send(err);
        });
    },

    updateTimeOfDeath: (req, res) => {
        const pacient = require("../models/pacient");
        (async () => {
            ret_val = await pacient.updateTimeOfDeath(req.body);
            res.status(200);
        })().catch((err) => {
            insertLogs({
                status: "failed to update time of death",
                description: "Failed to update time of death of patient with id: " + req.body.id,
                table: "pacient",
            });
            res.status(403).send(err);
        });
    },
};
