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

    friends: {
        type: Array,
    },

    groups: {
        type: Array,
    },

    photo: {
        type: String,
    },

    online: {
        type: Boolean,
        default: false,
    },

    activated: {
        type: Boolean,
        default: false,
    },

    activationLink: {
        type: String,
    },

    socketId: {
        type: String,
    }
});

module.exports = model('User', User);