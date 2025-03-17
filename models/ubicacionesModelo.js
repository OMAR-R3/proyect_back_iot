import mongoose from "mongoose";

const ubicationSchema = new mongoose.Schema({
    idUsuario: {
        type: String,
        required: true,
        trim: true
    },
    idDispositivo: {
        type: String,
        required: true,
        trim: true
    },
    puntos: [{
        latitud: {
            type: String,
            required: true
        },
        longitud: {
            type: String,
            required: true
        },
        dateTime: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model('Ubication', ubicationSchema);