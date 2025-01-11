import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Container, Card, Icon, Form, Button, Header, Divider } from 'semantic-ui-react';
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
    // Escuchar el evento de conteo de usuarios
    const handleUserCount = (count) => {
      setUserCount(count); // Establece el conteo de usuarios
    };
    
    // Conectar el socket
    socket.on('usersCount', handleUserCount);
    
    // Limpiar el socket al desmontar el componente
    return () => {
      if (socket) {
        socket.off('usersCount', handleUserCount);
      };
    };
}, [socket]);

  
  return (
    <>
      <Container style={{ marginTop: '2rem', maxWidth: '600px' }}>
        {!showChat ? (
          <Card fluid color="teal">
            <Card.Content>
              <Header as="h2" icon textAlign="center">
                <Icon name="comments" circular color="teal" />
                <Header.Content>Welcome and join Sushi Chat-Bot</Header.Content>
              </Header>              
            </Card.Content>
            <Card.Content>
              <Form>
                <Form.Field>
                  <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Username</label>
                  <input
                    placeholder="Nombre de usuario . . ."
                    onChange={(event) => setUsername(event.target.value)}
                    style={{ borderRadius: '5px', padding: '10px' }}
                  />
                </Form.Field>
                <Form.Field>
                  <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Room</label>
                  <input
                    value="GENERAL"
                    readOnly
                    style={{ borderRadius: '5px', padding: '10px', backgroundColor: '#f9f9f9' }}
                  />
                </Form.Field>
                <Button                  
                  fluid
                  color="teal"
                  size="large"
                  style={{ marginTop: '1rem', borderRadius: '5px' }}
                  onClick={joinRoom}
                >
                  <Icon name="sign-in" />
                  Entrar
                </Button>
              </Form>
            </Card.Content>
            <Card.Content extra>
              <Icon name="user" color="teal" />
              {userCount} users online
            </Card.Content>
          </Card>
        ) : (
          <div className="chat-container"><Chat socket={socket} userCount={userCount} userName={userName} room="GENERAL" /></div>
        )}
      </Container>

    </>
  );
}

export default App;
