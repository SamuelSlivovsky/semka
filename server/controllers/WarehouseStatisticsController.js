const skladStats = require("../models/warehouseStats");

module.exports = {
    getMedAmount: (req, res) => {

        if(req.params.id === null || req.params.id === "null" || isNaN(req.params.id)) {
            return res.status(400).json({message: `Neplatné ID`});
        }

        (async () => {
            ret_val = await skladStats.getMedAmount(req.params.id);
            res.status(200).json(ret_val);
        })().catch((err) => {
            console.log("Error Kontroler");
            console.error(err);
            res.status(500).send(err);
        });
    },
}