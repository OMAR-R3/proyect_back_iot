import User from "../models/usuarioModelo.js";
import Ubication from "../models/ubicacionesModelo.js";
import { mensaje } from "../libs/mensajes.js";
import { crearToken } from "../libs/jwt.js";
import { encriptarPassword, validarPassword } from "../middlewares/funcionesPassword.js";



export const register = async ({ username,sonName, email, password }) => {
    try {
        const usuarioDuplicado = await User.findOne({ username });
        const emailDuplicado = await User.findOne({ email });
        if (usuarioDuplicado || emailDuplicado) { return mensaje(400, "usuario existente") };
        const { salt, hash } = encriptarPassword(password);
        const dataUser = new User({ username, sonName,email, password: hash, salt });
        const respuestaMongo = await dataUser.save();

        const token = await crearToken({
            id: respuestaMongo._id,
            username: respuestaMongo.username,
            sonName: respuestaMongo.sonName,
            tipoUsuario: respuestaMongo.tipoUsuario,
            email: respuestaMongo.email
        });

        //console.log("usuario guardado correctamente");
        return mensaje(200, respuestaMongo.tipoUsuario, "", "", token);

    } catch (error) {
        return mensaje(400, "error usuario no registrado", error);

    }
}

export const crearUsuario = async ({ username, email, password }) => {
    try {
        const usuarioDuplicado = await User.findOne({ username });
        const emailDuplicado = await User.findOne({ email });
        if (usuarioDuplicado || emailDuplicado) { return mensaje(400, "usuario existente") };
        const { salt, hash } = encriptarPassword(password);
        const dataUser = new User({ username, sonName,email, password: hash, salt });
        const respuestaMongo = await dataUser.save();

        const token = await crearToken({id: respuestaMongo._id});

        //console.log("usuario guardado correctamente");
        return mensaje(200, "usuario creado por admin", "", "", token);

    } catch (error) {
        return mensaje(400, "error usuario no registrado", error);

    }
}

export const login = async ({ username, password }) => {
    try {
        const usuarioEncontrado = await User.findOne({ username });

        if (!usuarioEncontrado) { return mensaje(400, "usuario no encontrado") }

        const passwordValido = validarPassword(password, usuarioEncontrado.salt, usuarioEncontrado.password);
        if (!passwordValido) { return mensaje(400, "password incorrecto") }

        const token = await crearToken({
            id: respuestaMongo._id,
            username: respuestaMongo.username,
            sonName: respuestaMongo.sonName,
            tipoUsuario: respuestaMongo.tipoUsuario,
            email: respuestaMongo.email
        });
        //const token = await crearToken({ id: usuarioEncontrado._id });

        //console.log(mensaje(200, usuarioEncontrado.tipoUsuario, "", "", token));

        return mensaje(200, usuarioEncontrado.tipoUsuario, "", "", token);

        
    } catch (error) {
        return mensaje(400, "error al logearse", error);
    }
}

export const show = async () => {
    try {
        const usuarios = await User.find().lean();
        if (!usuarios.length) { return mensaje(400, "no se encontraron usuarios") }
        return mensaje(200, "usuarios encontrados", usuarios)
    } catch (error) {
        return mensaje(400, "error al traer los registros", error);
    }
}

export const showId = async (_id) => {

    try {
        const usuarioEncontrado = await User.findOne({ _id });
        //console.log(usuarioEncontrado);

        if (!usuarioEncontrado) { return mensaje(400, "usuario no encontrado") }

        return mensaje(200, "usuario encontrado", usuarioEncontrado);
    } catch (error) {
        return mensaje(400, "error al buscar usuario", error);
    }
}

export const deleteId = async (_id) => {
    //console.log(_id);
    try {
        const usuarioEncontrado = await User.findOne({ _id });
        if (!usuarioEncontrado) { return mensaje(400, "usuario no encontrado") }

        const usuarioEliminado = await User.findByIdAndDelete({ _id });
        if (!usuarioEliminado) { return mensaje(400, "usuario no eliminado") }
        return mensaje(200, `Usuario ${usuarioEncontrado.username} eliminado correctamente`);
    } catch (error) {
        return mensaje(400, "error al buscar usuario", error);
    }
}

