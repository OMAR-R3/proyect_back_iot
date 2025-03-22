import mongoose from "mongoose";
import {mensaje} from "../libs/mensajes.js"

export async function conectarDB() {
    try {
        const conexion = await mongoose.connect("mongodb+srv://ka1z3n65:ka1z3n65@kaizen.q5t72.mongodb.net/?retryWrites=true&w=majority&appName=Kaizen");
        return mensaje(200,"conexion extosa","");
    } catch (error) {
        return mensaje(400,"error al conectarse a la bd", error);
    }   
}