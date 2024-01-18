module.exports = {
    getVehicles: (req, res) => {
        const vehicles = require('../models/vehicle');

        (async () => {
            ret_val = await vehicles.getVehicles();
            res.status(200).json(ret_val);
            console.log(res);
        })().catch((err) => {
            console.error(err);
            res.status(403).send(err);
        });
    }
}