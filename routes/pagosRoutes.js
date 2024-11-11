const express = require('express');
const router = express.Router();
const {createOrder} = require("../controllers/pagos")


router.post("/create-order",createOrder)
router.get("/sucess",)
router.get("/webhok",)

module.exports = router;