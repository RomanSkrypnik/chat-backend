const privateMessageService = require('../services/privateMessage.service');
const friendRequestService = require('../services/friendRequest.service');
const userService = require('../services/user.service');
const UserModel = require('../models/User');

class PrivateMessageController {

    async privateLastMessages(req, res, next) {
        try {
            const {receiver} = req.body;
            const user = await userService.getUser(receiver);

            const messages = await privateMessageService.getLastMessages(user);
            return res.json(messages);
        } catch (e) {
            next(e);
        }
    }

    async privateMessages(req, res, next){
        try{
            const {user, friendId} = req.body;
            const currentUser = await userService.getUser(user);
            const friend = await UserModel.findById(friendId);

            const messages = await privateMessageService.getPrivateMessages(currentUser, friend);
            return res.json(messages);
        } catch (e) {
            next(e);
        }
    }

    async createNewPrivateMessage(req, res, next) {
        try{
            const {sender, receiver, message} = req.body;
            const users = await friendRequestService.checkUsers(sender, receiver);

            const newMessage = await privateMessageService.createNewMessage(users, message);
            return res.json(newMessage);
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new PrivateMessageController();