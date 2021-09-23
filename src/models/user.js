const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    hashPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'deliveryPerson'],
        default: 'customer'
    }
}, { timestamps: true });

userSchema.methods = {
    authenticate: async function (password) {
        return await bcrypt.compare(password, this.hash_password);
    }
}

module.exports = mongoose.model('User', userSchema);