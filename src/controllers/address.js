const Address = require("../models/address");

exports.getAddress = async (req, res) => {
    Address.find({})
        .exec((error, address) => {
            if (error) {
                return res.status(400).json({ error });
            }
            if (address) {
                return res.status(200).json({ address });
            }
        });
}

exports.createAddress = async (req, res) => {
    if (!req.body.locality || !req.body.city || !req.body.latitude || !req.body.longitude) {
        return res.status(400).json({ error: "locality, city , longitude & latitude required" });
    }
    const addressObj = {
        locality: req.body.locality,
        city: req.body.city,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    }
    const newAddress = new Address(addressObj);
    newAddress.save((error, address) => {
        if (error) {
            return res.status(400).json({ error });
        }
        if (address) {
            return res.status(201).json({ address });
        }
    });
}

exports.editAddress = async (req, res) => {
    return res.status(200).json({ message: "address will be edited soon" });
}

exports.removeAddress = async (req, res) => {
    return res.status(200).json({ message: "address will be deleted soon" });
}