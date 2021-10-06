const {Schema, model} = require('mongoose');

const Room = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    maxQuantity: {
        type: Number,
        required: true,
    },
    topics: {
        type: Array,
        ref: 'Topic',
    },
    hosts :{
        type: Array,
        ref: 'User',
    }
});

module.exports = model('Room', Room);