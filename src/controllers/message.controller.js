const messageService = require('../services/message.service');

class MessageController{

    async messages(req,res,next){
        try {
            const { roomId } = req.params;
            const { offset } = req.query || 0;
            const messages = await messageService.getMessagesByOffset(offset, roomId);
            return res.json(messages);
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new MessageController();