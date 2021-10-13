const RoomModel = require('../models/Room');
const UserModel = require('../models/User');
const UserDto = require('../dtos/user.dto');
const ApiExceptions = require('../exceptions/api.exceptions');


class RoomService {

    async getRooms() {
        return RoomModel.find();
    }

    async getRoom(id) {
        try {
            return await RoomModel.findById(id);
        } catch (e) {
            return null;
        }
    }

    async addOnlineUser(user, roomId) {
        try {
            const userData = await UserModel.findOne({email: user.email});

            if (!userData) {
                return ApiExceptions.notFound();
            }

            const currentRoom = await RoomModel.findById(roomId);
            const userInRoom = currentRoom.users.some(user => user.email === userData.email);

            if (!userInRoom) {
                currentRoom.users.push(userData);
                currentRoom.save();
            }

            return currentRoom.users.map(user => new UserDto(user));
        } catch (e) {
            return null;
        }
    }

    async removeOfflineUser(user, roomId) {
        try {
            const userData = await UserModel.findOne({email: user.email});

            if (!userData) {
                return ApiExceptions.notFound();
            }

            const currentRoom = await RoomModel.findById(roomId);
            const userInRoom = currentRoom.users.some(user => user.email === userData.email);

            if (userInRoom) {
                currentRoom.users = currentRoom.users.filter(user => user.email !== userData.email);
                currentRoom.save();
            }

            return currentRoom.users.map(user => new UserDto(user));
        } catch (e) {
            return null;
        }
    }

}

module.exports = new RoomService();