import Ubication from "../models/ubicacionesModelo.js"

export const ubicationRegister = async ({ idUsuario, idDispositivo, longitud, latitud }) => {
    try {
        const ubicacionExistente = await Ubication.findOne({ idUsuario, idDispositivo });

        if (ubicacionExistente) {
            // Agregar el nuevo punto a la ubicación existente
            ubicacionExistente.puntos.push({ latitud, longitud, dateTime: new Date() });
            await ubicacionExistente.save();
        } else {
            // Si no existe, crear una nueva ubicación con el primer punto
            const nuevaUbicacion = new Ubication({
                idUsuario,
                idDispositivo,
                puntos: [{ latitud, longitud, dateTime: new Date() }]
            });
            await nuevaUbicacion.save();
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

export const showUbication = async () => {
    try {
        const ubicaciones = await Ubication.find().lean();
        if (!ubicaciones.length) { 
            return { status: 400, mensajeUsuario: "No se encontraron ubicaciones" };
        }
        return { status: 200, mensajeUsuario: "Ubicaciones encontradas", datos: ubicaciones };
    } catch (error) {
        return { status: 500, mensajeUsuario: "Error al obtener ubicaciones", error };
    }
};

export const showUbicationId = async (_id) => {
    try {
        const ubicacionEncontrada = await Ubication.findOne({ _id });
        if (!ubicacionEncontrada) { 
            return { status: 400, mensajeUsuario: "Ubicación no encontrada" };
        }
        return { status: 200, mensajeUsuario: "Ubicación encontrada", datos: ubicacionEncontrada };
    } catch (error) {
        return { status: 500, mensajeUsuario: "Error al buscar ubicación", error };
    }
};
