import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../src/App';

// Mock del módulo socket.io-client
vi.mock('socket.io-client', () => ({
    __esModule: true,
    default: vi.fn(() => ({
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
    })),
    io: vi.fn(() => ({
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
    })),
}));

describe('App Component', () => {
    let mockSocket;

    beforeEach(() => {
        // Inicializa mockSocket antes de cada prueba
        mockSocket = {
            on: vi.fn(),
            off: vi.fn(),
            emit: vi.fn(),
        };

        // Reasignar el mock del módulo
        vi.mocked(require('socket.io-client').default).mockReturnValue(mockSocket);
    });q

    afterEach(() => {
        vi.resetAllMocks(); // Limpiar mocks después de cada prueba
    });

    describe('Initial Render', () => {
        it('should render the initial form with username and room input', () => {
            render(<App />);
            expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
            expect(screen.getByText('GENERAL')).toBeInTheDocument();
            expect(screen.getByText(/users online/i)).toBeInTheDocument();
        });
    });

    describe('Join Room Functionality', () => {
        it('should join the chat room when username is provided', () => {
            render(<App />);
            const usernameInput = screen.getByPlaceholderText('Enter your username');
            const joinButton = screen.getByText(/entrar/i);

            fireEvent.change(usernameInput, { target: { value: 'TestUser' } });
            fireEvent.click(joinButton);

            expect(screen.queryByText(/Welcome and join Sushi Chat-Bot/i)).not.toBeInTheDocument();
            expect(screen.getByText(/users online/i)).toBeInTheDocument();
        });
    });

    describe('Socket Events', () => {
        it('should update user count when usersCount event is received', () => {
            // Simula la recepción del evento 'usersCount' con el valor 5
            mockSocket.on.mockImplementation((event, callback) => {
                if (event === 'usersCount') {
                    callback(5);
                }
            });

            render(<App />);

            // Asegúrate de que el texto se actualice después de recibir el evento
            expect(screen.getByText('5 users online')).toBeInTheDocument();
        });

        it('should clean up socket listeners on unmount', () => {
            const { unmount } = render(<App />);
            unmount();

            // Verificar que se haya limpiado el evento 'usersCount'
            expect(mockSocket.off).toHaveBeenCalledWith('usersCount', expect.any(Function));
        });
    });
});
