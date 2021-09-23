const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Item',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    deliveryPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderStages: {
        taskCreated: {
            type: Date,
            default: Date.now,
            required: true
        },
        reachedStore: {
            type: Date,
            default: null
        },
        itemsPicked: {
            type: Date,
            default: null
        },
        enroute: {
            type: Date,
            default: null
        },
        delivered: {
            type: Date,
            default: null
        },
        canceled: {
            type: Date,
            default: null
        }
    },
    status: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
        default: 0
    },
    pickUpAddress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    }],
    deliveryAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);