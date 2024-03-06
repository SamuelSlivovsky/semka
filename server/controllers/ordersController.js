const order = require("../models/orders");
module.exports = {
    getAllOrders: (req, res) => {
        (async () => {
            ret_val = await order.getAllOrders();
            res.status(200).json(ret_val);
        })();
    },
    getListOrders: (req, res) => {
        (async () => {
            ret_val = await order.getListOrders(req.params.id);
            res.status(200).json(ret_val);
        })();
    },

    insertOrder: (req, res) => {
        (async () => {
            ret_val = await order.insertOrder(req.body);
            res.status(200);
        })().catch((err) => {
            console.log("Error Kontroler");
            console.error(err);
            res.status(500).send(err);
        });
    },

    deleteOrder: (req, res) => {
        (async () => {
            ret_val = await order.deleteObjednavka(req.body);
            res.status(200);
        })().catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
    }
};