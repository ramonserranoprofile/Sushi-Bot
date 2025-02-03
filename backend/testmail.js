import { Email_Tool } from "./modules/email_tool.js";
import dotenv from "dotenv";
dotenv.config();

async function testEmail() {
    const emailTool = new Email_Tool();
    const result = await emailTool.sendEmail(
        "Prueba de Asunto",
        "<html><body><p>Esto es una prueba.</p></body></html>",
        "ramonserrano76@gmail.com"
    );
    console.log("Resultado:", result);
}
testEmail();