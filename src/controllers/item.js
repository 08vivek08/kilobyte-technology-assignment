const Item = require("../models/item");

exports.getItem = async (req, res) => {
    Item.find({})
        .exec((error, items) => {
            if (error) {
                return res.status(400).json({ error });
            }
            if (items) {
                return res.status(200).json({ items });
            }
        });
}

exports.createItem = async (req, res) => {
    if (!req.body.name || !req.body.categoryName || !req.body.address) {
        return res.status(400).json({ error: "name, categoryname & address required" });
    }
    const itemObj = {
        name: req.body.name,
        categoryName: req.body.categoryName
    }
    itemObj.pickUpAddress = [];
    if (req.body.address.length === 1) {
        itemObj.pickUpAddress.push(req.body.address);
    }
    else {
        req.body.address.forEach(address => {
            itemObj.pickUpAddress.push(address);
        });
    }
    // return res.status(200).json(itemObj);
    const newItem = new Item(itemObj);
    newItem.save((error, item) => {
        if (error) {
            return res.status(400).json({ error });
        }
        if (item) {
            return res.status(201).json({ item });
        }
    });
}

exports.editItem = async (req, res) => {
    return res.status(200).json({ message: "Item will be edited soon" });
}

exports.removeItem = async (req, res) => {
    return res.status(200).json({ message: "Item will be deleted soon" });
}