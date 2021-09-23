const { check, validationResult } = require("express-validator");

exports.validateSigningRequest = [
    check('phone')
        .isMobilePhone()
        .isLength({ min: 10, max: 10 })
        .withMessage('Valid Phone number is required'),
    check('password')
        .isStrongPassword()
        .withMessage("Password must be at least 8 character long & must have 1 uppercase,lowercase,number,symbols")
];

exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
}

exports.reqCustomer = (req, res, next) => {
    req.body.role = 'customer';
    next();
}

exports.reqDeliveryPerson = (req, res, next) => {
    req.body.role = 'deliveryPerson';
    next();
}

exports.reqAdmin = (req, res, next) => {
    req.body.role = 'admin';
    next();
}
