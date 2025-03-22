import QRCode from "qrcode";
import nodemailer from "nodemailer";
import { mensaje } from "../libs/mensajes.js";
import User from "../models/usuarioModelo.js";
import { desencriptarPassword } from "../middlewares/funcionesPassword.js";
//Funcion que envia un correo electronico al usuario con un qr con los datos de su cuenta al darla de alta como administrador
export const enviarCorreoRegistro = async (email, username, password) => {
    //Se configura el transporte de correo utilizando gmail como el servicio
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ka1z3n65@gmail.com",
            pass: "dsewwbkgjkckefuo"
        }
    });
    //Generacion de codigo QR con los datos de acceso
    const datos = JSON.stringify({ email, password });
    const qrCode = await QRCode.toDataURL(datos);
    const imgBuffer = Buffer.from(qrCode.split(",")[1], 'base64');
    //se configuran los dellates del correo
    const mailOptions = {
        from: "ka1z3n65@gmail.com",//remitente
        to: email,//destinatario
        subject: "Registro exitoso",//asunto
        html: `
            <p>Hola ${username},</p>
            <p>Tu cuenta ha sido creada con éxito.</p>
            <p><strong>Usuario:</strong> ${username}</p>
            <p><strong>Contraseña:</strong> ${password}</p>
            <p>También puedes escanear el siguiente código QR para acceder rápidamente a tu cuenta:</p>
            <img src="cid:qrcode" alt="Código QR" style="width: 150px; height: 150px;" />
            <p>Saludos,<br>Equipo de SNAPI</p>
        `,//cuerpo del correo utilizando html como formato
        attachments: [
            {
                filename: 'qrcode.png',//archivo adjunto
                content: imgBuffer,//contenido del archivo adjunto
                cid: 'qrcode'//identificador para referenciar la imagen
            }
        ]
    };
    try {
        //envio de correo con los datos y el qr
        await transporter.sendMail(mailOptions);
    } catch (error) {
        //manejo de errores durante la ejecucion
        console.log("Error al enviar el correo:", error);
    }
};
//Funcion que envia un correo electronico al usuario con un qr con los datos nuevos de su cuenta
export const enviarCorreoUpdate = async (email, sonName, password) => {
    //Se configura el transporte de correo utilizando gmail como el servicio
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ka1z3n65@gmail.com",
            pass: "dsewwbkgjkckefuo"
        }
    });
    //Generacion de codigo QR con los datos de acceso
    const datos = JSON.stringify({ email, password });
    const qrCode = await QRCode.toDataURL(datos);
    const imgBuffer = Buffer.from(qrCode.split(",")[1], 'base64');
    //se configuran los dellates del correo
    const mailOptions = {
        from: "ka1z3n65@gmail.com",//remitente
        to: email,//destinatario
        subject: "Actualización exitosa",//asunto
        html: `
            <p>Hola,</p>
            <p>Su cuenta ha sido actualizada con éxito.</p>
            <p><strong>Nombre de su hij@:</strong> ${sonName}</p>
            <p><strong>Su nueva es contraseña:</strong> ${password}</p>
            <p>Su nuevo QR es:</p>
            <img src="cid:qrcode" alt="Código QR" style="width: 150px; height: 150px;" />
            <p>Saludos,<br>Equipo de SNAPI</p>`,//cuerpo del correo utilizando html como formato
        attachments: [
            {
                filename: 'qrcode.png',//archivo adjunto
                content: imgBuffer,//contenido del archivo adjunto
                cid: 'qrcode'//identificador para referenciar la imagen
            }
        ]
    };

    try {
        //envio de correo con los datos y el qr
        await transporter.sendMail(mailOptions);
    } catch (error) {
        //manejo de errores durante la ejecucion
        console.log("Error al enviar el correo:", error);
    }
};
//Funcion que envia un correo electronico al usuario cuando se ha eliminado
export const enviarCorreoDelete = async (email) => {
    //Se configura el transporte de correo utilizando gmail como el servicio
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ka1z3n65@gmail.com",
            pass: "dsewwbkgjkckefuo"
        }
    });

    const mailOptions = {
        from: "ka1z3n65@gmail.com",//remitente
        to: email,//destinatario
        subject: "Aviso de eliminación",//asunto
        //cuerpo del correo utilizando html como formato
        html: `
            <p>Hola que tal,</p>
            <p>Su cuenta ha sido eliminada con exito.</p>
            <p><strong>Si cree que fue un error favor de comunicarse con nosotros.</p>
            <p><strong>Correo para aclaración de dudas: ka1z3n65@gmail.com</p>
            <p>Saludos,<br>Equipo de SNAPI</p>
        `
    };
    try {
        //Envio de correo
        await transporter.sendMail(mailOptions);
    } catch (error) {
        //manejo de errores durante la ejecucion
        console.log("Error al enviar el correo:", error);
    }
};

