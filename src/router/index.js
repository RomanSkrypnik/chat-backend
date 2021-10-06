const Router = require('express').Router;
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = new Router();
const {body} = require('express-validator');

router.post('/register',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/user', authMiddleware, userController.user);
router.get('/users',authMiddleware, userController.getUsers);


module.exports = router;