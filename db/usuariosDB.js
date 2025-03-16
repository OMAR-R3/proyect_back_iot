import User from "../models/usuarioModelo.js"
import Ubication from "../models/ubicacionesModelo.js"
import Admin from "../models/administradorModelo.js"
import { mensaje } from "../libs/mensajes.js";
import { crearToken } from "../libs/jwt.js";
import nodemailer from "nodemailer";
import { encriptarPassword, validarPassword } from "../middlewares/funcionesPassword.js";
import QRCode from "qrcode";

export const register = async ({ username, sonName, email, password }) => {
    try {
        const usuarioDuplicado = await User.findOne({ username });
        const emailDuplicado = await User.findOne({ email });
        if (usuarioDuplicado || emailDuplicado) { return mensaje(400, "usuario existente") };

        // se guarda entes de encriptar
        const passwordOriginal = password;

        const { salt, hash } = encriptarPassword(password);
        const dataUser = new User({ username, sonName, email, password: hash, salt });
        const respuestaMongo = await dataUser.save();

        const token = await crearToken({
            id: respuestaMongo._id,
            username: respuestaMongo.username,
            sonName: respuestaMongo.sonName,
            email: respuestaMongo.email
        });

        //enviar correo
        await enviarCorreoRegistro(email, username, passwordOriginal);

        return mensaje(200, "Usuario registrado con exito", "", "", token);

    } catch (error) {
        return mensaje(400, "error usuario no registrado", error);
    }
};

