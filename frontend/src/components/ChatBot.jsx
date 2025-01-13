import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatBot = ({ socket, room, userName, botName = "SushiBot", addMessageToList }) => {
    const [menu, setMenu] = useState([]);
    const [currentFlow, setCurrentFlow] = useState(null);
    const [order, setOrder] = useState({
        customerName: userName,
        products: [],
    });

    const welcomeSentRef = useRef(false); // Reference instead State

    useEffect(() => {
        if (!socket) {
            console.error("Socket no está definido en ChatBot");
            return;
        }
        const handleMessagle = async (data) => {
            if (data.room === room && data.author !== 'SushiBot') {
                let botResponse = "";

                if (currentFlow === "order") {
                    botResponse = await handleOrderFlow(data.message);
                } else if (currentFlow === "faq") {
                    botResponse = await handleFaq(data.message);
                } else {
                    botResponse = await handleCommand(data.message);
                }

                if (botResponse) {
                    const botMessage = {
                        room: room,
                        author: botName,
                        message: botResponse,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    };
                    socket.emit("send_message", botMessage);
                    addMessageToList(botMessage); // Add message to list
                }
            }
        };

        socket.on("receive_message", handleMessagle);

        // Send welcome message only if it hasn't been sent yet (using ref)        
        if (!welcomeSentRef.current) {
            const welcomeMessage = {
                room: room,
                author: botName,
                message: `¡¡ Hola  ${userName}, Bienvenido !!. Soy ${botName}. Aquí están las opciones con las que puedes interactuar conmigo:\n
                        1. Ver el menú\n
                        2. Hacer un pedido\n
                        3. Preguntar algo en la sección de Preguntas Frecuentes (FAQ)\n
                        ¿Cómo puedo ayudarte hoy? Responde con el número de la opción que desees.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            socket.emit("send_message", welcomeMessage);
            addMessageToList(welcomeMessage);
            welcomeSentRef.current = true; // set as sent
        }

        return () => {
            socket.off("receive_message", handleMessagle);
        };
    }, [socket, room, botName, currentFlow, addMessageToList]);

    // Functions fetchMenu, fetchFAQ, handleFaq, handleOrderFlow, handleCommand below without changes
    const fetchMenu = async (returnAsString = true) => {
        try {
            const response = await axios.get("http://localhost:3000/menu/", {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status !== 200 || !Array.isArray(response.data)) {
                throw new Error("Formato de respuesta inválido o error en el estado.");
            }

            setMenu(response.data);

            if (returnAsString) {
                return response.data
                    .map(item => `| ${item.name}: $${item.price}`)
                    .join("\n");
            } else {
                return response.data;
            }
        } catch (error) {
            console.error("Error al obtener el menú:", error.message);
            throw new Error("No pude obtener el menú. Inténtalo más tarde.");
        }
    };

    const fetchFAQ = async (question) => {
        try {
            const response = await axios.get(`http://localhost:3000/faq/${question}`);
            return response.data.answer || "No encontré información sobre tu pregunta.";
        } catch (error) {
            console.error("Error al obtener la FAQ:", error);
            return "¡ No entendí esa pregunta !. Por favor inténtalo con otra pregunta ó escríbela correctamente.";
        }
    };

    const handleFaq = async (message) => {
        if (message.toLowerCase() === "volver") {
            setCurrentFlow(null);
            return "Por favor, selecciona entre las opciones  1. Consultar Menú, 2. Hacer un Pedido  o 3. Hacer Preguntas Frecuentes (FAQ).";
        }
        setCurrentFlow("faq");
        return await fetchFAQ(message);

    };

    const handleOrderFlow = async (message) => {
        if (message.toLowerCase() === "volver") {
            // delete products from the order if there was something included before going back
            setOrder({ products: [] });
            setCurrentFlow(null);
            return "Por favor, selecciona entre las opciones  1. Consultar Menú, 2. Hacer un Pedido  o 3. Hacer Preguntas Frecuentes (FAQ).";
        } else if (message.toLowerCase() === "comprar") {
            setCurrentFlow(null);

            const orderData = {
                customerName: userName,
                products: order.products.map(product => ({
                    id: product._id, // Changed to _id to match with backend                    
                    quantity: product.quantity,
                })),
            };

            console.log("orderData antes del POST:", orderData);

            try {
                const response = await axios.post('http://localhost:3000/order', orderData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 201) { // Verify if creation was successful                    
                    const { customerName, products, total } = response.data;

                    // Verify `summary` is an array
                    if (Array.isArray(products)) {
                        // Build summary message 
                        let resumenMensaje = "Resumen de tu pedido:\n";
                        // Iterate over products and build summary
                        products.forEach((item) => {
                            resumenMensaje += `- ${item.name}: ${item.quantity} x $${item.price.toFixed(2)}\n`;
                        });

                        resumenMensaje += `Total: $${total.toFixed(2)}`;

                        //Reset the order and return the summary message   
                        setOrder({ products: [] });

                        return `Pedido completado. Procesando tu orden...\n\n${resumenMensaje}`;
                    } else {
                        throw new Error("El formato del resumen no es válido");
                    }
                } else {
                    return "Hubo un problema al procesar tu pedido. Inténtalo nuevamente.";
                }
            } catch (error) {
                console.error("Error al realizar el pedido:", error);
                return "No pude completar tu pedido. Por favor, inténtalo más tarde.";
            }
        }

        let productos = [];
        try {
            productos = await fetchMenu(false);
            if (!productos.length) {
                return "El menú no está disponible en este momento. Por favor, inténtalo más tarde.";
            }
        } catch (error) {
            console.error("Error al obtener el menú:", error.message);
            return "Hubo un error al cargar el menú. Por favor, inténtalo más tarde.";
        }

        const product = productos.find(item =>
            message.toLowerCase().trim() === item.name.toLowerCase().trim()
        );

        if (product) {
            setOrder(prevOrder => {
                const existingProduct = prevOrder.products.find(p => p._id === product._id);

                if (existingProduct) {
                    return {
                        ...prevOrder,
                        products: prevOrder.products.map(p =>
                            p._id === product._id
                                ? { ...p, quantity: p.quantity + 1 }
                                : p
                        ),
                    };
                }

                return {
                    ...prevOrder,
                    products: [...prevOrder.products, { _id: product._id, quantity: 1 }],
                };
            });

            return `Producto agregado: ${product.name} - $${product.price}. ¿Deseas agregar algo más? Ingresa el Nombre EXACTO DEL PRODUCTO, escribe 'Volver' para salir ó responde 'Comprar' si finalizaste tu pedido.`;
        } else {
            return "No encontré ese producto en el menú. Intenta con otro.";
        }
    };

    const handleCommand = async (command) => {
        if (command === "1") {
            const menuText = await fetchMenu(true);
            return `¡ ${userName} !, aquí está nuestro menú:\n${menuText}`;
        } else if (command === "2") {
            setCurrentFlow("order");
            return `¿Qué producto deseas agregar a tu pedido, ${userName}? Escribe el nombre del producto. Si te arrepentiste escribe 'Volver'`;
        } else if (command === "3") {
            setCurrentFlow("faq");
            return "Por favor, escribe tu pregunta. Tembién puedes escribir 'Volver' para salir al Menú principal";
        } else {
            return `Hola, Soy ${botName}, Bienvenido. Por favor, selecciona entre las opciones: \n1. Consultar Menú, \n2. Hacer un Pedido ó \n3. Hacer Preguntas Frecuentes (FAQ).`;
        }
    };
    return (
        <div>
            {/* Renders the chatbot interface */ }
        </div>
    );
};

export default ChatBot;
