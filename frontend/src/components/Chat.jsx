import React, { useEffect, useState, useRef } from 'react';
import { Container, Divider, Card, Icon, Form, Button, Message, Segment, Label } from 'semantic-ui-react';
import ChatBot from '../components/ChatBot.jsx';
import ScrollToBottom from 'react-scroll-to-bottom';
import './Chat.css'; // Additional CSS file

const Chat = ({ socket, userName, room, userCount }) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (userName && currentMessage !== '') {
            const messageData = {
                room: room,
                author: userName,
                message: currentMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            await socket.emit('send_message', messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage('');
        }
    };
    // add messages to state
    const addMessageToList = (messageData) => {
        setMessageList((list) => [...list, messageData]);
    };

    useEffect(() => {
        socket.emit('join_room', room, userName);
        
                
        // Manejar mensajes recibidos
        socket.on('receive_message', (message) => {
        console.log('Mensaje recibido:', message);
            //addMessageToList(message);
        });

        return () => {
            socket.off('receive_message'); // Limpiar evento al desmontar
        };
    }, [socket, room, userName]);
// ,room, userName
    const buttonRef = useRef(null);

    return (
        <>            
            <Container style={{ marginTop: '2rem' }}>
                <Card fluid color="teal">
                    <Card.Content>
                        <Card.Header>
                            <Icon name="chat" color="teal" /> Chat en Vivo | Sala: {room}
                        </Card.Header>
                        <Divider />
                        <Card.Meta>
                            <Icon name="user" color="teal" /> {userName} | Usuarios conectados: {userCount}
                        </Card.Meta>
                    </Card.Content>
                    <Card.Content style={{ minHeight: '400px', overflowY: 'auto', background: '#f9f9f9' }}>
                        <ScrollToBottom className="message-container">
                            {messageList.map((messageContent, index) => (
                                <Message key={index}>                                            
                                    <Segment                                        
                                        color={userName === messageContent.author ? 'teal' : 'grey'}                                        
                                        style={{
                                            marginBottom: '1rem',
                                            textAlign: userName === messageContent.author ? 'right' : 'left',
                                        }}
                                    >
                                        <Label color={userName === messageContent.author ? 'teal' : 'grey'} pointing="below">
                                            {messageContent.author}
                                        </Label>
                                        <p style={{ fontSize:'1.1rem', }}>{messageContent.message}</p>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                            {messageContent.time}
                                        </div>
                                    </Segment>
                                </Message>
                            ))}
                        </ScrollToBottom>
                    </Card.Content>
                    <Card.Content extra>
                        <Form onSubmit={sendMessage}>
                            <Form.Group>
                                <Form.Input
                                    placeholder="Escribe tu mensaje..."
                                    type="text"
                                    role="textbox"
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    width={14}
                                />
                                <Button className="ui teal icon right labeled button" ref={buttonRef}>
                                    <Icon name="send" />
                                    Enviar
                                </Button>
                            </Form.Group>
                        </Form>
                    </Card.Content>
                </Card>
                <div><ChatBot socket={socket} userCount={userCount} userName={userName} room={room} addMessageToList={addMessageToList} /></div>  
            </Container>
        </>
    )};

export default Chat