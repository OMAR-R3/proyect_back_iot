import crypto from "crypto";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { mensaje } from "../libs/mensajes.js";
import { showId } from "../db/usuariosDB.js";
import exp from "constants";

// Función para encriptar contraseñas
export function encriptarPassword(password) {
    // Genera un salt aleatorio
    const salt = crypto.randomBytes(32).toString("hex");
    // Genera un hash utilizando scryptSync con el salt y la contraseña
    const hash = crypto.scryptSync(password, salt, 10, 64, "sha512").toString("hex");
    return {
        salt,
        hash
    }
}

// Genera un hash utilizando scryptSync con el salt y la contraseña
export function validarPassword(password, salt, hash) {
    // Genera el hash con la contraseña ingresada y el salt
    const hashEvaluar = crypto.scryptSync(password, salt, 10, 64, "sha512").toString("hex");
    // Compara el hash generado con el hash almacenado
    return hashEvaluar == hash;
}

// Función para verificar si un usuario está autorizado
export async function usuarioAutorizado(token, req) {
    // Si no hay token, devuelve un mensaje de error
    if (!token) return mensaje(400, "Usuario no autorizado");

    // Verifica la validez del token usando la clave secreta
    jwt.verify(token, process.env.SECRET_TOKEN, (error, usuario) => {
        if (error) {
            return mensaje(400, "Usuario no autorizado - token no válido")
        }
        // Si el token es válido, asigna el usuario al request
        req.usuario = usuario;
    });
}

// Función para verificar si un usuario es administrador
export async function adminAutorizado(req) {
    // Verifica si el usuario tiene un token válido
    const respuesta = await usuarioAutorizado(req.cookies.token, req);
    if (respuesta.status !== 200) {
        return mensaje(400, "1 Admin no autorizado");
    }
    // Busca al usuario en la base de datos por su ID
    const esAdmin = await showId(req.usuario.id);
    // Verifica si el usuario tiene el rol de administrador
    if (!esAdmin.tipoUsuario) {
        return mensaje(400, "2 Admin no autorizado");
    }
// Si todo es correcto, devuelve un mensaje de autorización
    return mensaje(200, "3 Admin autorizado");
}
