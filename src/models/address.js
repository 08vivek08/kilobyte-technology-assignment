const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    locality: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
}, { timestamps: false });

module.exports = mongoose.model('Address', addressSchema);