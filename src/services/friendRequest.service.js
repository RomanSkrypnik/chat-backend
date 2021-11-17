const UserModel = require('../models/User');
const FriendRequestModel = require('../models/FriendRequest');
const ApiExceptions = require('../exceptions/api.exceptions');

class FriendRequestService {

    async checkUsers(senderParam, receiverParam) {
        const sender = await UserModel.findOne({login: senderParam.login});
        const receiver = await UserModel.findOne({login: receiverParam.login});

        if (!sender || !receiver) {
            return ApiExceptions.notFound();
        }

        return {sender, receiver};
    }

    async createFriendRequest({sender, receiver}) {
        try {
            await FriendRequestModel.create({sender: sender._id, receiver: receiver._id});
            return sender;
        } catch (e) {
            console.log(e);
        }
    }

    async checkFriendRequest({sender, receiver}) {
        try {
            return FriendRequestModel.findOne({
                $or: [{
                    sender: sender._id,
                    receiver: receiver._id
                }, {
                    sender: receiver._id,
                    receiver: sender._id
                }
                ]
            });
        } catch (e) {
            console.log(e);
        }
    }

    async declineFriendRequest({sender, receiver}) {
        try {
            await FriendRequestModel.deleteOne({}, {$unset: {sender, receiver}});
            return sender;
        } catch (e) {
            console.log(e);
        }
    }

    async acceptFriendRequest({sender, receiver}) {
        try {
            await FriendRequestModel.deleteOne({}, {$unset: {sender, receiver}});

            await UserModel.updateOne(sender, {$push: {friends: receiver}});
            await UserModel.updateOne(receiver, {$push: {friends: sender}});

            return sender;
        } catch (e) {
            console.log(e);
        }
    }

    async getPendingRequests(login) {
        try {
            const user = await UserModel.findOne({login});

            if (!user) {
                return ApiExceptions.notFound();
            }

            const pendingRequests = await FriendRequestModel.find({receiver: user});
            const senders = pendingRequests.map(pendingRequest => pendingRequest.sender);

            return await UserModel.find({_id: senders});
        } catch (e) {
            console.log(e);
        }
    }

}

module.exports = new FriendRequestService();
