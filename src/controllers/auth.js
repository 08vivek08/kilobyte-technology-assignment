const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
    User.findOne({ phone: req.body.phone }).
        exec(async (error, user) => {
            if (user) return res.status(400).json({
                user,
                message: 'You are already registered'
            });
            if (error) return res.status(400).json({
                error: `${error}`
            });
            const {
                phone,
                password,
                role
            } = req.body;
            const hashPassword = await bcrypt.hash(password, 13);
            const _user = new User({
                phone,
                role,
                hashPassword,
            });
            _user.save((error, data) => {
                if (error) {
                    return res.status(400).json({
                        error: `${error}`
                    });
                }
                if (data) {
                    return res.status(201).json({
                        message: `${req.body.role} created Succesfully...!`,
                        role: _user.role
                    })
                }
            });
        });
}

exports.signin = async (req, res) => {
    User.findOne({ phone: req.body.phone })
        .exec((error, user) => {
            if (error) return res.status(400).json({ error });
            if (user) {
                bcrypt.compare(req.body.password, user.hashPassword, (error, result) => {
                    if (error) res.status(400).json({ error });
                    if (result) {
                        if ((user.role !== req.body.role)) {
                            return res.status(500).json({ message: `You are not ${req.body.role}` });
                        }

                        const token = jwt.sign({ _id: user._id, role: user.role, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '1d' });
                        const { _id, phone, role } = user;

                        return res.status(200).json({
                            token,
                            user: { _id, phone, role }
                        });
                    }
                    else return res.status(400).json({ message: "Your password is incorrect" });
                });
            }
            else return res.status(400).json({ message: 'Email not registered' });
        });
}

exports.signout = async (req, res) => {
    return res.status(200).json({
        message: 'Signout successful...'
    });
}

exports.deliveryPersons = async (req, res) => {
    User.find({ role: "deliveryPerson" })
        .exec((error, users) => {
            if (error) return res.status(400).json({ error });
            if (users) {
                const deliveryPersons = users.map((user) => {
                    return {
                        _id: user._id,
                        phone: user.phone
                    }
                });
                return res.status(400).json({ deliveryPersons });
            }
        });
}