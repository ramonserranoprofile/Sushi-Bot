import { Tool } from "langchain/tools";
import { PromptTemplate } from "@langchain/core/prompts";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();

export class Email_Tool extends Tool {
    constructor() {
        super();

        //console.log("IONOS_USER:", process.env.IONOS_USER);
        //console.log("IONOS_PASS:", process.env.IONOS_PASS);
        //console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

        if (!process.env.IONOS_USER || !process.env.IONOS_PASS) {
            throw new Error("❌ Error: Credenciales de correo no proporcionadas. Verifica tu .env");
        }

        this.name = "email-tool";
        this.description = "Extrae datos (recipient, subject, body) de un mensaje y envía un email profesional usando nodemailer.";

        this.apiKey = process.env.OPENAI_API_KEY;
        this.llm2 = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0.3,
            apiKey: this.apiKey,
        });

        console.log("✅ API Key para Email Tool:", this.apiKey ? "Configurada correctamente" : "No definida");
    }

    async sendEmail(subject, body, toEmail) {
        const transporter = nodemailer.createTransport({
            host: "smtp.ionos.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.IONOS_USER,
                pass: process.env.IONOS_PASS,
            },
            tls: {
                rejectUnauthorized: true,
            },
            logger: true,
            debug: true,
        });

        const mailOptions = {
            from: `"IA Mail Service" <${process.env.IONOS_USER}>`,
            to: 'ramonserrano76@gmail.com',
            subject: 'pruebita',
            html: 'pruebita html',
            text: "Versión en texto plano (opcional)",
        };

        console.log("📤 Enviando correo a:", toEmail);
        console.log("📝 Asunto:", subject);
        console.log("📝 HTML (preview):", body.substring(0, 50) + "...");

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("📨 Envío exitoso:", info.messageId);
            return `✅ Correo enviado correctamente a ${toEmail}`;
        } catch (error) {
            console.error("🔥 Error SMTP:", error.response || error);
            return `❌ Error al enviar el correo: ${error.message}`;
        }
    }

    async _call(input) {
        const extractionPromptTemplate = new PromptTemplate({
            template: `
                Extrae en formato JSON:
                - "recipient" (correo válido)
                - "subject" (50 caracteres máx)
                - "body" (mensaje original)
                
                Devuelve SOLO el JSON sin texto adicional.

                Ejemplo:
                { 
                    "recipient": "cliente@empresa.com",
                    "subject": "Confirmación de reunión",
                    "body": "Estimado cliente..."
                }

                Input: "{texto}"
            `,
            inputVariables: ["texto"],
        });

        const extractionPrompt = await extractionPromptTemplate.format({ texto: input });
        console.log("🔎 Extraction Prompt:", extractionPrompt);

        try {
            const extractionResponse = await this.llm2.invoke(extractionPrompt, { response_format: "json" });
            const extractionContent = extractionResponse?.content || extractionResponse;
            console.log("📄 Extraction Content (RAW):", extractionContent);

            function extractJSON(text) {
                const match = text.match(/\{.*\}/s);
                return match ? match[0] : null;
            }

            const cleanedJson = extractJSON(extractionContent);
            if (!cleanedJson) {
                throw new Error("❌ No se pudo extraer JSON válido");
            }

            let extractedData;
            try {
                extractedData = JSON.parse(cleanedJson);
            } catch (error) {
                throw new Error("❌ Error al parsear JSON: " + error.message);
            }

            const { recipient: toEmail, subject, body } = extractedData;
            console.log("📩 Recipient:", toEmail);
            console.log("📝 Subject:", subject);
            console.log("📝 Body:", body.substring(0, 50) + "...");

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
                throw new Error("❌ Email no válido");
            }

            const improvementPrompt = `
                Genera un HTML VÁLIDO con:
                - Estructura básica (<html>, <head>, <body>)
                - Estilos inline presentables
                - Una cabecera con el subject y el body en un párrafo
                
                Ejemplo:
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #333; }
                    p { font-size: 16px; }
                    a { display: inline-block; padding: 10px 20px; background: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    <h1>${subject}</h1>
                    <p>${body}</p>
                    <a href="https://www.ramonserranoprofile.com">Botón</a>
                </body>
                </html>
            `;

            console.log("🔧 Improvement Prompt:", improvementPrompt);
            const improvementResponse = await this.llm2.invoke(improvementPrompt);

            const improvedContent = typeof improvementResponse === "object" && improvementResponse?.content
                ? improvementResponse.content
                : String(improvementResponse);

            console.log("📧 Improved Content (preview):", improvedContent.substring(0, 100) + "...");

            return await this.sendEmail(subject, improvedContent, 'ramonserrano76@gmail.com');
        } catch (error) {
            console.error("[EmailTool] Error:", error);
            return `❌ Error: ${error.message}`;
        }
    }
}

// Exportar la clase Email_Tool
export default Email_Tool;
