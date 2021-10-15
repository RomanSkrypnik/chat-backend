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

            await RoomModel.updateOne({_id: roomId}, {'$pull': {"users": {email: userData.email}}});
            const room = await RoomModel.findById(roomId);

            return room.users.map(user => new UserDto(user));
        } catch (e) {
            console.log(e);
        }
    }

    async addNewRoom(newRoomParams){
        try{
            const user = await UserModel.findOne( {email: newRoomParams.email} );

            if(!user) {
                return ApiExceptions.notFound();
            }

            return await RoomModel.create({...newRoomParams, hosts: [ user ]});

        } catch (e) {
            console.log(e);
        }
    }

}

module.exports = new RoomService();