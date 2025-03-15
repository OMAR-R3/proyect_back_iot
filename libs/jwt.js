import jwt from "jsonwebtoken";
import 'dotenv/config';
import { mensaje } from "./mensajes.js";

export function crearToken(dato) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            dato,
            process.env.SECRET_TOKEN,
            { expiresIn: "1d" },
            (err, token) => {
                if (err) {
                    reject(mensaje(400,"Error al generar el token",err));
                } else {
                    resolve(token);
                }
            }
        );
    });
}
