import crypto from "crypto";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { mensaje } from "../libs/mensajes.js";
import { showId } from "../db/usuariosDB.js";
import exp from "constants";

export function encriptarPassword(password) {
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = crypto.scryptSync(password, salt, 10, 64, "sha512").toString("hex");
    return {
        salt,
        hash
    }
}

export function validarPassword(password, salt, hash) {
    const hashEvaluar = crypto.scryptSync(password, salt, 10, 64, "sha512").toString("hex");
    return hashEvaluar == hash;
}

export async function usuarioAutorizado(token, req) {
    if (!token) return mensaje(400, "Usuario no autorizado");

    jwt.verify(token, process.env.SECRET_TOKEN, (error, usuario) => {
        if (error) {
            return mensaje(400, "Usuario no autorizado - token no válido")
        }
        req.usuario = usuario;
    });
}




export async function adminAutorizado(req) {
    const respuesta = await usuarioAutorizado(req.cookies.token, req);
    if (respuesta.status !== 200) {
        return mensaje(400, "1 Admin no autorizado");
    }
    const esAdmin = await showId(req.usuario.id);
    if (!esAdmin.tipoUsuario) {
        return mensaje(400, "2 Admin no autorizado");
    }

    return mensaje(200, "3 Admin autorizado");
}
