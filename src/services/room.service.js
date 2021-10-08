const RoomModel = require('../models/Room');
const MessageModel = require('../models/Message');
const MessageDto = require('../dtos/message.dto');


class RoomService {

    async getRooms() {
        return RoomModel.find();
    }

    async getRoom(id) {
        try {
            const room = await RoomModel.findById(id);
            const messages = await MessageModel.find({room});
            const messagesDto = messages.map(message => {
               return new MessageDto(message);
            });
            return {room, messages: messagesDto};
        } catch (e) {
            return null;
        }
    }

}

module.exports = new RoomService();