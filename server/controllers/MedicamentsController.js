module.exports = {
    getZoznamLiekov: (req, res) => {
        const liek = require("../models/zoznam_liekov");
        (async () => {
            zoznamLiekov = await liek.getZoznamLiekov(req.params.id);
            // if (req.role === 0) {
            //     manazeriLekarni = hashPacienti(manazeriLekarni);
            // }
            res.status(200).json(zoznamLiekov);
        })();
    },
};