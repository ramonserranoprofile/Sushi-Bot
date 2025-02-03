// user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: [true, "El nombre de usuario es obligatorio"]
    },
    userId: {
        type: String,
        unique: true,
        required: [true, "El ID del usuario es obligatorio"]
    }
}, { timestamps: true });


const User = mongoose.model("User", userSchema);
export default User;

