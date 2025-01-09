import app from './app.js';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

const port = process.env.PORT_EXPRESS || 3001;

let server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

let connectedUsers = 0;

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('User connected:', `User: ${socket.id}`);    
    connectedUsers++;
    io.emit('usersCount', connectedUsers);

    socket.on('join_room', (room) => {
        socket.join(room);        
        console.log('User with ID:', `${ socket.id } joined room: ${ room }`);

});

// Handle message sending (only send to 'GENERAL' room, but filter user messages)
socket.on('send_message', (data) => {

    console.log(data);

    // Only allow ChatBot to send messages to the room
    if (data.author !== 'SushiBot') {
        // Emit the message to all users in the 'GENERAL' room
        //socket.to(data.room).emit('receive_message', data);

        // Prevent user messages from being broadcast to the room
        socket.emit('receive_message', data);
        //console.log('Message sent to room:', data.room);
        return
    }

    // Emit the ChatBot message to all users in the 'GENERAL' room
    //socket.to(data.room).emit('receive_message', data + `from server2`);
    
});

socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    connectedUsers--;
    io.emit('usersCount', connectedUsers); // Emitir el conteo 
});
});

export default server;