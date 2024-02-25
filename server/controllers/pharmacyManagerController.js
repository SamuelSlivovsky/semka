module.exports = {
    getManazeriLekarni: (req, res) => {
        const manazerLekarne = require("../models/manazer_lekarne");
        (async () => {
            manazeriLekarni = await manazerLekarne.getManazeriLekarni(req.params.id);
            // if (req.role === 0) {
            //     manazeriLekarni = hashPacienti(manazeriLekarni);
            // }
            res.status(200).json(manazeriLekarni);
        })();
    },

    getLekarnici: (req, res) => {
        const lekarnik = require("../models/manazer_lekarne");
        (async () => {
            lekarnici = await lekarnik.getLekarnici(req.params.id);
            // if (req.role === 0) {
            //     lekarnici = hashPacienti(manazeriLekarni);
            // }
            res.status(200).json(lekarnici);
        })();
    },

    getManazerLekarneInfo: (req, res) => {
        const manazerLekarne = require("../models/manazer_lekarne");
        (async () => {
            info = await manazerLekarne.getManazerLekarneInfo(req.params.id);
            res.status(200).json(info);
        })();
    },

    getLekarniciInfo: (req, res) => {
        const lekarnik = require("../models/manazer_lekarne");
        (async () => {
            info = await lekarnik.getLekarniciInfo(req.params.id);
            res.status(200).json(info);
        })();
    },

    getZoznamLiekov: (req, res) => {
        const liek = require("../models/manazer_lekarne");
        (async () => {
            zoznamLiekov = await liek.getZoznamLiekov(req.params.id);
            // if (req.role === 0) {
            //     manazeriLekarni = hashPacienti(manazeriLekarni);
            // }
            res.status(200).json(zoznamLiekov);
        })();
    },

        getZoznamZdravotnickychPomocok: (req, res) => {
        const pomocka = require("../models/manazer_lekarne");
        (async () => {
            zoznamZdravotnickychPomocok = await pomocka.getZoznamZdravotnickychPomocok(req.params.id);
            // if (req.role === 0) {
            //     manazeriLekarni = hashPacienti(manazeriLekarni);
            // }
            res.status(200).json(zoznamZdravotnickychPomocok);
        })();
    },
};