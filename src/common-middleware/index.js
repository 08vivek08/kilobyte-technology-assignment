const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.requireSignin = async (req, res, next) => {
    if (!req.headers.authorization) return res.status(503).json({ message: "Authorization required" });
    else {
        const token = req.headers.authorization.split(" ")[1];
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            if (user) {
                req.user = user;
                return next();
            }
            else {
                return res.status(503).json({ message: "Your Token expired" });
            }
        }
        catch (error) {
            return res.status(503).json({ error, message: 'Something went wrong' });
        }
    }
}

exports.customerMiddleware = (req, res, next) => {
    if (req.user.role !== 'customer') {
        return res.status(503).json({
            message: 'User Access denied'
        });
    }
    next();
}

exports.deliveryPersonMiddleware = (req, res, next) => {
    if (req.user.role !== 'deliveryPerson') {
        return res.status(503).json({
            message: 'Delivery Person Access denied'
        });
    }
    next();
}

exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(503).json({
            message: 'Admin Access denied'
        });
    }
    next();
}