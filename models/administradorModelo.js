import mongoose from "mongoose";

// Definición del esquema para los administradores
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
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
    tipoUsuario: {
        type: String,
        default: "admin"
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

// Base para la creación de administradores en la base de datos
export default mongoose.model('Admin', adminSchema);
