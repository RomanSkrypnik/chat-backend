const Router = require('express').Router;
const authMiddleware = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');
const roomController = require('../controllers/room.controller');
const messageController = require('../controllers/message.controller');
const topicsController = require('../controllers/topics.controller');
const friendController = require('../controllers/friend.controller');
const privateMessageController = require('../controllers/privateMessage.controller');
const friendRequestController = require('../controllers/friendRequest.controller');
const router = new Router();
const { body, param } = require('express-validator');
const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './public/images/users')
    },
    filename(req, file, cb) {
        cb(null, Date.now() + '--' + file.originalname);
    }
});
const upload = multer({storage: fileStorageEngine});


// User routes
router.post('/auth/register', userController.registration);
router.post('/auth/login', userController.login);
router.post('/auth/logout', userController.logout);
router.get('/auth/activate/:link', userController.activate);
router.get('/auth/refresh', userController.refresh);
router.get('/auth/user', authMiddleware, userController.user);
router.post('/users', authMiddleware, userController.usersByLogin);

// Room routes
router.get('/rooms', authMiddleware, roomController.rooms);
router.post('/rooms-by-search', authMiddleware, roomController.getRoomsByFilter);
router.post('/rooms', authMiddleware, roomController.createRoom);
router.get('/room/:id', authMiddleware , param('id', 'Param id must be mongoDB id type').isMongoId(), roomController.room);

// Message routes
router.get('/messages/:roomId', authMiddleware, messageController.messages);

// Topics routes
router.get('/topics', topicsController.topics);

// Friend routes
router.post('/friends', friendController.friends);
router.post('/friends-by-search', friendController.friendsBySearch);

// FriendRequest routes
router.post('/send-friend-request', friendRequestController.sendFriendRequest);
router.post('/check-friend-request', friendRequestController.checkFriendRequest);
router.post('/decline-friend-request', friendRequestController.declineFriendRequest);
router.post('/accept-friend-request', friendRequestController.acceptFriendRequest);
router.post('/pending-requests', friendRequestController.pendingRequests);

// PrivateMessage routes
router.post('/last-private-messages', privateMessageController.privateLastMessages);
router.post('/private-messages', privateMessageController.privateMessages);
router.post('/send-message', privateMessageController.createNewPrivateMessage);


module.exports = router;
