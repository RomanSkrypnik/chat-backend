const friendRequestService = require("../services/friendRequest.service");
const ApiExceptions = require("../exceptions/api.exceptions");

class FriendRequestController {

    async sendFriendRequest(req, res, next) {
        try {
            const {sender, receiver} = req.body;
            const users = await friendRequestService.checkUsers(sender, receiver);

            if (!users) {
                return ApiExceptions.notFound();
            }

            const friendRequest = await friendRequestService.createFriendRequest(users);
            return res.json(friendRequest);
        } catch (e) {
            next(e);
        }
    }

    async checkFriendRequest(req, res, next) {
        try {
            const {sender, receiver} = req.body;
            const users = await friendRequestService.checkUsers(sender, receiver);

            if (!users) {
                return ApiExceptions.notFound();
            }

            const friendRequest = await friendRequestService.checkFriendRequest(users);
            return res.json(friendRequest);
        } catch (e) {
            next(e);
        }
    }

    async declineFriendRequest(req, res, next) {
        try {
            const {sender, receiver} = req.body;
            const users = await friendRequestService.checkUsers(sender, receiver);

            if (!users) {
                return ApiExceptions.notFound();
            }

            const declinedRequest = await friendRequestService.declineFriendRequest(sender, receiver);
            return res.json(declinedRequest);
        } catch (e) {
            next(e);
        }
    }

    async acceptFriendRequest(req, res, next){
        try {
            const {sender, receiver} = req.body;
            const users = await friendRequestService.checkUsers(sender, receiver);

            if (!users) {
                return ApiExceptions.notFound();
            }

            const acceptedRequest = await friendRequestService.acceptFriendRequest(users);
            return res.json(acceptedRequest);
        } catch (e) {
            next(e);
        }
    }

    async pendingRequests(req, res, next){
        try {
            const { login } = req.body;
            const pendingRequests = await friendRequestService.getPendingRequests(login);
            return res.json(pendingRequests);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new FriendRequestController();