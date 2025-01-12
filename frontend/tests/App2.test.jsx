import { render, screen, fireEvent } from '@testing-library/react';
import { vi, expect, describe, beforeEach, afterEach } from 'vitest';
import App from '../src/App.jsx';

describe('App Component', () => {    

    describe('Initial Render', () => {
        it('should render the initial form with username and room input', () => {
            render(<App />);
            expect(screen.getByPlaceholderText('Nombre de usuario . . .')).toBeInTheDocument();            
            expect(screen.getByText(/users online/i)).toBeInTheDocument();
        });
    });

    describe('Join Room Functionality', () => {
        it('should join the chat room when username is provided', () => {
            render(<App />);
            const usernameInput = screen.getByPlaceholderText('Nombre de usuario . . .');
            const joinButton = screen.getByText(/entrar/i);

            fireEvent.change(usernameInput, { target: { value: 'TestUser' } });
            fireEvent.click(joinButton);

            expect(screen.queryByText(/Welcome and join Sushi Chat-Bot/i)).not.toBeInTheDocument();
            
        });
    });

    
});
