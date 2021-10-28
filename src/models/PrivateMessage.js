const {Schema, model} = require('mongoose');

const PrivateMessage = new Schema({

    sender: {
        type: String,
        required: true
    },

    receiver: {
        type: String,
        required: true,
    },

    message: {
        type: String,
        required: true,
    },

    date: {
        type: Date,
        default: Date.now(),
    }

});

module.exports = model('PrivateMessage', PrivateMessage);