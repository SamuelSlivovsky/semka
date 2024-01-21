const lekar = require("../models/lekar");
const {hashPacienti, hashMedical} = require("../utils/hashData");
module.exports = {
    getPacienti: (req, res) => {
        const lekar = require("../models/lekar");
        (async () => {
            pacienti = await lekar.getPacienti(req.params.id);
            if (req.role === 0) {
                pacienti = hashPacienti(pacienti);
            }
            res.status(200).json(pacienti);
        })();
    },

    getLekari: (req, res) => {
        const lekar = require("../models/lekar");
        (async () => {
            lekari = await lekar.getLekari(req.params.id);
            res.status(200).json(lekari);
        })();
    },

    getOperacie: (req, res) => {
        const lekar = require("../models/lekar");
        (async () => {
            if (req.role === 0) {
                operacie = await lekar.getOperacieAdmin();
                // operacie = await lekar.getOperacie(req.params.id);
                operacie = hashMedical(operacie);
            } else {
                operacie = await lekar.getOperacie(req.params.id);
            }
            res.status(200).json(operacie);
        })();
    },

    getVysetrenia: (req, res) => {
        const lekar = require("../models/lekar");
        (async () => {
            if (req.role === 0) {
                vysetrenia = await lekar.getVysetreniaAdmin();
                vysetrenia = hashMedical(vysetrenia);
            } else {
                ysetrenia = await lekar.getVysetrenia(req.params.id);
            }
            res.status(200).json(vysetrenia);
        })();
    },

    getHospitalizacie: (req, res) => {
        const lekar = require("../models/lekar");
        (async () => {
            if (req.role === 0) {
                hospitalizacie = await lekar.getHospitalizacieAdmin();
                // hospitalizacie = await lekar.getHospitalizacie(req.params.id);
                hospitalizacie = hashMedical(hospitalizacie);
            } else {
                hospitalizacie = await lekar.getHospitalizacie(req.params.id);
            }
            res.status(200).json(hospitalizacie);
        })();
    },

    getLekarInfo: (req, res) => {
        const lekar = require("../models/lekar");
        (async () => {
            info = await lekar.getLekarInfo(req.params.id);
            res.status(200).json(info);
        })();
    },

    getNemocnicaOddelenia: (req, res) => {
        const lekar = require("../models/lekar");
        (async () => {
            info = await lekar.getNemocnicaOddelenia(req.params.id);
            res.status(200).json(info);
        })();
    },
};
