import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
// Removed deprecated act import
import React from 'react';
import App from '/src/App.jsx';
import io from 'socket.io-client';

// Mock de Socket.IO
vi.mock('socket.io-client', () => {
    const mockSocket = {
        on: vi.fn(),
        emit: vi.fn(),
        off: vi.fn(),
    };
    return {
        default: () => mockSocket,
    };
});

describe('App Component - User Count', () => {
    let socketMock;

    beforeEach(() => {
        // Crear un mock de socket antes de cada prueba
        socketMock = io();
    });

    afterEach(() => {
        vi.clearAllMocks(); // Limpiar mocks después de cada prueba
    });

    test('Debe actualizar el conteo de usuarios cuando se recibe el evento usersCount', () => {
        render(<App />);

        // Buscar la función de callback para el evento 'usersCount'
        const handleUserCount = socketMock.on.mock.calls.find(
            ([eventName]) => eventName === 'usersCount'
            )[1];

        // Simular el evento 'usersCount' con 5 usuarios
        act(() => {
            handleUserCount(5);
        });

        // Verificar que el DOM muestra "5 users online"
        const userCountText = screen.getByText(/5 users online/i);
        expect(userCountText).toBeInTheDocument();
    });
});
