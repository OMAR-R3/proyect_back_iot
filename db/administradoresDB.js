import Admin from "../models/administradorModelo.js"
import { mensaje } from "../libs/mensajes.js";
import { crearToken } from "../libs/jwt.js";
import { encriptarPassword, validarPassword } from "../middlewares/funcionesPassword.js";
import { enviarCorreoDelete, enviarCorreoRegistroAdmin, enviarCorreoUpdateAdmin } from "./correos.js";
//Administradores
//funcion para registrar administrador
export const registerAdmin = async ({ username, email, password }) => {
    try {
        //busqueda para verificar que no exista el administrador
        const usuarioDuplicado = await Admin.findOne({ username });
        //busqueda para verificar que no exista el email
        const emailDuplicado = await Admin.findOne({ email });
        //validacion de usuario para retornar si existe o no el administrador
        if (usuarioDuplicado || emailDuplicado) { return mensaje(400, "admin existente") };
        // se guarda password entes de encriptar para pasarlo al correo
        const passwordOriginal = password;
        //encriptacion de password
        const { salt, hash } = encriptarPassword(password);
        const dataAdmin = new Admin({ username, email, password: hash, salt });
        //resgistro de adminstrador en mongo
        const respuestaMongo = await dataAdmin.save();
        //Se crea el token para devolverlo con la informacion del administrador
        const token = await crearToken({
            id: respuestaMongo._id,
            username: respuestaMongo.username,
            tipoUsuario: respuestaMongo.tipoUsuario,
            email: respuestaMongo.email
        });
        //enviar correo
        await enviarCorreoRegistroAdmin(email, username, passwordOriginal);
        //retorna mensaje de exito con el token
        return mensaje(200, "Administrador registrado con exito", "", "", token);
    } catch (error) {
        //manejo de errores
        return mensaje(400, "error administrador no registrado", error);
    }
};
//funcion de validacion de inicio de sesion del administrador
export const loginAdmin = async ({ email, password }) => {
    try {
        //busqueda del administrador mediante el email
        const adminEncontrado = await Admin.findOne({ email });
        //validacion de si se encontro el administrador si no se retorna un error
        if (!adminEncontrado) { return mensaje(400, "admin no encontrado") }
        //busqueda de password
        const passwordValido = validarPassword(password, adminEncontrado.salt, adminEncontrado.password);
        //validacion de si es correcto el password, de no serlo se regresa un error
        if (!passwordValido) { return mensaje(400, "password incorrecto") }
        //Se crea el token para devolverlo con la informacion del administrador
        const token = await crearToken({
            id: adminEncontrado._id,
            username: adminEncontrado.username,
            tipoUsuario: adminEncontrado.tipoUsuario,
            email: adminEncontrado.email
        });
        //retorna mensaje de exito con el token
        return mensaje(200, adminEncontrado.tipoUsuario, "", "", token);
    } catch (error) {
        //manejo de errores
        return mensaje(400, "error al logearse", error);
    }
}
//funcion para devolver todos los administradores registrados
export const showAdmins = async () => {
    try {
        //busqueda de administradores registrados en la base de datos de Mongo Atlas convitiendolos en objeto json
        const admins = await Admin.find().lean();
        //validacion de si se econtraron o no administradores
        if (!admins.length) { return mensaje(400, "no se encontraron administradores") }
        //retorna mensaje de exito con la lista de administradores
        return mensaje(200, "administradores encontrados", admins)
    } catch (error) {
        //manjeo de cualquier error
        return mensaje(400, "error al traer los registros", error);
    }
}
//funcion para buscar administradores por id
export const showIdAdmin = async (_id) => {
    try {
        //busqueda de administrador mediante el id proporcionado
        const adminEncontrado = await Admin.findOne({ _id });
        //validacion si se encontro el administrador
        if (!adminEncontrado) { return mensaje(400, "admin no encontrado") }
        //retorna mensaje de exito con el administrador
        return mensaje(200, "admin encontrado", adminEncontrado);
    } catch (error) {
        //manjeo de cualquier error
        return mensaje(400, "error al buscar admin", error);
    }
}
//Funcion de eliminacion de administradores mediante el id
export const deleteIdAdmin = async (_id) => {
    try {
        //busqueda del administrador para verificar su existencia por id
        const adminEncontrado = await Admin.findOne({ _id });
        //validacion de el administrador econtrado
        if (!adminEncontrado) { return mensaje(400, "admin no encontrado") }
        //eliminacion del administrador mediante el id
        const adminEliminado = await Admin.findByIdAndDelete({ _id });
        //verificacion de la eliminacion si fue o no correcta
        if (!adminEliminado) { return mensaje(400, "admin no eliminado") }
        //envio de correo, para informar la eliminacion de la cuenta
        await enviarCorreoDelete(adminEncontrado.email);
        //retorna mensaje de exito de eliminacion a la consola
        return mensaje(200, `Administrador ${adminEncontrado.username} eliminado correctamente`);
    } catch (error) {
        //manjeo de cualquier error
        return mensaje(400, "error al buscar administrador", error);
    }
}
//Funcion de actualizacion de adm inistrador mediante el id
export const updateIdAdmin = async ({ _id, email, password }) => {
    try {
        //busqueda de administrador para validar su existencia
        const adminEncontrado = await Admin.findOne({ _id });
        //verificacion del administrador para continuar o retiornar error
        if (!adminEncontrado) {
            return mensaje(400, "Administrador no encontrado");
        }
        //verificacion del email, para revisar que el email no esta ya registrado en la base de datos
        if (adminEncontrado.email !== email) {
            const emailDuplicado = await Admin.findOne({ email });
            //validacion de email para continuar o retiornar error
            if (emailDuplicado) { return mensaje(400, "email de administrador existente") };
        };
        // se guarda password entes de encriptar para pasarlo al correo
        const passwordOriginal = password;
        //envio de correo para informar la actualizacion del administrador
        await enviarCorreoUpdateAdmin(email, passwordOriginal);
        //encriptación del password nuevo
        const { salt, hash } = encriptarPassword(password);
        const dataAdmin = { email, password: hash, salt };
        //actualización del administrador en la base de datos en MongoDB
        const adminActualizado = await Admin.findByIdAndUpdate(_id, dataAdmin, { new: true });//{ new: true } para que MongoDB devuelva el documento actualizado, no el original.
        //validacion de actualización
        if (!adminActualizado) { return mensaje(400, "Administrador no actualizado") }
        //retorna mensaje de exito de actualización
        return mensaje(200, "Administrador actualizado correctamente");
    } catch (error) {
        //manjeo de cualquier error
        return mensaje(400, "error al intentar actualizar datos", error);
    }
}