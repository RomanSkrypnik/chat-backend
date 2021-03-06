const UserModel = require('../models/User');
const ApiExceptions = require('../exceptions/api.exceptions');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const UserDto = require('../dtos/user.dto');
const mailService = require('./mail.service');
const tokenService = require('./token.service');

class UserService {
    async registration(email, password) {
        const userExists = await UserModel.findOne({email});

        if(userExists){
            throw ApiExceptions.badRequest(`User with email ${email} already exists`);
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await UserModel.create({email, password: hashPassword, activationLink});
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto,}
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink});

        if(!user){
            throw ApiExceptions.badRequest('Incorrect activation link');
        }

        user.activated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({email});

        if(!user){
            throw ApiExceptions.badRequest('User is not found');
        }

        const isPassEquals = await bcrypt.compare(password, user.password);

        if(!isPassEquals){
            throw ApiExceptions.badRequest('Incorrect password');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto};
    }

    async logout(refreshToken) {
        return await tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiExceptions.badRequest('Unauthorized user');
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);

        if(!userData || !tokenFromDb){
            throw ApiExceptions.unauthorizedError()
        }

        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto};
    }

    async getAllUsers(){
        return UserModel.find();
    }
}

module.exports = new UserService();