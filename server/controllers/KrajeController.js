const kraj = require("../models/kraj");

module.exports = {
    get: (req, res) => {
        res.send("Prisli ste na stranku Kraje");
    },

    getKraje: (req, res) => {

        (async () => {
            let kraje = JSON.stringify(await kraj.getKraje(), null, 4); //JSON.stringify used just to have prettier format in dev tools response
            res.status(200)
                .send(kraje);
        })();
    }
}