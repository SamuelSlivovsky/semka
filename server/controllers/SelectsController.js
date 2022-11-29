module.exports = {

    getNajviacChoriPocet: (req, res) => {
        const pacient = require("../models/pacient");
        console.log(req.params);
        (async () => {
            ret_val = await pacient.getNajviacChoriPocet(req.params.pocet);
            res.status(200).json(ret_val);
        })();
    },

    getNajviacOckovaniPercenta: (req, res) => {
        const pacient = require("../models/pacient");
        console.log(req.params);
        (async () => {
            ret_val = await pacient.getNajviacOckovaniPercenta(req.params.percent);
            res.status(200).json(ret_val);
        })();
    },

    getNajviacHospitalizovaniPercenta: (req, res) => {
        const pacient = require("../models/pacient");
        console.log(req.params);
        (async () => {
            ret_val = await pacient.getNajviacHospitalizovaniPercenta(req.params.percent);
            res.status(200).json(ret_val);
        })();
    },

    getTopZamestnanciVyplatyPocet: (req, res) => {
        const oddelenie = require("../models/oddelenie");
        console.log(req.params);
        (async () => {
            ret_val = await oddelenie.getTopZamestnanciVyplatyPocet(req.params.pocet);
            res.status(200).json(ret_val);
        })();
    },

    getNajviacPredpisovaneLiekyRoka: (req, res) => {
        const liek = require("../models/liek");
        console.log(req.params);
        (async () => {
            ret_val = await liek.getNajviacPredpisovaneLiekyRoka(req.params.rok);
            res.status(200).json(ret_val);
        })();
    },

    getSumaVyplatRoka: (req, res) => {
        const nemocnica = require("../models/nemocnica");
        console.log(req.params);
        (async () => {
            ret_val = await nemocnica.getSumaVyplatRoka(req.params.id_nemocnice);
            res.status(200).json(ret_val);
        })();
    },
}