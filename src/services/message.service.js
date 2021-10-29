const MessageModel = require('../models/Message');

class MessageService {

    async sendMessage(roomId, user, message) {
        return await MessageModel.create({
            room: roomId,
            email: user.email,
            text: message
        });
    }

    async getMessagesByOffset(offset, roomId) {
        return MessageModel
            .find()
            .where({room: roomId})
            .skip(parseInt(offset))
            .limit(20)
            .sort({$natural: -1});
    }

}

module.exports = new MessageService();