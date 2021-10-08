require('dotenv').config();
const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./src/router');
const errorMiddleware = require('./src/middleware/error.middlware');
const messageService = require('./src/services/message.service');

const PORT = process.env.PORT || 5000;
const app = express();
const httpServer = createServer(app);
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

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        io.on('connection', (socket) => {

            socket.on('room', ({room}) => {
                socket.join(room);
            });

            socket.on('send-message', async (messageData) => {
                const newMessage = await messageService.sendMessage(messageData);
                io.in(messageData.room).emit('newMessage', newMessage);
            });


        });

        httpServer.listen(PORT, () => console.log(`Server is listening to port ${PORT}...`));
    } catch (e) {
        console.log(e);
    }
}

start();
