const UserModel = require('../models/User');
const FriendRequestModel = require('../models/FriendRequest');
const ApiExceptions = require('../exceptions/api.exceptions');

class FriendRequestService {

    async createFriendRequest(senderParam, receiverParam) {
        try {
            const sender = UserModel.findOne({login: senderParam.login});
            const receiver = UserModel.findOne({login: receiverParam.login});

            if (!sender || !receiver) {
                return ApiExceptions.notFound()
            }

            return await FriendRequestModel.create({sender, receiver});
        } catch (e) {
            console.log(e);
        }
    }

}

module.exports = new FriendRequestService();