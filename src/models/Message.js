const { Schema, model } = require('mongoose');

const Message = new Schema({

    text: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },

    date: {
        type: Date,
        default: Date.now(),
    }

});

module.exports = model('Message', Message);