module.exports = {
    get: (req, res) => {
        res.send("Prisli ste na stranku Kraje");
    },

    getAll: (req, res) => {
        const kraj = require("../models/kraj").makeObject();

        let kraje;
        (async () => {
            kraje = await kraj.getAll();
            res.send(kraje);
            //res.send(kraje[0]["ID_KRAJA"]);
            //console.log(kraje[0]["ID_KRAJA"]);
        })();
    }
}