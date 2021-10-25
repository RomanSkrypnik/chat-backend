const UserModel = require('../models/User');
const friendService = require('../services/friend.service');

class FriendController {
    async friends(req, res, next) {
        try {
            const {login} = req.body;
            const friends = await friendService.getFriends(login);
            return res.json(friends);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new FriendController();