export const updateId = async ({ _id, sonName, email, password, tipoUsuario }) => {
    try {
        const usuarioEncontrado = await User.findOne({ _id });
        if (!usuarioEncontrado) {
            return mensaje(400, "Usuario no encontrado");
        }
        if (usuarioEncontrado.username !== username) {
            const usuarioDuplicado = await User.findOne({ username });
            if (usuarioDuplicado) { return mensaje(400, "nombre de usuario existente") };
        };
        if (usuarioEncontrado.email !== email) {
            const emailDuplicado = await User.findOne({ email });
            if (emailDuplicado) { return mensaje(400, "email de usuario existente") };
        };

        const { salt, hash } = encriptarPassword(password);
        const dataUser = { sonName, email, password: hash, tipoUsuario, salt };

        const usuarioActualizado = await User.findByIdAndUpdate(_id, dataUser, { new: true });//{ new: true } para que MongoDB devuelva el documento actualizado, no el original.

        if (!usuarioActualizado) { return mensaje(400, "usuario no actualizado") }

        return mensaje(200, "Usuario actualizado correctamente");
    } catch (error) {
        console.log("Error al intentar actualizar datos:", error);
        return mensaje(400, "error al intentar actualizar datos", error);
    }
}

/*export const isAdmin = async (id)=>{
    try {
        const usuario = await User.findById(id);
        if(usuario.tipoUsuario!="admin"){
            return false;
        }
        else{
            return true;
        }
    } catch (error) {
        return mensaje(400,"4 Admin no autorizado",error);
    }
}*/

export const isAdmin = async (id) => {
    try {
        const usuario = await User.findById(id);
        return usuario?.tipoUsuario === "admin";  // Devuelve directamente `true` o `false`
    } catch (error) {
        console.error("Error al verificar si el usuario es admin:", error);
        return false;
    }
};



//ubicaciones


export const ubicationRegister = async ({idDispositivo, idUsuario, /*dateTime,*/ longitud,latitud}) => {
    try {
        const usuarioEncontrado = await User.findOne({ idUsuario });
        const dispositivoEncontrado = await User.findOne({ idDispositivo });//hacer funcion de buscar dispositivo

        if (usuarioEncontrado || dispositivoEncontrado) { return mensaje(400, "no es posible el registro usuario o dispositivo inexistentes") };

        const dataDispo = new Ubication({ idUsuario, idDispositivo,/* dateTime,*/ longitud,latitud});

        const respuestaMongo = await dataDispo.save();

        //console.log("usuario guardado correctamente");
        return mensaje(200, "datos de ubicacion guardados", "", "", "");

    } catch (error) {
        return mensaje(400, "error usuario no registrado", error);

    }
}


export const showUbication = async () => {
    try {
        const ubicaciones = await User.find().lean();
        if (!usuarios.length) { return mensaje(400, "no se encontraron usuarios") }
        return mensaje(200, "usuarios encontrados", usuarios)
    } catch (error) {
        return mensaje(400, "error al traer los registros", error);
    }
}

export const showUbicationId = async (_id) => {

    try {
        const usuarioEncontrado = await User.findOne({ _id });

        if (!usuarioEncontrado) { return mensaje(400, "usuario no encontrado") }

        return mensaje(200, "usuario encontrado", usuarioEncontrado);
    } catch (error) {
        return mensaje(400, "error al buscar usuario", error);
    }
}

export const deleteUbicationId = async (_id) => {
    //console.log(_id);
    try {
        const usuarioEncontrado = await User.findOne({ _id });
        if (!usuarioEncontrado) { return mensaje(400, "usuario no encontrado") }            //verificar si es necesario
        const usuarioEliminado = await User.findByIdAndDelete({ _id }); 
        if (!usuarioEliminado) { return mensaje(400, "usuario no eliminado") }
        return mensaje(200, `Usuario ${usuarioEncontrado.username} eliminado correctamente`);
    }
    catch (error) {
        return mensaje(400, "error al buscar usuario", error);
    }
}