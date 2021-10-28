const UserModel = require('../models/User');
const ApiExceptions = require("../exceptions/api.exceptions");

class FriendService {

    async getFriends({login}) {
        const user = await UserModel.findOne({login});

        if (!user) {
            return ApiExceptions.notFound();
        }

        return user.friends;
    }

    async getFriendsBySearch({login}, search) {
        const user = await UserModel.findOne({login});

        if (!user) {
            return ApiExceptions.notFound();
        }

        return search
            ? await UserModel.find({login: {$regex: '.*' + search + '.*'}})
            : await UserModel.find({login: {$nin: user.login}});
    }

}

module.exports = new FriendService();