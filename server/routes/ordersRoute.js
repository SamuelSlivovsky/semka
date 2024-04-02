const express = require("express");
const router = express.Router();
const controller = require("../controllers/OrdersController");
const verify = require("../middleware/verifyUser");

router.get(
    "/all/:id",
    verify.verifyRoles(0, 2, 3, 5, 10),
    controller.getAllOrders
);

router.get(
    "/list/:id",
    verify.verifyRoles(0, 2, 3, 5, 10),
    controller.getListOrders
);

router.post("/add", verify.verifyRoles(0, 2, 3, 5, 10), controller.insertOrder);

router.post(
    "/confirmOrder",
    verify.verifyRoles(0, 2, 3, 5, 10),
    controller.confirmOrder
)

router.post(
    "/deleteOrder",
    verify.verifyRoles(0, 2, 3, 5, 10),
    controller.deleteOrder
);

module.exports = router;