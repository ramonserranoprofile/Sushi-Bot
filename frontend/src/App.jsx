import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import Chat from './components/chat';
import dotenv from 'dotenv';
import { Container, Divider, Card, Icon, Form, Button } from 'semantic-ui-react';
dotenv.config()

const socket = io.connect(process.env.server_host);

function App() {
  const [userName, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false); 
  const [userCount, setUserCount] = useState(0);
  
  const joinRoom = () => {
    if (userName !== "") {
      // Automatically join the 'GENERAL' room
      const room = "GENERAL";
      socket.emit('join_room', room);
      console.log(`Usuario: ${userName} se unió a la sala ${room}`);
      setShowChat(true);
    }
  };
  useEffect(() => {
        // Listener para el conteo de usuarios
        const handleUserCount = (count) => {
            setUserCount(count);
        };

        // Escuchar eventos del socket
        socket.on('usersCount', handleUserCount);
        
        // Escuchar eventos de conexión y desconexión
        socket.on('userConnected', () => {
            setUserCount(prevCount => prevCount + 1);
        });

        socket.on('userDisconnected', () => {
            setUserCount(prevCount => Math.max(0, prevCount - 1)); // Evitar valores negativos
        });

        // Limpieza al desmontar o cambiar 'socket'
        return () => {
            socket.off('usersCount', handleUserCount);
            socket.off('userConnected');
            socket.off('userDisconnected');
        };
    }, [socket]); // Solo dependemos de 'socket'


  const buttonRef = useRef(null);

  return (
    <>
      <Container>
        {!showChat ? (
          <Card fluid>
            <Card.Content header="Unirme al Sushi Chat-Bot" />
            <Card.Content description="Sushi Bar" />
            <Card.Content>
              <Form>
                <Form.Field>
                  <label>Nombre de usuario</label>
                  <input
                    placeholder="Nombre de usuario"
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Sala</label>
                  <input
                    placeholder="Sala"
                    value="GENERAL"  // Set default value to "GENERAL"
                    readOnly  // Make the field read-only
                  />
                </Form.Field>
                <Button ref={buttonRef} type="submit" onClick={joinRoom}>
                  Unirse
                </Button>
              </Form>
            </Card.Content>
            <Card.Content extra>
              <Icon name="user" />{userCount} Clientes conectados
            </Card.Content>
          </Card>
        ) : (
          <Chat socket={socket} userCount={userCount} userName={userName} room="GENERAL" />
        )}
      </Container>      
    </>
  );
}

export default App;