import mongoose from "mongoose";

const ubicationSchema = new mongoose.Schema({

    idUsuario:{
        type:String,
        required: true,
        trim: true
    }, 
    /*dateTime:{
        type:Date,
        required: true,
        trim: true
    },*/ 
    longitud:{
        type:String,
        required: true,
        trim: true
    },
    latitud:{
        type:String,
        required: true,
        trim: true
    }
},
    {
        timestamps: true
    }
);

export default mongoose.model('Ubication', ubicationSchema);