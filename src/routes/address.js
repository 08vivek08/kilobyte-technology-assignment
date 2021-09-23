const express = require("express");
const router = express.Router();
const { requireSignin, adminMiddleware } = require("../common-middleware");
const { createAddress, getAddress, editAddress, removeAddress } = require("../controllers/address");

router.get('/admin/address', requireSignin, adminMiddleware, getAddress);
router.post('/admin/address', requireSignin, adminMiddleware, createAddress);
router.put('/admin/address/:id', requireSignin, adminMiddleware, editAddress);
router.delete('/admin/address/:id', requireSignin, adminMiddleware, removeAddress);


module.exports = router;
