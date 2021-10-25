const UserModel = require('../models/User');
const ApiExceptions = require("../exceptions/api.exceptions");

class FriendService {

    async getFriends(login) {
        const user = await UserModel.findOne({login});

        if (!user) {
            return ApiExceptions.notFound();
        }

        return user.friends;
    }

}

module.exports = new FriendService();