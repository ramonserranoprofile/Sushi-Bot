import React, { useEffect, useState, useRef } from 'react';
import { Container, Divider, Card, Icon, Button, Message, Segment, Label } from 'semantic-ui-react';
import ChatBot from '../components/ChatBot.jsx';
import ScrollToBottom from 'react-scroll-to-bottom';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste';
import ReactQuill from 'react-quill';
import './Chat.css'; // Additional CSS file

const Chat = ({ socket, userName, room, userCount }) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (userName && currentMessage.trim() !== '') {
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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Evitar saltos de línea
            sendMessage();
        }
    };

    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            const quillEditor = document.querySelector('.ql-editor');
            const cursorPosition = quillEditor.selectionStart || quillEditor.innerHTML.length;
            const image = `<img src="${reader.result}" alt="Uploaded Image" style="max-width: 100%;"/>`;

            // Insertar la imagen en la posición actual del cursor
            quillEditor.innerHTML =
                quillEditor.innerHTML.slice(0, cursorPosition) +
                image +
                quillEditor.innerHTML.slice(cursorPosition);
            setCurrentMessage(quillEditor.innerHTML); // Actualizar el estado
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                handleImageUpload(file);
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const addMessageToList = (messageData) => {
        setMessageList((list) => [...list, messageData]);
    };

    // useEffect(() => {
    //     socket.on('receive_message', (message) => {
    //         console.log('Mensaje recibido:', message);
    //         addMessageToList(message);
    //     });

    //     return () => {
    //         socket.off('receive_message');
    //     };
    // }, [socket]);

    const buttonRef = useRef(null);
    const handleChange = (content, delta, source, editor) => {
        // Obtenemos solo texto plano
        const plainText = editor.getText().trim(); // Obtiene el texto sin etiquetas HTML
        setCurrentMessage(plainText); // Almacenar solo texto plano
    };

    

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
                                        <div
                                            style={{ fontSize: '1.1rem' }}
                                            dangerouslySetInnerHTML={{ __html: messageContent.message }}
                                        />
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                            {messageContent.time}
                                        </div>
                                    </Segment>
                                </Message>
                            ))}
                        </ScrollToBottom>
                    </Card.Content>
                    <Card.Content extra>
                        <div
                            style={{ display: 'flex', alignItems: 'center' }}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <ReactQuill
                                value={currentMessage}
                                onChange={setCurrentMessage}
                                onKeyDown={handleKeyPress}
                                modules={{ toolbar: false }}
                                formats={[
                                    'header',
                                    'bold',
                                    'italic',
                                    'underline',
                                    'strike',
                                    'blockquote',
                                    'list',
                                    'bullet',
                                    'indent',
                                    'link',
                                    'image',
                                    'video',
                                    'color',
                                    'background',
                                    'align',
                                    'size',
                                    'font',
                                ]}
                                placeholder="Escribe tu mensaje o arrastra una imagen aquí..."
                                style={{
                                    borderRadius: '20px',
                                    border: '1px solid #ccc',
                                    padding: '0.5rem',
                                    width: '100%',
                                    minHeight: '40px',
                                    maxHeight: '80px',
                                    overflowY: 'auto',
                                }}
                            />
                            <Button
                                className="ui teal icon right labeled button"
                                onClick={sendMessage}
                                ref={buttonRef}
                                disabled={!currentMessage.trim()}
                                style={{ marginLeft: '1rem' }}
                            >
                                <Icon name="send" />
                                Enviar
                            </Button>
                        </div>
                    </Card.Content>
                </Card>
                <div><ChatBot socket={socket} userCount={userCount} userName={userName} room={room} addMessageToList={addMessageToList} /></div>
            </Container>
        </>
    );
};

export default Chat;
