module.exports = {

    getNajviacChori: (req, res) => {
        const zoznam_chorob = require("../models/zoznam_chorob");
        console.log(req.params);
        (async () => {
            pacienti = await zoznam_chorob.getNajviacChori(req.params.pocet);
            res.status(200).json(pacienti);
        })();
    }
}