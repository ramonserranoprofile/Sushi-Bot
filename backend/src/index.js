import app from './app.js';
import http from 'http';
import fs from 'fs';
import { Server } from 'socket.io';
import { port, clientUrl } from './config/environment.js';

const options = {
    key: fs.readFileSync('./private.key'), // .key es para localhost cambiar para el dominio en producción
    cert: fs.readFileSync('./certificate.crt') // .crt es para localhost, cambiar para el dominio en produccion
};

let server = http.createServer(options, app);
//let server = https.createServer(options, app);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

let connectedUsers = 0;

export const io = new Server(server, {
    cors: {
        origin: clientUrl,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

io.on('connection', (socket) => {
    console.log('User connected:', `User: ${socket.id}`);
    connectedUsers++;
    console.log('Connected users:', connectedUsers);
    io.emit('usersCount', connectedUsers);

    // Event to join a room    
    socket.on('join_room', (room, userId) => {
        socket.join(room);
        console.log(`User with ID: ${socket.id} joined room: ${room}`);
        socket.sessionId = socket.id; // Usar socket.id como sessionId
        socket.userId = userId; // Guardar userId en el socket
        socket.room = room; // Guardar la sala en el socket
        socket.to(room).emit('user_connected', userId); // 
        console.log('Connected users:', connectedUsers); // 
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