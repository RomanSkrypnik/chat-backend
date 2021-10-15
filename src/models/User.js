const {Schema, model} = require('mongoose');

const User = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    login: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    activated: {
        type: Boolean,
        default: false,
    },
    activationLink: {
        type: String,
    },
});

module.exports = model('User', User);