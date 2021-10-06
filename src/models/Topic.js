const { Schema, model } = require('mongoose');

const Topic = new Schema({
    name: {
        type: String,
        required: true,
    }
});

module.exports = model('Topic', Topic);