//administradores
//Funcion que envia un correo electronico al administrador con los datos de su cuenta al darla de alta
export const enviarCorreoRegistroAdmin = async (email, username, password) => {
    //Se configura el transporte de correo utilizando gmail como el servicio
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ka1z3n65@gmail.com",
            pass: "dsewwbkgjkckefuo"
        }
    });
    //se configuran los dellates del correo
    const mailOptions = {
        from: "ka1z3n65@gmail.com",//remitente
        to: email,//destinatario
        subject: "Registro exitoso",//asunto
        //cuerpo del correo utilizando html como formato
        html: `
            <p>Hola administrador ${username},</p>
            <p>Tu cuenta ha sido creada con éxito.</p>
            <p><strong>Usuario:</strong> ${username}</p>
            <p><strong>Contraseña:</strong> ${password}</p>
            <p>Saludos,<br>Equipo de SNAPI</p>
        `
    };
    try {
        //envio de correo del administrador
        await transporter.sendMail(mailOptions);
    } catch (error) {
        //manejo de errores durante la ejecucion
        console.log("Error al enviar el correo:", error);
    }
};
//Funcion que envia un correo electronico al adminstrador con los datos nuevos de su cuenta
export const enviarCorreoUpdateAdmin = async (email, password) => {
    //Se configura el transporte de correo utilizando gmail como el servicio
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ka1z3n65@gmail.com",
            pass: "dsewwbkgjkckefuo"
        }
    });
    //se configuran los dellates del correo
    const mailOptions = {
        from: "ka1z3n65@gmail.com",//remitente
        to: email,//destinatario
        subject: "Actualización exitosa",//asunto
        //cuerpo del correo utilizando html como formato
        html: `
            <p>Hola,</p>
            <p>Su cuenta ha sido actualizada con éxito.</p>
            <p><strong>Su nueva es contraseña:</strong> ${password}</p>
            <p>Saludos,<br>Equipo de SNAPI</p>
        `,
    };
    try {
        //envio de correo al administrador
        await transporter.sendMail(mailOptions);
    } catch (error) {
        //manejo de errores durante la ejecucion
        console.log("Error al enviar el correo:", error);
    }
};

export const generarQrConId = async (id) => {
    try {
        // Buscar al usuario por ID
        const usuarioEncontradoPorId = await User.findById(id);

        // Verificar si el usuario fue encontrado
        if (!usuarioEncontradoPorId) {
            return mensaje(400, "Error al encontrar al usuario");
        }

        // Si la contraseña está encriptada, desencriptarla (si es necesario)
        const passwordDesencriptada = desencriptarPassword(usuarioEncontradoPorId.password, usuarioEncontradoPorId.iv, usuarioEncontradoPorId.key);

        // Formatear los datos del usuario en un objeto JSON
        const usuariosFormateados = {
            email: usuarioEncontradoPorId.email,
            password: passwordDesencriptada  // Asegúrate de que la contraseña esté en texto plano
        };

        // Retornar el objeto JSON stringificado para usarlo en el QR
        return mensaje(200, "Usuario encontrado", "", "", JSON.stringify(usuariosFormateados));

    } catch (error) {
        return mensaje(400, "Búsqueda no realizada", error);
    }
};


export const enviarQRAD = async (id) => {

    //Se configura el transporte de correo utilizando gmail como el servicio
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ka1z3n65@gmail.com",
            pass: "dsewwbkgjkckefuo"
        }
    });
    //Generacion de codigo QR con los datos de acceso
    // Buscar al usuario por ID
    const usuarioEncontradoPorId = await User.findById(id);

    // Verificar si el usuario fue encontrado
    if (!usuarioEncontradoPorId) {
        return mensaje(400, "Error al encontrar al usuario");
    }

    // Si la contraseña está encriptada, desencriptarla (si es necesario)
    const passwordDesencriptada = desencriptarPassword(usuarioEncontradoPorId.password, usuarioEncontradoPorId.iv, usuarioEncontradoPorId.key);

    // Formatear los datos del usuario en un objeto JSON
    const usuariosFormateados = {
        email: usuarioEncontradoPorId.email,
        password: passwordDesencriptada  // Asegúrate de que la contraseña esté en texto plano
    };
    const qrCode = await QRCode.toDataURL(usuariosFormateados);
    const imgBuffer = Buffer.from(qrCode.split(",")[1], 'base64');

    //se configuran los dellates del correo
    const mailOptions = {
        from: "ka1z3n65@gmail.com",//remitente
        to: email,//destinatario
        subject: "Registro exitoso",//asunto
        html: `
            <p>Hola ${usuarioEncontradoPorId.username},</p>
            <p>Tus datos de acceso son:</p>
            <p><strong>Usuario:</strong> ${usuarioEncontradoPorId.username}</p>
            <p><strong>Contraseña:</strong> ${usuarioEncontradoPorId.password}</p>
            <p>Su QR:</p>
            <img src="cid:qrcode" alt="Código QR" style="width: 150px; height: 150px;" />
            <p>Saludos,<br>Equipo de SNAPI</p>
        `,//cuerpo del correo utilizando html como formato
        attachments: [
            {
                filename: 'qrcode.png',//archivo adjunto
                content: imgBuffer,//contenido del archivo adjunto
                cid: 'qrcode'//identificador para referenciar la imagen
            }
        ]
    };
    try {
        //envio de correo con los datos y el qr
        await transporter.sendMail(mailOptions);
    } catch (error) {
        //manejo de errores durante la ejecucion
        console.log("Error al enviar el correo:", error);
    }
};