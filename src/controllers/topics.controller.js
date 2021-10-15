const topicsService = require('../services/topics.service');

class TopicsController {

    async topics(req, res, next) {
        try {
            const topics = await topicsService.getTopics();
            return res.json(topics);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new TopicsController();