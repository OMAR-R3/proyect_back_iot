import cron from 'node-cron';
import Ubication from '../models/ubicacionesModelo.js'; // Ruta correcta al modelo

// Tarea cron para borrar ubicaciones todos los días a medianoche
cron.schedule('0 0 * * *', async () => {
    try {
        await Ubication.deleteMany({});
        console.log("Todas las ubicaciones han sido borradas.");
    } catch (error) {
        console.error("Error al borrar las ubicaciones:", error);
    }
});