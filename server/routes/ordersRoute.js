const express = require("express");
const router = express.Router();
const controller = require("../controllers/ordersController");
const verify = require("../middleware/verifyUser");

router.get(
    "/all",
    verify.verifyRoles(0, 2, 3, 5),
    controller.getAllOrders
);

router.get(
    "/list/:id",
    verify.verifyRoles(0, 2, 3, 5),
    controller.getListOrders
);

router.post("/add", verify.verifyRoles(0, 2, 3, 5), controller.insertOrder);

router.post(
    "/deleteOrder",
    verify.verifyRoles(0, 2, 3, 5),
    controller.deleteOrder
);

module.exports = router;