// chat.routes.js
import express from 'express';
import { chat_controller } from './chat.controller.js';

const chatRouter = express.Router();

chatRouter.post('/create', chat_controller.createChat);
chatRouter.get('/', chat_controller.getChats);
chatRouter.post('/ai', chat_controller.handleAIChat); // Cambié la ruta a `/ai` para diferenciarla

export default chatRouter;
