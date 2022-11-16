const kraj = require("../models/kraj");

module.exports = {
    get: (req, res) => {
        res.send("Prisli ste na stranku Kraje");
    },

    getAll: (req, res) => {

        (async () => {
            let kraje = JSON.stringify(await kraj.getAll(), null, 4); //JSON.stringify used just to have prettier format in dev tools response
            res.status(200)
                .send(kraje);
            //res.send(kraje[0]["ID_KRAJA"]);
            //console.log(kraje[0]["ID_KRAJA"]);
        })();
    }
}