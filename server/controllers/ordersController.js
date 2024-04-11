const order = require("../models/orders");
const {insertLogs} = require("../utils/InsertLogs");
module.exports = {
    getAllOrders: (req, res) => {
        (async () => {
            ret_val = await order.getAllOrders();
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get orders",
                description: "Failed to get orders",
                table: "objednavka",
            });
            res.status(500).send(err);
        });
    },
    getListOrders: (req, res) => {
        (async () => {
            ret_val = await order.getListOrders(req.params.id);
            res.status(200).json(ret_val);
        })().catch((err) => {
            insertLogs({
                status: "failed to get orders",
                description: "Failed to get orders",
                table: "objednavka",
            });
            res.status(500).send(err);
        });
    },

    insertOrder: (req, res) => {
        (async () => {
            ret_val = await order.insertOrder(req.body);
            res.status(200);
        })().catch((err) => {
            insertLogs({
                status: "failed to insert order",
                description: "Failed to insert order",
                table: "objednavka",
            });
            res.status(500).send(err);
        });
    },

    deleteOrder: (req, res) => {
        (async () => {
            ret_val = await order.deleteObjednavka(req.body);
            res.status(200);
        })().catch((err) => {
            insertLogs({
                status: "failed to delete order",
                description: "Failed to delete order",
                table: "objednavka",
            });
            res.status(500).send(err);
        });
    }
};