const friendService = require("../services/friendRequest.service");

class FriendRequestController {

    async sendFriendRequest(req, res, next) {
        try {
            const {sender, receiver} = req.body;
            return await friendService.createFriendRequest(sender, receiver);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new FriendRequestController();