const enviarCorreoRegistro = async (email, username, password) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ka1z3n65@gmail.com",
            pass: "dsewwbkgjkckefuo"
        }
    });

    const datos = JSON.stringify({ email, password });
    const qrCode = await QRCode.toDataURL(datos);
    const imgBuffer = Buffer.from(qrCode.split(",")[1], 'base64');

    const mailOptions = {
        from: "ka1z3n65@gmail.com",
        to: email,
        subject: "Registro exitoso",
        html: `
            <p>Hola ${username},</p>
            <p>Tu cuenta ha sido creada con éxito.</p>
            <p><strong>Usuario:</strong> ${username}</p>
            <p><strong>Contraseña:</strong> ${password}</p>
            <p>También puedes escanear el siguiente código QR para acceder rápidamente a tu cuenta:</p>
            <img src="cid:qrcode" alt="Código QR" style="width: 150px; height: 150px;" />
            <p>Saludos,<br>Equipo de SNAPI</p>
        `,
        attachments: [
            {
                filename: 'qrcode.png',
                content: imgBuffer,
                cid: 'qrcode'
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Error al enviar el correo:", error);
    }
};



/*export const crearUsuario = async ({ username, email, password }) => {
    try {
        const usuarioDuplicado = await User.findOne({ username });
        const emailDuplicado = await User.findOne({ email });
        if (usuarioDuplicado || emailDuplicado) { return mensaje(400, "usuario existente") };
        const { salt, hash } = encriptarPassword(password);
        const dataUser = new User({ username, sonName, email, password: hash, salt });
        const respuestaMongo = await dataUser.save();

        const token = await crearToken({ id: respuestaMongo._id });
        return mensaje(200, "usuario creado por admin", "", "", token);

    } catch (error) {
        return mensaje(400, "error usuario no registrado", error);

    }
}*/

export const login = async ({ email, password }) => {
    try {
        const usuarioEncontrado = await User.findOne({ email });
        if (!usuarioEncontrado) { return mensaje(400, "usuario no encontrado") }
        const passwordValido = validarPassword(password, usuarioEncontrado.salt, usuarioEncontrado.password);
        if (!passwordValido) { return mensaje(400, "password incorrecto") }
        const token = await crearToken({
            id: usuarioEncontrado._id,
            username: usuarioEncontrado.username,
            sonName: usuarioEncontrado.sonName,
            email: usuarioEncontrado.email
        });
        return mensaje(200, "Logueado con exito", "", "", token);
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
        if (!usuarioEncontrado) { return mensaje(400, "usuario no encontrado") }

        return mensaje(200, "usuario encontrado", usuarioEncontrado);
    } catch (error) {
        return mensaje(400, "error al buscar usuario", error);
    }
}

export const deleteId = async (_id) => {
    try {

        const usuarioEncontrado = await User.findOne({ _id });
        if (!usuarioEncontrado) { return mensaje(400, "usuario no encontrado") }

        const usuarioEliminado = await User.findByIdAndDelete({ _id });
        if (!usuarioEliminado) { return mensaje(400, "usuario no eliminado") }

        await enviarCorreoDelete(usuarioEncontrado.email);
        console.log("1");
        
        return mensaje(200, `Usuario ${usuarioEncontrado.username} eliminado correctamente`);
    } catch (error) {
        return mensaje(400, "error al buscar usuario", error);
    }
}

export const updateId = async ({ _id, sonName, email, password}) => {
    try {
        const usuarioEncontrado = await User.findOne({ _id });
        if (!usuarioEncontrado) {
            return mensaje(400, "Usuario no encontrado");
        }
        if (usuarioEncontrado.email !== email) {
            const emailDuplicado = await User.findOne({ email });
            if (emailDuplicado) { return mensaje(400, "email de usuario existente") };
        };

        const passwordOriginal = password;

        await enviarCorreoUpdate(email, sonName, passwordOriginal);

        const { salt, hash } = encriptarPassword(password);
        const dataUser = { sonName, email, password: hash, salt };

        const usuarioActualizado = await User.findByIdAndUpdate(_id, dataUser, { new: true });//{ new: true } para que MongoDB devuelva el documento actualizado, no el original.

        if (!usuarioActualizado) { return mensaje(400, "usuario no actualizado") }



        return mensaje(200, "Usuario actualizado correctamente");
    } catch (error) {
        console.log("Error al intentar actualizar datos:", error);
        return mensaje(400, "error al intentar actualizar datos", error);
    }
}

const enviarCorreoUpdate= async (email, sonName, password) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ka1z3n65@gmail.com",
            pass: "dsewwbkgjkckefuo"
        }
    });

    const datos = JSON.stringify({ email, password });
    const qrCode = await QRCode.toDataURL(datos);
    const imgBuffer = Buffer.from(qrCode.split(",")[1], 'base64');

    const mailOptions = {
        from: "ka1z3n65@gmail.com",
        to: email,
        subject: "Actualización exitosa",
        html: `
            <p>Hola,</p>
            <p>Su cuenta ha sido actualizada con éxito.</p>
            <p><strong>Nombre de su hij@:</strong> ${sonName}</p>
            <p><strong>Su nueva es contraseña:</strong> ${password}</p>
            <p>Su nuevo QR es:</p>
            <img src="cid:qrcode" alt="Código QR" style="width: 150px; height: 150px;" />
            <p>Saludos,<br>Equipo de SNAPI</p>
        `,
        attachments: [
            {
                filename: 'qrcode.png',
                content: imgBuffer,
                cid: 'qrcode'
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Error al enviar el correo:", error);
    }
};


const enviarCorreoDelete= async (email) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ka1z3n65@gmail.com",
            pass: "dsewwbkgjkckefuo"
        }
    });
    const mailOptions = {
        from: "ka1z3n65@gmail.com",
        to: email,
        subject: "Aviso de eliminacion",
        html: `
            <p>Hola que tal,</p>
            <p>Su cuenta ha sido eliminada con exito.</p>
            <p><strong>Si cree que fue un error favor de comunicarse con nosotros.</p>
            <p><strong>Correo para aclaración de dudas: ka1z3n65@gmail.com</p>
            <p>Saludos,<br>Equipo de SNAPI</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Error al enviar el correo:", error);
    }
};


/*export const isAdmin = async (id) => {
    try {
        const usuario = await User.findById(id);
        return usuario?.tipoUsuario === "admin";  // Devuelve directamente `true` o `false`
    } catch (error) {
        console.error("Error al verificar si el usuario es admin:", error);
        return false;
    }
};*/



//ubicaciones

export const ubicationRegister = async ({ idDispositivo, idUsuario, /*dateTime,*/ longitud, latitud }) => {
    try {
        const usuarioEncontrado = await Ubication.findOne({ idUsuario });
        const dispositivoEncontrado = await Ubication.findOne({ idDispositivo });//hacer funcion de buscar dispositivo

        if (usuarioEncontrado || dispositivoEncontrado) { return mensaje(400, "no es posible el registro usuario o dispositivo inexistentes") };

        const dataDispo = new Ubication({ idUsuario, idDispositivo,/* dateTime,*/ longitud, latitud });

        const respuestaMongo = await dataDispo.save();

        return mensaje(200, "datos de ubicacion guardados", "", "", "");

    } catch (error) {
        return mensaje(400, "error ubicacion no registrado", error);

    }
}

export const showUbication = async () => {
    try {
        const ubicaciones = await Ubication.find().lean();
        if (!ubicaciones.length) { return mensaje(400, "no se encontraron usuarios") }
        return mensaje(200, "ubicaciones encontradas", ubicaciones)
    } catch (error) {
        return mensaje(400, "error al traer los registros", error);
    }
}

export const showUbicationId = async (_id) => {

    try {
        const ubicacionEncontrada = await Ubication.findOne({ _id });
        if (!ubicacionEncontrada) { return mensaje(400, "ubicacion no encontrada") }
        return mensaje(200, "ubicacion encontrada", ubicacionEncontrada);
    } catch (error) {
        return mensaje(400, "error al buscar ubicacion", error);
    }
}

//Administradores

export const registerAdmin = async ({ username, email, password }) => {
    try {
        const usuarioDuplicado = await Admin.findOne({ username });
        const emailDuplicado = await Admin.findOne({ email });
        if (usuarioDuplicado || emailDuplicado) { return mensaje(400, "admin existente") };

        // se guarda entes de encriptar
        const passwordOriginal = password;

        const { salt, hash } = encriptarPassword(password);
        const dataAdmin = new Admin({ username, email, password: hash, salt });
        const respuestaMongo = await dataAdmin.save();

        const token = await crearToken({
            id: respuestaMongo._id,
            username: respuestaMongo.username,
            tipoUsuario: respuestaMongo.tipoUsuario,
            email: respuestaMongo.email
        });

        //enviar correo
        await enviarCorreoRegistroAdmin(email, username, passwordOriginal);

        return mensaje(200, "Administrador registrado con exito", "", "", token);

    } catch (error) {
        return mensaje(400, "error administrador no registrado", error);
    }
};

const enviarCorreoRegistroAdmin = async (email, username, password) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ka1z3n65@gmail.com",
            pass: "dsewwbkgjkckefuo"
        }
    });

    const datos = JSON.stringify({ email, password });
    const qrCode = await QRCode.toDataURL(datos);
    const imgBuffer = Buffer.from(qrCode.split(",")[1], 'base64');

    const mailOptions = {
        from: "ka1z3n65@gmail.com",
        to: email,
        subject: "Registro exitoso",
        html: `
            <p>Hola administrador ${username},</p>
            <p>Tu cuenta ha sido creada con éxito.</p>
            <p><strong>Usuario:</strong> ${username}</p>
            <p><strong>Contraseña:</strong> ${password}</p>
            <p>También puedes escanear el siguiente código QR para acceder rápidamente a tu cuenta:</p>
            <img src="cid:qrcode" alt="Código QR" style="width: 150px; height: 150px;" />
            <p>Saludos,<br>Equipo de SNAPI</p>
        `,
        attachments: [
            {
                filename: 'qrcode.png',
                content: imgBuffer,
                cid: 'qrcode'
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Error al enviar el correo:", error);
    }
};

export const loginAdmin = async ({ email, password }) => {
    try {
        const adminEncontrado = await Admin.findOne({ email });
        if (!adminEncontrado) { return mensaje(400, "admin no encontrado") }
        const passwordValido = validarPassword(password, adminEncontrado.salt, adminEncontrado.password);
        if (!passwordValido) { return mensaje(400, "password incorrecto") }
        const token = await crearToken({
            id: adminEncontrado._id,
            username: adminEncontrado.username,
            tipoUsuario: adminEncontrado.tipoUsuario,
            email: adminEncontrado.email
        });
        return mensaje(200, adminEncontrado.tipoUsuario, "", "", token);
    } catch (error) {
        return mensaje(400, "error al logearse", error);
    }
}

export const showAdmins = async () => {
    try {
        const admins = await Admin.find().lean();
        if (!admins.length) { return mensaje(400, "no se encontraron administradores") }
        return mensaje(200, "administradores encontrados", usuarios)
    } catch (error) {
        return mensaje(400, "error al traer los registros", error);
    }
}

export const showIdAdmin = async (_id) => {

    try {
        const adminEncontrado = await Admin.findOne({ _id });
        if (!adminEncontrado) { return mensaje(400, "admin no encontrado") }

        return mensaje(200, "admin encontrado", usuarioEncontrado);
    } catch (error) {
        return mensaje(400, "error al buscar admin", error);
    }
}

export const deleteIdAdmin = async (_id) => {
    try {
        const adminEncontrado = await Admin.findOne({ _id });
        if (!adminEncontrado) { return mensaje(400, "admin no encontrado") }

        const adminEliminado = await Admin.findByIdAndDelete({ _id });
        if (!adminEliminado) { return mensaje(400, "admin no eliminado") }
        return mensaje(200, `Administrador ${adminEncontrado.username} eliminado correctamente`);
    } catch (error) {
        return mensaje(400, "error al buscar administrador", error);
    }
}

export const updateIdAdmin = async ({ _id, email, password}) => {
    try {
        const adminEncontrado = await Admin.findOne({ _id });
        if (!adminEncontrado) {
            return mensaje(400, "Administrador no encontrado");
        }
        if (adminEncontrado.username !== username) {
            const adminDuplicado = await Admin.findOne({ username });
            if (adminDuplicado) { return mensaje(400, "nombre de administrador existente") };
        };
        if (adminEncontrado.email !== email) {
            const emailDuplicado = await Admin.findOne({ email });
            if (emailDuplicado) { return mensaje(400, "email de administrador existente") };
        };

        const { salt, hash } = encriptarPassword(password);
        const dataAdmin = { email, password: hash, salt };

        const adminActualizado = await Admin.findByIdAndUpdate(_id, dataAdmin, { new: true });//{ new: true } para que MongoDB devuelva el documento actualizado, no el original.

        if (!adminActualizado) { return mensaje(400, "Administrador no actualizado") }

        return mensaje(200, "Administrador actualizado correctamente");
    } catch (error) {
        console.log("Error al intentar actualizar datos:", error);
        return mensaje(400, "error al intentar actualizar datos", error);
    }
}