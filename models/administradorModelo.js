import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({//esta bien
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
    salt: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);

export default mongoose.model('Admin', adminSchema);