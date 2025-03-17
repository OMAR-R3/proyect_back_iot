import mongoose from "mongoose";
// Definición del esquema para los administradores
const adminSchema = new mongoose.Schema({//esta bien
    username: {
        type: String,
        required: true, // Campo obligatorio
        trim: true, // Elimina espacios en blanco al inicio y final
        unique: true // No se permiten nombres de usuario duplicados
    },
    email: {
        type: String,
        required: true, // Campo obligatorio
        trim: true, // Elimina espacios en blanco
        unique: true // No se permiten correos electrónicos duplicados
    },
    password: {
        type: String,
        required: true// Campo obligatorio (debe almacenarse encriptado)
    },
    tipoUsuario: {
        type: String,
        default: "admin" // Valor predeterminado para indicar que es un administrador
    },
    salt: {
        type: String,
        required: true // Se almacena el salt usado en la encriptación de la contraseña
    }
},
    {
        timestamps: true // Agrega automáticamente createdAt y updatedAt
    }
);
//Base para la creacion de administradores en la base de datos
export default mongoose.model('Admin', adminSchema);