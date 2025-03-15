import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import usuariosRutas from "./routes/usuariosRutas.js";
import { conectarDB } from "./db/db.js";

async function conexionBD() {
    const mensajeDB = await conectarDB();
    console.log(mensajeDB);
}

const app = express();
conexionBD();

// Configuración correcta de CORS para permitir cookies
app.use(cors({
    origin: true, // segun el front
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", usuariosRutas);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`)
});
