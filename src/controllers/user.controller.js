const userService = require('../services/user.service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api.exceptions');
const UserModel = require("../models/User");
const ApiExceptions = require("../exceptions/api.exceptions");

class UserController {

    async registration(req, res, next) {
        try {
            // const errors = validationResult(req);
            // if (!errors.isEmpty()) {
            //     return next(ApiError.badRequest('Validation error', errors.array()))
            // }
            const formData = JSON.parse(JSON.stringify(req.body));
            await userService.registration(formData);
            return res.json({message: 'success'});
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.send(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async usersByLogin(req, res, next) {
        try {
            const {search, user} = req.body;

            const currentUser = await UserModel.findOne({login: user.login});

            if (!currentUser) {
                return ApiExceptions.notFound();
            }

            const users = await userService.getUsersBySearch(currentUser, search);
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async user(req, res, next) {
        try {
            return res.json({user: req.user});
        } catch (e) {
            next(e);
        }
    }


}

module.exports = new UserController();