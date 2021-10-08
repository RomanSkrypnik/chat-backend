const io = require('../../index');

io.on('connection', (socket) => {
    console.log('connection');

    socket.on('send-message', ({message}) => {
        console.log('send-message', message);
    });

});