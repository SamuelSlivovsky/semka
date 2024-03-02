const order = require("../models/orders");
const sklad = require("../models/sklad");
module.exports = {
    getAllOrders: (req, res) => {
        const order = require("../models/orders");
        (async () => {
            ret_val = await order.getAllOrders();
            res.status(200).json(ret_val);
        })();
    },
    getListOrders: (req, res) => {
        const order = require("../models/orders");
        (async () => {
            ret_val = await order.getListOrders(req.params.id);
            res.status(200).json(ret_val);
        })();
    },

    insertOrder: (req, res) => {
        const order = require("../models/orders");
        (async () => {
            ret_val = await order.insertOrder(req.body);
            res.status(200);
        })().catch((err) => {
            console.log("Error Kontroler");
            console.error(err);
            res.status(500).send(err);
        });
    }
};