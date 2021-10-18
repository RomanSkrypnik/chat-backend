const {validationResult} = require('express-validator');
const ApiExceptions = require('../exceptions/api.exceptions');
const roomService = require('../services/room.service');

class RoomController {

    async rooms(req, res, next) {
        try {
            const rooms = await roomService.getRooms();
            return await res.json(rooms);
        } catch (e) {
            next(e);
        }
    }

    async getRoomsByFilter(req, res, next) {
        try {
            const body = req.body;
            const roomsByFilter = await roomService.getRoomsByFilter(body);
            return await res.json(roomsByFilter);
        } catch (e) {
            next(e);
        }
    }

    async room(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiExceptions.badRequest('Params validation error', errors.array()));
            }

            const room = await roomService.getRoom(req.params.id);
            return await res.json(room);

        } catch (e) {
            next(e);
        }
    }

    async createRoom(req, res, next) {
        try {
            const newRoomParams = req.body;
            const newRoom = await roomService.addNewRoom(newRoomParams);

            return await res.json(newRoom);

        } catch (e) {
            next(e);
        }
    }

}

module.exports = new RoomController();
