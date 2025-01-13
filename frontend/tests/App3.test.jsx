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
        // Create a socket mock before each test
        socketMock = io();
    });

    afterEach(() => {
        vi.clearAllMocks(); // clean mocks after each test
    });

    test('Debe actualizar el conteo de usuarios cuando se recibe el evento usersCount', () => {
        render(<App />);

        // Find the callback function for the 'usersCount' event
        const handleUserCount = socketMock.on.mock.calls.find(
            ([eventName]) => eventName === 'usersCount'
            )[1];

        // Simulate the 'usersCount' event with 5 users 
        act(() => {
            handleUserCount(5);
        });

        // Verify DOM shows "5 users online"
        const userCountText = screen.getByText(/5 users online/i);
        expect(userCountText).toBeInTheDocument();
    });
});
