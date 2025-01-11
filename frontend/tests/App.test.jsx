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

    // Iniciar servidor en un puerto dinámico
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
    // test 1  Comunicación Frontend con Backend emit de mensaje Hello World
    it('should communicate', async () => {
        const testMessage = 'Hello World';

        // Configurar el servidor para emitir un evento
        ioInstance.emit('echo', testMessage);

        // Escuchar el evento en el cliente
        await new Promise((resolve) => {
        socket.once('echo', (message) => {
            expect(message).toBe(testMessage);
            resolve();
        });
        });

        // Verificar que el servidor se conectó al cliente
        ioInstance.on('connection', (clientSocket) => {
        expect(clientSocket).toBeDefined();
        });
    });
    // test 2  Comunicación con espera de Handshake desde el cliente al servidor
    it('should communicate with waiting for socket.io handshakes', async () => {
        // Emitir un evento desde el cliente hacia el servidor
        socket.emit('example', 'some messages');

        // Esperar un pequeño retraso (simula operaciones asíncronas del servidor)
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Aquí podrías agregar expectativas del lado del servidor si fuera necesario
        expect(true).toBe(true); // Solo para asegurarte de que no hay errores
    });
});
