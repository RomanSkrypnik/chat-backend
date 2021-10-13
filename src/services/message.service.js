const MessageModel = require('../models/Message');

class MessageService {

    async sendMessage(messageData) {
        const newMessage = await MessageModel.create({
            text: messageData.text,
            email: messageData.email,
            room: messageData.room,
        });
        return newMessage;
    }

    async getMessagesByOffset(offset, roomId) {
        const newMessages = await MessageModel
            .find()
            .where({room: roomId})
            .skip(parseInt(offset))
            .limit(20)
            .sort({$natural: -1});

        return newMessages;
    }

}

module.exports = new MessageService();