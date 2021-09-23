const Order = require("../models/order");
const Item = require("../models/item");
const ObjectId = require('mongoose').Types.ObjectId;
const order = require("../models/order");

function isValidObjectId(id) {
    console.log(id);
    console.log(String(new ObjectId(id)));
    return id === String(new ObjectId(id));
}

exports.customerOrders = async (req, res) => {
    req.params.status = parseInt(req.params.status);
    if (req.params.status < 0 || req.params.status > 5) {
        return res.status(400).json({ message: "Order status not valid" });
    }
    Order.find({ customer: req.user.id, status: req.params.status })
        .exec((error, order) => {
            if (error) {
                return res.status(400).json({ error });
            }
            return res.status(200).json(order);
        });
}
exports.createOrder = async (req, res) => {
    if (!req.body.items || req.body.items.length === 0) {
        return res.status(400).json({ message: "Items array can't be empty" });
    }
    const orderObj = {};
    orderObj.items = req.body.items.filter((itm) => isValidObjectId(itm.item) && itm.quantity);
    if (!orderObj.items || orderObj.items.length <= 0) {
        return res.status(400).json({ message: "Items array should contain item(mongodb id) and quantity" });
    }
    orderObj.customer = req.user._id;
    orderObj.pickUpAddress = [];
    orderObj.items.forEach((itm) => {
        Item.findOne({ _id: itm.item })
            .exec((error, item) => {
                if (error) {
                    return res.status(400).json({ error });
                }
                if (item) {
                    const i = Math.random() % (item.pickUpAddress.length);
                    orderObj.pickUpAddress.push(item.pickUpAddress[i]);
                }
            });
    });
    const newOrder = new Order(orderObj);
    newOrder.save((error, order) => {
        if (error) {
            return res.status(400).json({ error });
        }
        if (order) {
            return res.status(201).json({ order, message: "Order created successfully" });
        }
    });
}
exports.cancelOrder = async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Not a valid order id" });
    }
    Order.findOne({ _id: req.params.id })
        .exec((error, order) => {
            if (error) {
                return res.status(400).json({ error });
            }
            if (order.status === 4) {
                return res.status(400).json({
                    message: "Order already delivered, can't be canceled."
                });
            }
            order.status = 5;
            order.orderStages.canceled = Date.now;
            order.save((error, ord) => {
                if (error) {
                    return res.status(400).json({ error });
                }
                if (ord) {
                    return res.status(201).json({ ord, message: "Order cancelled successfully" });
                }
            });
        });
}



exports.getOrders = async (req, res) => {
    req.params.status = parseInt(req.params.status);
    if (req.params.status < 0 || req.params.status > 5) {
        return res.status(400).json({ message: "Order status not valid" });
    }
    Order.find({ status: req.params.status })
        .exec((error, order) => {
            if (error) {
                return res.status(400).json({ error });
            }
            return res.status(200).json(order);
        });
}
exports.assignPerson = async (req, res) => {
    if (!isValidObjectId(req.body.deliveryPerson) || !isValidObjectId(req.params.id)) {
        return res.status(400).json({
            message: "Not a valid id"
        });
    }
    return Order.findOne({ _id: req.params.id })
        .exec((error, order) => {
            if (error) {
                return res.status(400).json({ error });
            }
            if (order.deliveryPerson) {
                return res.status(400).json({
                    message: "Delivery Person Already assigned",
                    order
                });
            }
            if (order.status !== 0) {
                if (order.status === 5) {
                    return res.status(400).json({
                        message: "Order canceled by user.",
                        order
                    });
                }
            }
            order.deliveryPerson = req.body.deliveryPerson;
            order.save((error, order) => {
                if (error) {
                    return res.status(400).json({ error });
                }
                if (order) {
                    return res.status(201).json({ order, message: "Delivery Person Assigned Successfully" });
                }
            });
        });
}

exports.deliveryOrders = async (req, res) => {
    req.params.status = parseInt(req.params.status);
    if (req.params.status < 0 || req.params.status > 5) {
        return res.status(400).json({ message: "Order status not valid" });
    }
    Order.find({ deliveryPerson: req.user.id, status: req.params.status })
        .exec((error, order) => {
            if (error) {
                return res.status(400).json({ error });
            }
            return res.status(200).json(order);
        });
}
exports.editStatus = async (req, res) => {
    req.params.status = parseInt(req.params.status);
    if (req.params.status <= 0 || req.params.status > 4) {
        return res.status(400).json({ message: "Order status not valid" });
    }
    Order.findOne({ _id: req.params.id })
        .exec((error, order) => {
            if (error) {
                return res.status(400).json({ error });
            }
            if (order.deliveryPerson != req.user._id) {
                return res.status(400).json({ message:"this order is not assigned to you" });
            }
            if (order.status === 5) {
                return res.status(400).json({ message: "Order Canceled by user" });
            }
            if (order.status + 1 !== req.params.status) {
                return res.status(400).json({ message: "Order status not valid", current: order.status, new: req.params.status});
            }
            order.status = req.params.status;
            if (order.status === 1) {
                order.orderStages.reachedStore = Date.now();
            }
            else if (order.status === 2) {
                order.orderStages.itemsPicked = Date.now();
            }
            else if (order.status === 3) {
                order.orderStages.enroute = Date.now();
            }
            else {
                order.orderStages.delivered = Date.now();
            }
            order.save((error, ord) => {
                if (error) {
                    return res.status(400).json({ error });
                }
                if (ord) {
                    return res.status(201).json({ ord, message: "Order status updated Successfully" });
                }
            });
        });
}