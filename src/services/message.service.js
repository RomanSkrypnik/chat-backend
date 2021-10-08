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
}

module.exports = new MessageService();