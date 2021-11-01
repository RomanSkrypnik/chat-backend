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
        const currentUser = await UserModel.findOne({login});

        if (!currentUser) {
            return ApiExceptions.notFound();
        }

        const users = search
            ? await UserModel.find({login: {$regex: '.*' + search + '.*'}})
            : currentUser.friends;

        return users.filter(user => {
            return currentUser.friends.every(friend => {
                return friend.login.includes(user.login);
            })
        });
    }

}

module.exports = new FriendService();