import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Container, Card, Icon, Form, Button } from 'semantic-ui-react';
import Chat from './components/Chat.jsx';

const socket = io.connect(import.meta.env.VITE_SERVER_HOST);

function App() {
  const [userName, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [userCount, setUserCount] = useState(0);

  const joinRoom = () => {
    if (userName !== "") {
      const room = "GENERAL";
      socket.emit('join_room', room);
      console.log(`Usuario: ${userName} se unió a la sala ${room}`);
      setShowChat(true);
    }
  };

  useEffect(() => {
    // Escuchar el evento 'usersCount' para actualizar el contador de usuarios
    const handleUserCount = (count) => {
      setUserCount(count);  // Actualizar el contador de usuarios
    };

    socket.on('usersCount', handleUserCount);  // Escuchar los cambios de usuarios

    // Limpiar el evento cuando el componente se desmonte
    return () => {
      socket.off('usersCount', handleUserCount);
    };
  }, []);

  return (
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
              <Button type="submit" onClick={joinRoom}>
                Unirse
              </Button>
            </Form>
          </Card.Content>
          <Card.Content extra>
            <Icon name="user" />{userCount} Clientes conectados
          </Card.Content>
        </Card>
      ) : (
        <Chat socket={socket} userCount={userCount} userName={userName} room="GENERAL" />  // Aquí se muestra el chat después de unirse
      )}
    </Container>
  );
}

export default App;
