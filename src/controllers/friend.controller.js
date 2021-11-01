const UserModel = require('../models/User');
const friendService = require('../services/friend.service');
const userService = require('../services/user.service');
const ApiException = require('../exceptions/api.exceptions');

class FriendController {


    async friends(req, res, next) {
        try {
            const { user } = req.body;
            const friends = await friendService.getFriends(user);
            return res.json(friends);
        } catch (e) {
            next(e);
        }
    }

    async friendsBySearch(req, res, next) {
        try{
            const { user, search } = req.body;

            const currentUser = await UserModel.findOne({login: user.login});

            if(!currentUser) {
                return ApiException.notFound();
            }

            const friends = await friendService.getFriendsBySearch(user, search);
            return res.json(friends);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new FriendController();