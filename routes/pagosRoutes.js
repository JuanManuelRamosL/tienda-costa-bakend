const express = require('express');
const router = express.Router();
const {createOrder,  recibeWebhook} = require("../controllers/pagos");



router.post("/create-order",createOrder)
router.get("/sucess",)
router.post("/webhook",recibeWebhook)

module.exports = router;