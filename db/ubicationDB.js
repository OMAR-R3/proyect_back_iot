import { mensaje } from "../libs/mensajes.js";
import Ubication from "../models/ubicacionesModelo.js";
import moment from "moment-timezone"; // Importar moment-timezone

// Función para registrar una nueva ubicación o actualizar una existente
export const ubicationRegister = async ({ idUsuario, idDispositivo, longitud, latitud }) => {
    try {
        // Ajustar la hora a la zona horaria de México
        const mexicoTime = moment().tz("America/Mexico_City").toDate(); // Convertir la fecha a México (zona horaria)

        // Buscar si ya existe una ubicación registrada para el usuario y dispositivo
        const ubicacionExistente = await Ubication.findOne({ idUsuario, idDispositivo });

        // Si la ubicación ya existe, agregar el nuevo punto de coordenadas con la fecha y hora actual
        if (ubicacionExistente) {
            // Agregar el nuevo punto a la ubicación existente
            ubicacionExistente.puntos.push({ latitud, longitud, dateTime: mexicoTime });
            await ubicacionExistente.save();
        } else {
            // Si no existe, crear una nueva ubicación con el primer punto
            const nuevaUbicacion = new Ubication({
                idUsuario,
                idDispositivo,
                puntos: [{ latitud, longitud, dateTime: mexicoTime }]
            });
            await nuevaUbicacion.save(); // Guardar la nueva ubicación en la base de datos
        }

        return {
            status: 200,
            mensajeUsuario: "Ubicación registrada con éxito."
        };
    } catch (error) {
        console.error("Error al registrar ubicación:", error);
        return {
            status: 500,
            mensajeUsuario: "Error al registrar la ubicación."
        };
    }
};

// Función para obtener todas las ubicaciones almacenadas en la base de datos
export const showUbication = async () => {
    try {
        const ubicaciones = await Ubication.find().lean(); // Obtener todas las ubicaciones y convertirlas a objetos JSON
        
        if (!ubicaciones.length) { 
            return { status: 400, mensajeUsuario: "No se encontraron ubicaciones" };
        }

        // Convertir las fechas de todas las ubicaciones a la zona horaria de México
        ubicaciones.forEach(ubicacion => {
            ubicacion.puntos.forEach(punto => {
                punto.dateTime = moment(punto.dateTime).tz("America/Mexico_City").format(); // Ajustar la fecha
            });
        });

        return { status: 200, mensajeUsuario: "Ubicaciones encontradas", datos: ubicaciones };
    } catch (error) {
        return { status: 500, mensajeUsuario: "Error al obtener ubicaciones", error };
    }
};

// Función para obtener una ubicación específica por su ID
export const showUbicationId = async (_id) => {
    try {
        const ubicacionEncontrada = await Ubication.findOne({ _id }); // Buscar ubicación por su ID
        
        if (!ubicacionEncontrada) { 
            return { status: 400, mensajeUsuario: "Ubicación no encontrada" };
        }

        // Convertir las fechas de todos los puntos de la ubicación a la zona horaria de México
        ubicacionEncontrada.puntos.forEach(punto => {
            punto.dateTime = moment(punto.dateTime).tz("America/Mexico_City").format(); // Ajustar la fecha
        });

        return { status: 200, mensajeUsuario: "Ubicación encontrada", datos: ubicacionEncontrada };
    } catch (error) {
        return { status: 500, mensajeUsuario: "Error al buscar ubicación", error };
    }
};

// Función para eliminar todas las ubicaciones
export const deleteAllUbications = async () => {
    try {
        const ubicacionesEliminadas = await Ubication.deleteMany({});
        if (!ubicacionesEliminadas) {
            return mensaje(400, "Ubicaciones no borradas");
        }
        return mensaje(200, "Todas las ubicaciones borradas");
    } catch (error) {
        return { status: 400, mensajeUsuario: "Error al borrar las ubicaciones", datos: error };
    }
};
