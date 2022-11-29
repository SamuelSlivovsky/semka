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

    getTypyOckovaniaPacienti: (req, res) => {
        const pacient = require("../models/pacient");
        console.log(req.params);
        (async () => {
            ret_val = await pacient.getTypyOckovaniaPacienti();
            res.status(200).json(ret_val);
        })();
    },

    getZamestnanciOddeleni: (req, res) => {
        const oddelenie = require("../models/oddelenie");
        console.log(req.params);
        (async () => {
            ret_val = await oddelenie.getZamestnanciOddeleni();
            res.status(200).json(ret_val);
        })();
    },

    getNajcastejsieChorobyRokaPocet: (req, res) => {
        const choroba = require("../models/choroba");
        console.log(req.params);
        (async () => {
            ret_val = await choroba.getNajcastejsieChorobyRokaPocet(req.params.id_nemocnice, req.params.rok);
            res.status(200).json(ret_val);
        })();
    },

    getNeobsadeneLozkaOddeleniaTyzden: (req, res) => {
        const lozko = require("../models/lozko");
        console.log(req.params);
        (async () => {
            ret_val = await lozko.getNeobsadeneLozkaOddeleniaTyzden(req.params.id_oddelenia);
            res.status(200).json(ret_val);
        })();
    },

    getLiekyMenejAkoPocet: (req, res) => {
        const sklad = require("../models/sklad");
        console.log(req.params);
        (async () => {
            ret_val = await sklad.getLiekyMenejAkoPocet(req.params.pocet);
            res.status(200).json(ret_val);
        })();
    },

    getMenovciPacientLekar: (req, res) => {
        const os_udaje = require("../models/os_udaje");
        console.log(req.params);
        (async () => {
            ret_val = await os_udaje.getMenovciPacientLekar();
            res.status(200).json(ret_val);
        })();
    },

    getOperaciePocetLekarovTrvanie: (req, res) => {
        const operacia = require("../models/operacia");
        console.log(req.params);
        (async () => {
            ret_val = await operacia.getOperaciePocetLekarovTrvanie(req.params.pocetLekarov, req.params.trvanie);
            res.status(200).json(ret_val);
        })();
    },

    getKrajePodlaPoctuOperovanych: (req, res) => {
        const kraj = require("../models/kraj");
        console.log(req.params);
        (async () => {
            ret_val = await kraj.getKrajePodlaPoctuOperovanych();
            res.status(200).json(ret_val);
        })();
    },

    getPacientiChorobaP13: (req, res) => {
        const pacient = require("../models/pacient");
        console.log(req.params);
        (async () => {
            ret_val = await pacient.getPacientiChorobaP13();
            res.status(200).json(ret_val);
        })();
    },

    getPriemernyVek: (req, res) => {
        const lekar = require("../models/lekar");
        console.log(req.params);
        (async () => {
            ret_val = await lekar.getPriemernyVek();
            res.status(200).json(ret_val);
        })();
    },

    getPocetPacientiPodlaVeku: (req, res) => {
        const pacient = require("../models/pacient");
        console.log(req.params);
        (async () => {
            ret_val = await pacient.getPocetPacientiPodlaVeku();
            res.status(200).json(ret_val);
        })();
    },

    getPomerMuziZeny: (req, res) => {
        const os_udaje = require("../models/os_udaje");
        console.log(req.params);
        (async () => {
            ret_val = await os_udaje.getPomerMuziZeny();
            res.status(200).json(ret_val);
        })();
    },
}