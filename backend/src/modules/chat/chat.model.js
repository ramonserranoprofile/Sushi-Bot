// chat.model.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    sender: { type: String, required: true },  // En lugar de ObjectId
    message: { type: String, required: true },
    sessionId: { type: String, required: true },
    userName: { type: String }
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
