const TopicModel = require('../models/Topic');

class TopicsService {

    async getTopics(){
        return TopicModel.find();
    }

}

module.exports = new TopicsService();