import jwt from "jsonwebtoken"; // Importa la librería jsonwebtoken para manejar tokens JWT
import 'dotenv/config'; // Carga las variables de entorno desde un archivo .env
import { mensaje } from "./mensajes.js"; // Importa la función mensaje para manejar respuestas
// Función para crear un token JWT
export function crearToken(dato) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            dato, // Información que se incluirá dentro del token
            process.env.SECRET_TOKEN, // Clave secreta para firmar el token
            { expiresIn: "1d" }, // Tiempo de expiración del token (1 día)
            (err, token) => {
                if (err) {
                    // Si hay un error al generar el token, rechaza la promesa con un mensaje de error
                    reject(mensaje(400,"Error al generar el token",err));
                } else {
                    // Si se genera correctamente, resuelve la promesa con el token generado
                    resolve(token);
                }
            }
        );
    });
}
