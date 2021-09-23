const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    categoryName: {
        type: String,
        required: true
    },
    pickUpAddress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Address',
            required: true
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);