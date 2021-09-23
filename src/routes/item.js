const express = require("express");
const router = express.Router();
const { requireSignin, customerMiddleware, adminMiddleware, deliveryPersonMiddleware } = require("../common-middleware");
const { createItem, getItem, editItem, removeItem } = require("../controllers/item");

router.get('/item', getItem);

router.post('/admin/item', requireSignin, adminMiddleware, createItem);
router.put('/admin/item/:id', requireSignin, adminMiddleware, editItem);
router.delete('/admin/item/:id', requireSignin, adminMiddleware, removeItem);


module.exports = router;
