import React, { useEffect, useState, useRef } from 'react';
import { Container, Divider, Card, Icon, Form, Button, Message } from 'semantic-ui-react';
import ChatBot from '../components/ChatBot.jsx';
import ScrollToBottom from 'react-scroll-to-bottom';
import './Chat.css'; // Archivo CSS adicional

const Chat = ({ socket, userName, room, userCount }) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    

    const sendMessage = async () => {
        if (userName && currentMessage !== '') {
            const messageData = {
                room: room,
                author: userName,
                message: currentMessage,
                time: new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, '0'),
            };
            await socket.emit('send_message', messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage('');
        }
    };
    // agregar mensajes al estado
    const addMessageToList = (messageData) => {
        setMessageList((list) => [...list, messageData]);
    };

    // useEffect(() => {
    //     // Manejador de mensajes 
    //     const messageHandle = (data) => {
    //         if (data.room === room) {
    //             setMessageList((list) => [...list, data]);
    //         }
    //     };
    //     socket.on('receive_message', messageHandle);
    //     return () => {
    //         socket.off('receive_message', messageHandle);
            
    //     };
    // }, [socket]);    

    const buttonRef = useRef(null);

    return (
        <>            
            <Container>
                <Card fluid>
                    <Card.Content header={`Chat en vivo | Sala: ${room}`} />
                    <Card.Content style={{ minHeight: '400px', padding: '5px' }}>
                        <Card.Content extra>
                            <Icon name="user" />
                            {userName}
                        </Card.Content>                        
                        <ScrollToBottom className="message-container">
                            {messageList.map((messageContent, index) => (
                                <Message
                                    key={index}
                                    style={{textAlign: userName === messageContent.author ? 'right' : 'left'}}
                                    success={userName === messageContent.author}
                                    info={userName !== messageContent.author}
                                >
                                    <Message.Header>{messageContent.message}</Message.Header>
                                    <p>
                                        Enviado por: {messageContent.author}, a las{' '}
                                        <i style={{ fontSize: '10px' }}>{messageContent.time}</i>
                                    </p>
                                </Message>
                            ))}                            
                        </ScrollToBottom>                        
                    </Card.Content>
                    <Card.Content extra>
                        <Form>
                            <Form.Field>
                                <div className="ui action input">
                                    <input
                                        type="text"
                                        placeholder="Mensaje..."
                                        value={currentMessage}
                                        onChange={(event) => setCurrentMessage(event.target.value)}
                                    />
                                    <Button className="ui teal icon right labeled button" ref={buttonRef} onClick={sendMessage}>
                                        <Icon name="send" />Enviar
                                    </Button>
                                </div>
                            </Form.Field>
                        </Form>
                        <Divider />
                        <Card.Content extra>
                            <Icon name="user" />{userCount} Clientes conectados
                        </Card.Content>
                    </Card.Content>
                </Card>                
                <ChatBot socket={socket} userCount={userCount} userName={userName} room={room} addMessageToList={addMessageToList} />                                
            </Container>            
        </>
    );
};

export default Chat