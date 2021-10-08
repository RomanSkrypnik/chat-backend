const {validationResult} = require('express-validator');
const ApiExceptions = require('../exceptions/api.exceptions');
const roomService = require('../services/room.service');

class RoomController {

    async rooms(req, res, next) {
        try {
            const rooms = await roomService.getRooms();
            return res.json(rooms);
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
            return res.json(room);

        } catch (e) {
            next(e);
        }
    }

}

module.exports = new RoomController();