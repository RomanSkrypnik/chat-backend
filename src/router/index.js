const Router = require('express').Router;
const authMiddleware = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');
const roomController = require('../controllers/room.controller');
const messageController = require('../controllers/message.controller');
const topicsController = require('../controllers/topics.controller');
const router = new Router();
const { body, param } = require('express-validator');

// User routes
router.post('/auth/register',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration);
router.post('/auth/login', userController.login);
router.post('/auth/logout', userController.logout);
router.get('/auth/activate/:link', userController.activate);
router.get('/auth/refresh', userController.refresh);
router.get('/auth/user', authMiddleware, userController.user);
router.get('/auth/users',authMiddleware, userController.getUsers);

// Room routes
router.get('/rooms', authMiddleware, roomController.rooms);
router.post('/rooms-by-search', authMiddleware, roomController.getRoomsByFilter);
router.post('/rooms', authMiddleware, roomController.createRoom);
router.get('/room/:id', authMiddleware , param('id', 'Param id must be mongoDB id type').isMongoId(), roomController.room);

// Message routes
router.get('/messages/:roomId', authMiddleware, messageController.messages);

// Topics routes
router.get('/topics', topicsController.topics);

module.exports = router;
