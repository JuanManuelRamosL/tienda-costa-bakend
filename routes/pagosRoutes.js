const express = require('express');
const router = express.Router();
const {createOrder,  recibeWebhook, deleteOrder, deleteAllOrders, getAll, actualizarEstado, obtenerPedidoUser} = require("../controllers/pagos");



router.post("/create-order",createOrder)
router.get("/orders",getAll)
router.get("/sucess",)
router.post("/webhook",recibeWebhook)
router.delete("/order",deleteOrder)
router.delete('/orders', deleteAllOrders);
router.patch('/pedidos/:id/estado', actualizarEstado);
router.get('/pedidos/:id', obtenerPedidoUser);
//hacer un get by id
module.exports = router;