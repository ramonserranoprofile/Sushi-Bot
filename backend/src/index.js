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

    // Evento para unirse a una sala
    socket.on('join_room', (room) => {
        const socketJoin = socket.join(room);
        console.log(`User with ID: ${socket.id} joined room: ${room}`);        
    });

    // Manejo de mensajes
    socket.on('send_message', (data) => {
        console.log(data);

        // Solo permitir que ChatBot envíe mensajes a la sala
        if (data.author !== 'SushiBot') {
            // Emitir el mensaje solo al usuario que lo envía
            socket.emit('receive_message', data);
            return;
        }

        // Emitir el mensaje del ChatBot a todos los usuarios en la sala
        io.to(data.room).emit('receive_message', data);
    });

    // Manejo de desconexión
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        connectedUsers--;
        console.log('Connected users:', connectedUsers);
        io.emit('usersCount', connectedUsers);
    });
});

export default server;
