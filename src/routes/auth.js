const express = require("express");
const router = express.Router();
const { signup, signin, signout, deliveryPersons } = require("../controllers/auth");
const { validateSigningRequest, isRequestValidated, reqAdmin, reqCustomer, reqDeliveryPerson } = require("../validators/auth");
const { requireSignin, adminMiddleware } = require("../common-middleware");

router.post('/signin', validateSigningRequest, isRequestValidated, reqCustomer, signin);
router.post('/signup', validateSigningRequest, isRequestValidated, reqCustomer, signup);
router.post('/signout', requireSignin, signout);


router.post('/admin/signin', validateSigningRequest, isRequestValidated, reqAdmin, signin);
router.post('/admin/signup', validateSigningRequest, isRequestValidated, reqAdmin, signup);
router.post('/admin/signout', requireSignin, signout);
router.get('/admin/deliveryperson', requireSignin, adminMiddleware, deliveryPersons);

router.post('/delivery/signin', validateSigningRequest, isRequestValidated, reqDeliveryPerson, signin);
router.post('/delivery/signup', validateSigningRequest, isRequestValidated, reqDeliveryPerson, signup);
router.post('/delivery/signout', requireSignin, signout);

module.exports = router;
