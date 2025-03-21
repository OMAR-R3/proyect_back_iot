import crypto from "crypto";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { mensaje } from "../libs/mensajes.js";
import { showId } from "../db/usuariosDB.js";

// 🔒 Algoritmo y clave para AES
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // Clave de 32 bytes para AES-256
const iv = crypto.randomBytes(16); // Vector de inicialización (IV)

// 👉 Encriptar contraseña
export function encriptarPassword(password) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        encrypted, // Contraseña encriptada
        iv: iv.toString('hex'),
        key: key.toString('hex')
    };
}

// ✅ Validar contraseña
export function validarPassword(password, encrypted, iv, key) {
    try {
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted === password;
    } catch (error) {
        console.error("Error al validar la contraseña:", error);
        return false;
    }
}

// 🔓 Desencriptar contraseña
export function desencriptarPassword(encrypted, iv, key) {
    try {
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error("Error al desencriptar la contraseña:", error);
        return null;
    }
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
