import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import usuariosRutas from "./routes/usuariosRutas.js";
import { conectarDB } from "./db/db.js";
import './tasks/cronTasks.js';

async function conexionBD() {
    const mensajeDB = await conectarDB();
    console.log(mensajeDB);
}

const app = express();
conexionBD();

// Configuración correcta de CORS para permitir cookies
app.use(cors({
    origin: true, // Según el front
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", usuariosRutas);

// Para Vercel (manejo de solicitudes como función)
export default app;

// Para ejecución local en localhost:3000
if (process.env.NODE_ENV !== "production") {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}
