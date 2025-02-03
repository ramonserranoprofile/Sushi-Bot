import { ChatOpenAI } from "@langchain/openai";
import { FileSystemChatMessageHistory } from "@langchain/community/stores/message/file_system";
import { Tool } from "langchain/tools";
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { createToolCallingAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";
import { AIMessage } from "@langchain/core/messages";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";
import fs from "fs";
import { exec } from "child_process";
import { Socket } from "socket.io";
import { Email_Tool } from "../../shared/tools/email_tool.js";

dotenv.config(); // Cargar variables de entorno

// Clase ChatOpenRouter extendiendo a ChatOpenAI para usar OpenRouter AI
class ChatOpenRouter extends ChatOpenAI {
    constructor({
        modelName,
        openaiApiKey = process.env.DEEPSEEK_OPENROUTER_API_KEY,
        openaiApiBase = "https://openrouter.ai/api/v1",
        ...options
    }) {
        if (!openaiApiKey) {
            throw new Error("❌ Error: API Key no proporcionada. Verifica tu .env o los argumentos.");
        }
        console.log("✅ Usando API Key:", openaiApiKey ? "Configurada correctamente" : "No definida");
        super({
            modelName,
            openaiApiKey,
            openaiApiBase,
            ...options,
        });
    }
}

// Prueba la instancia con un modelo válido
const llm2 = new ChatOpenRouter({
    modelName: "deepseek/deepseek-r1:free",
});

// Configurar el LLM principal para el agente
const llm = new ChatOpenAI({
    model: "gpt-4o-mini", // Asegúrate de usar un modelo válido
    temperature: 0.7,
    maxTokens: 500,
});

// Configurar el historial de chat
const memory = new FileSystemChatMessageHistory({
    sessionId: Socket.sessionId,
    path: "./chat_history.json",
});

// Herramienta para búsqueda en Google
const googleSearchTool = new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: "Buenos Aires, Argentina",
    hl: "es",
    gl: "es",
});

// Tool para ejecutar acciones locales
class AccionesLocalesTool extends Tool {
    constructor() {
        super();
        this.name = "acciones-locales";
        this.description =
            "Ejecuta acciones locales como abrir YouTube o crear archivos.";
    }

    async _call(input) {
        const inputLower = input.toLowerCase();
        if (
            inputLower.includes("abrir youtube") ||
            inputLower.includes("abre youtube") ||
            inputLower.includes("ir a youtube") ||
            inputLower.includes("ve a youtube")
        ) {
            console.log("🔹 AccionesLocalesTool: Abriendo YouTube...");
            exec("start https://youtube.com");
            return "YouTube abierto.";
        } else if (
            inputLower.includes("crear archivo") ||
            inputLower.includes("generar archivo") ||
            inputLower.includes("crear un archivo") ||
            inputLower.includes("generar un archivo") ||
            inputLower.includes("archivo") ||
            inputLower.includes("crea un archivo") ||
            inputLower.includes("crea archivo")
        ) {
            console.log("📂 AccionesLocalesTool: Creando un archivo de prueba...");
            fs.writeFileSync("prueba.txt", "Este es un archivo generado.");
            return "Archivo creado.";
        } else {
            return "No se encontró una acción válida.";
        }
    }
}

// Crear EmailTool y otra tool local
const emailTool = new Email_Tool();
const accionesLocalesTool = new AccionesLocalesTool();

// Lista de herramientas a usar
const tools = [googleSearchTool, accionesLocalesTool, emailTool];

/*
La librería Tool de LangChain (nativamente) permite crear herramientas para:
  - Ejecutar acciones locales (como abrir una URL o manipular archivos).
  - Enviar emails (con nuestra custom Email_Tool).
  - Realizar búsquedas en Google (usando SerpAPI).
*/

const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        `Eres un asistente que prioriza respuestas directas. Solo usa herramientas cuando el usuario:
        - Pida explícitamente enviar un correo (ej: "envía un email a...")
        - Solicite acciones locales (ej: "abre YouTube")
        - Requiera búsquedas en Google
    `,
    ],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
]);

// Crear el agente con las tools configuradas
const agent = createToolCallingAgent({
    llm,
    tools,
    prompt,
});

// Crear el ejecutor del agente
const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: false,
});

// Configurar RunnableWithMessageHistory para el historial
export const chainWithHistory = new RunnableWithMessageHistory({
    runnable: agentExecutor,
    inputMessagesKey: "input",
    historyMessagesKey: "chat_history",
    outputParser: new StringOutputParser({ outputKey: "output" }),
    getMessageHistory: async (sessionId) => memory,
});

// Función para interactuar con el agente de IA
export const getAIResponse = async (input, sessionId, userId) => {
    try {
        if (!userId) {
            throw new Error("El userId es obligatorio para obtener una respuesta de la IA.");
        }
        console.log("🗣️ Input recibido:", input);
        const response = await chainWithHistory.invoke(
            { input },
            { configurable: { sessionId, userId } }
        );
        console.log("🤖 Respuesta del agente:", response.output);
        await memory.addMessage(new AIMessage(response.output));
        return response.output;
    } catch (error) {
        console.error("Error en el servicio de IA:", error.message);
        return "Hubo un error al procesar tu mensaje. Inténtalo de nuevo.";
    }
};
