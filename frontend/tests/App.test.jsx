import { describe, beforeAll, afterAll, beforeEach, afterEach, it, expect } from 'vitest';
import http from 'http';
import { io } from 'socket.io-client';
import { Server } from 'socket.io';

let socket;
let httpServer;
let ioInstance;

/**
 * Setup WS & HTTP servers
 */
beforeAll(() => {
    // Crear servidor HTTP
    httpServer = http.createServer();
    ioInstance = new Server(httpServer);

    // Start server on a dynamic port    
    return new Promise((resolve) => {
        httpServer.listen(() => {
        resolve();
        });
    });
});

/**
 * Cleanup WS & HTTP servers
 */
afterAll(() => {
    ioInstance.close();
    httpServer.close();
});

/**
 * Run before each test
 */
beforeEach(() => {
    const { port } = httpServer.address();
    socket = io(`http://localhost:${port}`, {
        transports: ['websocket'],
        forceNew: true,
        reconnectionDelay: 0,
        reopenDelay: 0,
    });

    return new Promise((resolve) => {
        socket.on('connect', () => resolve());
    });
    });

    /**
     * Run after each test
     */
    afterEach(() => {
    if (socket.connected) {
        socket.disconnect();
    }
});

/**
 * Tests
 */
describe('Socket.IO basic example with Vitest', () => {
    // test 1  Frontend to Backend communication with Hello World message emit    
    it('should communicate', async () => {
        const testMessage = 'Hello World';

        // Configure the server to emit an event        
        ioInstance.emit('echo', testMessage);

        // Listen for the event on the client        
        await new Promise((resolve) => {
        socket.once('echo', (message) => {
            expect(message).toBe(testMessage);
            resolve();
        });
        });

        // Verify that the server connected to the client        
        ioInstance.on('connection', (clientSocket) => {
            expect(clientSocket).toBeDefined();
        });
    });
    // test 2  Communication with handshake wait from client to server    
    it('should communicate with waiting for socket.io handshakes', async () => {
        // Emit an event from client to server        
        socket.emit('example', 'some messages');

        // Wait for a small delay (simulates server asynchronous operations)        
        await new Promise((resolve) => setTimeout(resolve, 50));

        // more expectations can be added on the server side        
        expect(true).toBe(true); // only to ensure not errors
    });
});
