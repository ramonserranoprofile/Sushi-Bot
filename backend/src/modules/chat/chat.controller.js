import Chat from './chat.model.js';
import User from './user.model.js';
import mongoose from 'mongoose';
import { getAIResponse } from './chat.service.js'; // Importar el servicio de IA

// Crear un nuevo chat
export const createChat = async (req, res) => {
    try {
        const { userId, message } = req.body;
        console.log('userId:', userId)
        console.log('message:', message)
        // Validar si el userId es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'ID de usuario no válido' });
        }

        // Verificar si el usuario existe
        const sender = await User.findById(userId);
        if (!sender) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar que el usuario tenga un userName
        if (!sender.userName) {
            return res.status(400).json({ message: 'El usuario debe tener un userName' });
        }

        // Crear el nuevo chat
        const chat = new Chat({
            sender: userId,
            message,
        });

        await chat.save();

        res.status(201).json({ message: 'Chat creado exitosamente', chat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener todos los chats de un usuario
export const getChats = async (req, res) => {
    try {
        const messages = await Chat.find().populate("sender", "userId"); // Trae el userId del usuario
        res.json(messages);
    } catch (error) {
        console.error("Error al obtener mensajes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Manejar mensajes del agente de IA
export const handleAIChat = async (req, res) => {
    console.log("Solicitud recibida en handleAIChat:", req.body);

    try {
        const { message, sessionId, userId, userName } = req.body;

        if (!message || !sessionId || !userId || !userName) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        const responseText = await getAIResponse(message, sessionId, userId);

        // Guardar mensaje del usuario
        const userMessage = new Chat({
            sender: userId,
            message,
            sessionId,
        });

        await userMessage.save();

        // Guardar respuesta de la IA
        const aiMessage = new Chat({
            sender: "AI", // O un ID representativo de la IA
            message: responseText,
            sessionId,
        });

        await aiMessage.save();

        res.json({ response: responseText });
    } catch (error) {
        console.error("Error al manejar el chat del agente de IA:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


export const chat_controller = {
    createChat,
    getChats,
    handleAIChat,
};