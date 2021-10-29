require('dotenv').config();
const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./src/router');
const errorMiddleware = require('./src/middleware/error.middlware');
const messageService = require('./src/services/message.service');
const roomService = require('./src/services/room.service');
const privateMessageService = require('./src/services/privateMessage.service');
const UserModel = require('./src/models/User');
const path = require("path");

const PORT = process.env.PORT || 5000;
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONT_URL,
        methods: ["GET", "POST"],
    }
});

app.use('/public', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
app.use(errorMiddleware);

const sockets = [];

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        io.on('connection', (socket) => {
            sockets.push(socket);
            console.log('Connection');

            socket.on('main-connect', async (user) => {
                if (user) {
                    const i = sockets.indexOf(socket);
                    sockets[i].user = user;
                    await UserModel.findOneAndUpdate({login: user.login}, {online: true, socketId: sockets[i].id});
                }
            });

            socket.on('join-room', async (roomId, user) => {
                const joinedUser = await UserModel.findOne({login: user.login});
                const i = sockets.indexOf(socket);

                sockets[i].roomId = roomId;
                socket.join(roomId);

                const onlineUsers = await roomService.addOnlineUser(joinedUser, roomId);
                io.in(roomId).emit('users-online', onlineUsers);
            });

            socket.on('send-private-message', async (receiverId, message) => {
                const i = sockets.indexOf(socket);

                const receiver = await UserModel.findById(receiverId);
                const sender = await UserModel.findOne({login: sockets[i].user.login});
                const newMessage = await privateMessageService.createNewMessage({sender, receiver}, message);

                io.in(receiver.socketId).emit('new-private-message', newMessage);
                socket.emit('new-private-message-self', newMessage);
            });

            socket.on('send-room-message', async (roomId, user, message) => {
                const newMessage = await messageService.sendMessage(roomId, user, message);
                io.in(roomId).emit('new-room-message', newMessage);
            });

            socket.on('leave-room', async (roomId, user) => {
                if (roomId) {
                    const onlineUsers = await roomService.removeOfflineUser(user, roomId);
                    io.in(roomId).emit('users-online', onlineUsers);
                    socket.leave(roomId);
                }
            });

            socket.on('disconnect', async () => {
                const i = sockets.indexOf(socket);
                const login = sockets[i].user ? sockets[i].user.login : null;
                const roomId = sockets[i].roomId;

                if (login && roomId) {
                    const user = await UserModel.findOneAndUpdate({login}, {online: false, socketId: null});
                    const onlineUsers = await roomService.removeOfflineUser(user, roomId);
                    io.in(roomId).emit('users-online', onlineUsers);
                }
            });

            socket.on('error', (e) => {
                console.log(e);
            });

        });

        httpServer.listen(PORT, () => console.log(`Server is listening to port ${PORT}...`));
    } catch (e) {
        console.log(e);
    }
}

start();
