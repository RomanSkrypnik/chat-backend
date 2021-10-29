const PrivateMessagesModel = require('../models/PrivateMessage');

class PrivateMessageService {

    async getLastMessages(receiver) {
        const friends = receiver.friends;
        const messages = [];
        for (let friend of friends) {
            const message = await PrivateMessagesModel
                .findOne({
                    $or: [
                        {receiver: receiver.login, sender: friend.login},
                        {receiver: friend.login, sender: receiver.login}
                    ]
                })
                .sort({$natural: -1});
            messages.push(
                {
                    message,
                    friend:
                        {
                            login: friend.login,
                            friendId: friend._id
                        }
                });
        }
        return messages;
    }

    async createNewMessage({sender, receiver}, message) {
        return PrivateMessagesModel
            .create({sender: sender.login, receiver: receiver.login, message});
    }

    async getPrivateMessages(user, friend) {
        return PrivateMessagesModel
            .find({
                $or: [
                    {sender: user.login, receiver: friend.login},
                    {sender: friend.login, receiver: user.login}
                ]
            })
            .limit(20)
            .sort({$natural: -1});
    }
}

module.exports = new PrivateMessageService();