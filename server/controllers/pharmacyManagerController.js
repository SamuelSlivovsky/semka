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
};