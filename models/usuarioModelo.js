import mongoose from "mongoose";

const userSchema = new mongoose.Schema({//esta bien
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
    salt: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);

export default mongoose.model('User', userSchema);