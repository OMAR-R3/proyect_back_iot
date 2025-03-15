import mongoose from "mongoose";
import {mensaje} from "../libs/mensajes.js"

export async function conectarDB() {
    try {
        const conexion = await mongoose.connect("mongodb+srv://Cesar:ce07102005@cluster0.rrfpe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        return mensaje(200,"conexion extosa","");
    } catch (error) {
        return mensaje(400,"error al conectarse a la bd", error);
    }   
}