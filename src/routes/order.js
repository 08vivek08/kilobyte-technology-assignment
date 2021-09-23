const express = require("express");
const router = express.Router();
const { requireSignin, customerMiddleware, adminMiddleware, deliveryPersonMiddleware } = require("../common-middleware");
const { createOrder, cancelOrder, getOrders, assignPerson, customerOrders, deliveryOrders, editStatus } = require("../controllers/order");

router.get('/order/:status', requireSignin, customerMiddleware, customerOrders);
router.post('/order/create', requireSignin, customerMiddleware, createOrder);
router.put('/order/cancel:id', requireSignin, customerMiddleware, cancelOrder);

router.get('/admin/order/:status', requireSignin, adminMiddleware, getOrders);
router.post('/admin/order/:id', requireSignin, adminMiddleware, assignPerson);

router.get('/delivery/order/:status', requireSignin, deliveryPersonMiddleware, deliveryOrders);
router.post('/delivery/order/:id/:status', requireSignin, deliveryPersonMiddleware, editStatus);

module.exports = router;
