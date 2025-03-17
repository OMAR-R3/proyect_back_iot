//importaciones necesarias para el uso de las funciones
import User from "../models/usuarioModelo.js"
import { mensaje } from "../libs/mensajes.js";
import { crearToken } from "../libs/jwt.js";
import { encriptarPassword, validarPassword } from "../middlewares/funcionesPassword.js";
import { enviarCorreoRegistro, enviarCorreoUpdate, enviarCorreoDelete } from "./correos.js";

//funcion para registrar usuario(padre de familia), por parte del administrador
export const register = async ({ username, sonName, email, password }) => {
    try {
        //busqueda para verificar que no exista el usuario
        const usuarioDuplicado = await User.findOne({ username });
        //busqueda para verificar que no exista el email
        const emailDuplicado = await User.findOne({ email });
        //validacion de usuario para retornar si existe o no el usuario
        if (usuarioDuplicado || emailDuplicado) { return mensaje(400, "usuario existente") };
        // se guarda password entes de encriptar para pasarlo al correo
        const passwordOriginal = password;
        //encriptacion de password
        const { salt, hash } = encriptarPassword(password);
        const dataUser = new User({ username, sonName, email, password: hash, salt });
        //resgistro de usuario en mongo
        const respuestaMongo = await dataUser.save();
        //Se crea el token para devolverlo con la informacion del usuario
        const token = await crearToken({
            id: respuestaMongo._id,
            username: respuestaMongo.username,
            sonName: respuestaMongo.sonName,
            email: respuestaMongo.email
        });
        //enviar correo
        await enviarCorreoRegistro(email, username, passwordOriginal);
        //retorna mensaje de exito con el token
        return mensaje(200, "Usuario registrado con exito", "", "", token);
    } catch (error) {
        //Manejo de errores
        return mensaje(400, "error usuario no registrado", error);
    }
};

//funcion de validacion de inicio de sesion del usuario dentro de la aplicacion movil
export const login = async ({ email, password }) => {
    try {
        //busqueda del usuario mediante el email
        const usuarioEncontrado = await User.findOne({ email });
        //validacion de si se encontro el usuario si no se retorna un error
        if (!usuarioEncontrado) { return mensaje(400, "usuario no encontrado") }
        //busqueda de password
        const passwordValido = validarPassword(password, usuarioEncontrado.salt, usuarioEncontrado.password);
        //validacion de si es correcto el password, de no serlo se regresa un error
        if (!passwordValido) { return mensaje(400, "password incorrecto") }
        //Se crea el token para devolverlo con la informacion del usuario
        const token = await crearToken({
            id: usuarioEncontrado._id,
            username: usuarioEncontrado.username,
            sonName: usuarioEncontrado.sonName,
            email: usuarioEncontrado.email
        });
        //retorna mensaje de exito con el token
        return mensaje(200, "Logueado con exito", "", "", token);
    } catch (error) {
        //manejo de errores
        return mensaje(400, "error al logearse", error);//en caso de fallo devuelve error
    }
}


//funcion para devolver todos los usuarios registrados
export const show = async () => {
    try {
        //busqueda de usuarios registrados en la base de datos de Mongo Atlas convitiendolos en objeto json
        const usuarios = await User.find().lean();
        //validacion de si se econtraron o no usuarios
        if (!usuarios.length) { return mensaje(400, "no se encontraron usuarios") }
        //retorna mensaje de exito con la lista de usuarios
        return mensaje(200, "usuarios encontrados", usuarios)
    } catch (error) {
        //manjeo de cualquier error
        return mensaje(400, "error al traer los registros", error);
    }
}

//funcion para buscar usuarios por id
export const showId = async (_id) => {
    try {
        //busqueda de usuario mediante el id proporcionado
        const usuarioEncontrado = await User.findOne({ _id });
        //validacion si se encontro el usuario
        if (!usuarioEncontrado) { return mensaje(400, "usuario no encontrado") }
        //retorna mensaje de exito con el usuario
        return mensaje(200, "usuario encontrado", usuarioEncontrado);
    } catch (error) {
        //manjeo de cualquier error
        return mensaje(400, "error al buscar usuario", error);
    }
}

//Funcion de eliminacion de usuarios mediante el id
export const deleteId = async (_id) => {
    try {
        //busqueda del usuario para verificar su existencia por id
        const usuarioEncontrado = await User.findOne({ _id });
        //validacion de el usuario econtrado
        if (!usuarioEncontrado) { return mensaje(400, "usuario no encontrado") }
        //eliminacion del usuario mediante el id
        const usuarioEliminado = await User.findByIdAndDelete({ _id });
        //verificacion de la eliminacion si fue o no correcta
        if (!usuarioEliminado) { return mensaje(400, "usuario no eliminado") }
        //envio de correo, para informar la eliminacion de la cuenta
        await enviarCorreoDelete(usuarioEncontrado.email);
        //retorna mensaje de exito de eliminacion a la consola
        return mensaje(200, `Usuario ${usuarioEncontrado.username} eliminado correctamente`);
    } catch (error) {
        //manjeo de cualquier error
        return mensaje(400, "error al buscar usuario", error);
    }
}

//Funcion de actualizacion de usuario mediante el id
export const updateId = async ({ _id, sonName, email, password }) => {
    try {
        //busqueda de usuario para validar su existencia
        const usuarioEncontrado = await User.findOne({ _id });
        //verificacion del usuario para continuar o retiornar error
        if (!usuarioEncontrado) {
            return mensaje(400, "Usuario no encontrado");
        }
        //verificacion del email, para revisar que el email no esta ya registrado en la base de datos
        if (usuarioEncontrado.email !== email) {
            const emailDuplicado = await User.findOne({ email });
            //validacion de email para continuar o retiornar error
            if (emailDuplicado) { return mensaje(400, "email de usuario existente") };
        };
        // se guarda password entes de encriptar para pasarlo al correo
        const passwordOriginal = password;
        //envio de correo para informar la actualizacion del usuario
        await enviarCorreoUpdate(email, sonName, passwordOriginal);
        //encriptacion del password nuevo
        const { salt, hash } = encriptarPassword(password);
        const dataUser = { sonName, email, password: hash, salt };
        //actualizacion del usuario en la base de datos en MongoDB
        const usuarioActualizado = await User.findByIdAndUpdate(_id, dataUser, { new: true });//{ new: true } para que MongoDB devuelva el documento actualizado, no el original.
        //validacion de actualizacion
        if (!usuarioActualizado) { return mensaje(400, "usuario no actualizado") }
        //retorna mensaje de exito de actualizacion
        return mensaje(200, "Usuario actualizado correctamente");
    } catch (error) {
        //manjeo de cualquier error
        return mensaje(400, "error al intentar actualizar datos", error);
    }
}