const Router = require('express').Router;
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roomController = require('../controllers/room.controller');
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

// Room routers
router.get('/rooms', authMiddleware, roomController.rooms);
router.get('/room/:id', authMiddleware , param('id', 'Param id must be mongoDB id type').isMongoId(), roomController.room);

module.exports = router;