import mongoose from "mongoose";
// Definición del esquema para almacenar información de usuarios
const userSchema = new mongoose.Schema({//esta bien
    username: {
        type: String,
        required: true, // Campo obligatorio para el nombre de usuario
        trim: true, // Elimina espacios en blanco al inicio y final
        unique: true // Asegura que el nombre de usuario sea único en la base de datos
    },
    sonName: {
        type: String,
        required: true, // Campo obligatorio para el apellido del usuario
        trim: true // Elimina espacios en blanco al inicio y final
    },
    email: {
        type: String,
        required: true, // Campo obligatorio para el correo electrónico
        trim: true, // Elimina espacios en blanco al inicio y final
        unique: true // Asegura que el email sea único en la base de datos
    },
    password: {
        type: String,
        required: true // Campo obligatorio para almacenar la contraseña del usuario
    },
    salt: {
        type: String,
        required: true // Almacena la clave de cifrado utilizada para la contraseña
    }
},
    {
        timestamps: true // Agrega automáticamente los campos createdAt y updatedAt
    }
);
// Exporta el modelo 'User' basado en el esquema definido, para su uso en la base de datos
export default mongoose.model('User', userSchema);