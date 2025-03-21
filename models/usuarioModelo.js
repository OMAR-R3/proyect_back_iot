import mongoose from "mongoose";

// Definición del esquema para almacenar información de usuarios
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    sonName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    iv: { // Vector de inicialización para desencriptar
        type: String,
        required: true
    },
    key: { // Clave para desencriptar
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Exporta el modelo 'User' basado en el esquema definido
export default mongoose.model('User', userSchema);
