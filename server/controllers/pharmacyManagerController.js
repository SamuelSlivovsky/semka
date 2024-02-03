module.exports = {
    getManazeriLekarni: (req, res) => {
        const manazerLekarne = require("../models/manazerLekarne");
        (async () => {
            manazeriLekarni = await manazerLekarne.getManazeriLekarni(req.params.id);
            if (req.role === 0) {
                manazeriLekarni = hashPacienti(manazeriLekarni);
            }
            res.status(200).json(manazeriLekarni);
        })();
    },
};