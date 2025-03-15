import mongoose from "mongoose";
import {mensaje} from "../libs/mensajes.js"

export async function conectarDB() {
    try {
        const conexion = await mongoose.connect("mongodb+srv://Cesar:ce07102005@cluster0.rrfpe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        //const conexion = await mongoose.connect("mongodb://127.0.0.1:27017/MongoApps");//faltantes
        //const conexion2= await mongoose.connection("mongodb://127.0.0.1:27017/MongoUbicaciones");//faltantes
        //console.log(conexion);
        //console.log("Conexion correcta a mongodb");
        return mensaje(200,"conexion extosa","");
    } catch (error) {
        return mensaje(400,"error al conectarse a la bd", error);
    }   
}