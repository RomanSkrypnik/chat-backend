require('dotenv').config();
const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./src/router');
const errorMiddleware = require('./src/middleware/error.middlware');
const messageService = require('./src/services/message.service');
const roomService = require('./src/services/room.service');

const PORT = process.env.PORT || 5000;
const app = express();
const httpServer = createServer(app);
const fileStorageEngine = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './public/images')
    },
    filename(req, file, cb) {
        cb(null, Date.now() + '--' + file.originalName);
    }
});
const upload = multer({storage: fileStorageEngine});

app.post('/single', upload.single('image') , (req, res) => {
    console.log(req.file);
    res.send('Single File is uploaded');
})

const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONT_URL,
        methods: ["GET", "POST"],
    }
});

app.use(express.json());
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

            socket.on('room', async ({roomId, user}) => {
                const i = sockets.indexOf(socket);
                sockets[i].user = user;
                sockets[i].roomId = roomId;
                socket.join(roomId);
                const onlineUsers = await roomService.addOnlineUser(user, roomId);
                io.in(roomId).emit('usersOnline', onlineUsers);
            });

            socket.on('send-message', async (messageData) => {
                const newMessage = await messageService.sendMessage(messageData);
                io.in(messageData.room).emit('newMessage', newMessage);
            });

            socket.on('userLeft', async ({roomId, user}) => {
                const onlineUsers = await roomService.removeOfflineUser(user, roomId);
                io.in(roomId).emit('usersOnline', onlineUsers);
            });

            socket.on('disconnect', async () => {
                const i = sockets.indexOf(socket);
                const onlineUsers = await roomService.removeOfflineUser(sockets[i].user, sockets[i].roomId);
                io.in(sockets[i].roomId).emit('usersOnline', onlineUsers);
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
