module.exports = {
    getZoznamZdravotnickychPomocok: (req, res) => {
        const pomocka = require("../models/zoznam_zdravotnickych_pomocok");
        (async () => {
            zoznamZdravotnickychPomocok = await pomocka.getZoznamZdravotnickychPomocok(req.params.id);
            // if (req.role === 0) {
            //     manazeriLekarni = hashPacienti(manazeriLekarni);
            // }
            res.status(200).json(zoznamZdravotnickychPomocok);
        })();
    },
};