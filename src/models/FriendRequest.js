const { Schema, model } = require('mongoose');

const FriendRequest = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        required: true,
    }
});

module.exports = model('FriendRequest', FriendRequest);