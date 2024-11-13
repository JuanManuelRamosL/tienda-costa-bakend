const express = require('express');
const router = express.Router();
const {createOrder,  recibeWebhook, deleteOrder, deleteAllOrders, getAll} = require("../controllers/pagos");



router.post("/create-order",createOrder)
router.get("/orders",getAll)
router.get("/sucess",)
router.post("/webhook",recibeWebhook)
router.delete("/order",deleteOrder)
router.delete('/orders', deleteAllOrders);

module.exports = router;