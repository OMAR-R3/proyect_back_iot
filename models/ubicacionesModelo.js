import mongoose from "mongoose";

// Definición del esquema para almacenar ubicaciones de usuarios y dispositivos
const ubicationSchema = new mongoose.Schema({
    idUsuario: {
        type: String,
        required: true,// Campo obligatorio que identifica al usuario
        trim: true // Elimina espacios en blanco al inicio y final
    },
    idDispositivo: {
        type: String,
        required: true, // Campo obligatorio que identifica el dispositivo
        trim: true // Elimina espacios en blanco al inicio y final
    },
    // Lista de puntos de ubicación asociados al usuario y dispositivo
    puntos: [{
        latitud: {
            type: String,
            required: true // Latitud del punto de ubicación (como string)
        },
        longitud: {
            type: String,
            required: true // Longitud del punto de ubicación (como string)
        },
        dateTime: {
            type: Date,
            default: Date.now // Se registra la fecha y hora del punto automáticamente
        }
    }]
}, {
    timestamps: true// Agrega automáticamente createdAt y updatedAt
});
// Exporta el modelo 'Ubication' basado en el esquema definido, para usarlo en la base de datos
export default mongoose.model('Ubication', ubicationSchema);