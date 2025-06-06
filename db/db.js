import mongoose from "mongoose";
import {mensaje} from "../libs/mensajes.js"

export async function conectarDB() {
    try {
        //Conexion a mongo Atlas
        const conexion = await mongoose.connect("mongodb+srv://ka1z3n65:ka1z3n65@kaizen.q5t72.mongodb.net/?retryWrites=true&w=majority&appName=Kaizen");
        //retorno de mensaje de conexion exitosa
        return mensaje(200,"conexion extosa","");
    } catch (error) {
        //Manejo de errores
        return mensaje(400,"error al conectarse a la bd", error);
    }   
}
//Funcion para conectar con la base de Datos de Mongo Atlas