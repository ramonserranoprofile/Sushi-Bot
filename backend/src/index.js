import app from './app.js';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();
const port = process.env.PORT_EXPRESS || 3000;

let server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

let connectedUsers = 0;

export const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

io.on('connection', (socket) => {
    console.log('User connected:', `User: ${socket.id}`);
    connectedUsers++;
    console.log('Connected users:', connectedUsers);
    io.emit('usersCount', connectedUsers);

    // Event to join a room    
    socket.on('join_room', (room) => {
        const socketJoin = socket.join(room);
        console.log(`User with ID: ${socket.id} joined room: ${room}`);        
    });

    // Message handling    
    socket.on('send_message', (data) => {
        console.log(data);

        // Only allow ChatBot to send messages to the room        
        if (data.author !== 'SushiBot') {
            // ChatBot message only to user that sends
            socket.emit('receive_message', data);
            return;
        }

        // Emit ChatBot message to all users in the room        
        io.to(data.room).emit('receive_message', data);
    });

    // Disconnect handling    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        connectedUsers--;
        console.log('Connected users:', connectedUsers);
        io.emit('usersCount', connectedUsers);
    });
});

export default server;
