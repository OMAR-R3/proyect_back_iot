import Admin from "../models/administradorModelo.js";
import { mensaje } from "../libs/mensajes.js";
import { crearToken } from "../libs/jwt.js";
import { encriptarPassword, validarPassword, desencriptarPassword } from "../middlewares/funcionesPassword.js";
import { enviarCorreoDelete, enviarCorreoRegistroAdmin, enviarCorreoUpdateAdmin } from "./correos.js";

// Administradores

// Función para registrar administrador
export const registerAdmin = async ({ username, email, password }) => {
    try {
        // Búsqueda para verificar que no exista el administrador
        const usuarioDuplicado = await Admin.findOne({ username });
        // Búsqueda para verificar que no exista el email
        const emailDuplicado = await Admin.findOne({ email });
        // Validación de usuario para retornar si existe o no el administrador
        if (usuarioDuplicado || emailDuplicado) { return mensaje(400, "admin existente"); }

        // Se guarda password antes de encriptar para pasarlo al correo
        const passwordOriginal = password;

        // Encriptación de password usando la función proporcionada
        const { encrypted, iv, key } = encriptarPassword(password);

        // Creación del objeto administrador
        const dataAdmin = new Admin({ username, email, password: encrypted, iv, key });

        // Registro de administrador en Mongo
        const respuestaMongo = await dataAdmin.save();

        // Se crea el token para devolverlo con la información del administrador
        const token = await crearToken({
            id: respuestaMongo._id,
            username: respuestaMongo.username,
            tipoUsuario: respuestaMongo.tipoUsuario,
            email: respuestaMongo.email
        });

        // Enviar correo de registro
        await enviarCorreoRegistroAdmin(email, username, passwordOriginal);

        // Retorna mensaje de éxito con el token
        return mensaje(200, "Administrador registrado con éxito", "", "", token);

    } catch (error) {
        // Manejo de errores
        return mensaje(400, "Error: administrador no registrado", error);
    }
};

// Función de validación de inicio de sesión del administrador
export const loginAdmin = async ({ email, password }) => {
    try {
        // Búsqueda del administrador mediante el email
        const adminEncontrado = await Admin.findOne({ email });
        // Validación de si se encontró el administrador, si no se retorna un error
        if (!adminEncontrado) { return mensaje(400, "Admin no encontrado"); }

        // Validación de password usando la función 'validarPassword'
        const passwordValido = validarPassword(password, adminEncontrado.password, adminEncontrado.iv, adminEncontrado.key);

        // Validación de si es correcto el password, de no serlo se regresa un error
        if (!passwordValido) { return mensaje(400, "Password incorrecto"); }

        // Se crea el token para devolverlo con la información del administrador
        const token = await crearToken({
            id: adminEncontrado._id,
            username: adminEncontrado.username,
            tipoUsuario: adminEncontrado.tipoUsuario,
            email: adminEncontrado.email
        });

        // Retorna mensaje de éxito con el token
        return mensaje(200, adminEncontrado.tipoUsuario, "", "", token);

    } catch (error) {
        // Manejo de errores
        return mensaje(400, "Error al logearse", error);
    }
};

// Función para devolver todos los administradores registrados
export const showAdmins = async () => {
    try {
        // Búsqueda de administradores registrados en la base de datos
        const admins = await Admin.find().lean();
        // Validación de si se encontraron o no administradores
        if (!admins.length) { return mensaje(400, "No se encontraron administradores"); }
        // Retorna mensaje de éxito con la lista de administradores
        return mensaje(200, "Administradores encontrados", admins);

    } catch (error) {
        // Manejo de errores
        return mensaje(400, "Error al traer los registros", error);
    }
};

// Función para buscar administradores por ID
export const showIdAdmin = async (_id) => {
    try {
        // Búsqueda de administrador mediante el ID proporcionado
        const adminEncontrado = await Admin.findOne({ _id });
        // Validación si se encontró el administrador
        if (!adminEncontrado) { return mensaje(400, "Admin no encontrado"); }
        // Retorna mensaje de éxito con el administrador
        return mensaje(200, "Admin encontrado", adminEncontrado);
    } catch (error) {
        // Manejo de errores
        return mensaje(400, "Error al buscar admin", error);
    }
};

// Función de eliminación de administradores mediante el ID
export const deleteIdAdmin = async (_id) => {
    try {
        // Búsqueda del administrador para verificar su existencia por ID
        const adminEncontrado = await Admin.findOne({ _id });
        // Validación del administrador encontrado
        if (!adminEncontrado) { return mensaje(400, "Admin no encontrado"); }
        // Eliminación del administrador mediante el ID
        const adminEliminado = await Admin.findByIdAndDelete({ _id });
        // Verificación de la eliminación si fue o no correcta
        if (!adminEliminado) { return mensaje(400, "Admin no eliminado"); }
        // Envío de correo para informar la eliminación de la cuenta
        await enviarCorreoDelete(adminEncontrado.email);
        // Retorna mensaje de éxito de eliminación
        return mensaje(200, `Administrador ${adminEncontrado.username} eliminado correctamente`);
    } catch (error) {
        // Manejo de errores
        return mensaje(400, "Error al buscar administrador", error);
    }
};

// Función de actualización de administrador mediante el ID
export const updateIdAdmin = async ({ _id, email, password }) => {
    try {
        // Búsqueda de administrador para validar su existencia
        const adminEncontrado = await Admin.findOne({ _id });
        // Verificación del administrador para continuar o retornar error
        if (!adminEncontrado) {
            return mensaje(400, "Administrador no encontrado");
        }

        // Verificación del email para revisar que el email no está ya registrado en la base de datos
        if (adminEncontrado.email !== email) {
            const emailDuplicado = await Admin.findOne({ email });
            // Validación de email para continuar o retornar error
            if (emailDuplicado) { return mensaje(400, "Email de administrador existente"); };
        };

        // Se guarda password antes de encriptar para pasarlo al correo
        const passwordOriginal = password;

        // Envío de correo para informar la actualización del administrador
        await enviarCorreoUpdateAdmin(email, passwordOriginal);

        // Encriptación del nuevo password usando la función proporcionada
        const { encrypted, iv, key } = encriptarPassword(password);

        const dataAdmin = { email, password: encrypted, iv, key };

        // Actualización del administrador en la base de datos
        const adminActualizado = await Admin.findByIdAndUpdate(_id, dataAdmin, { new: true });

        // Validación de la actualización
        if (!adminActualizado) { return mensaje(400, "Administrador no actualizado"); }

        // Retorna mensaje de éxito de actualización
        return mensaje(200, "Administrador actualizado correctamente");
    } catch (error) {
        // Manejo de errores
        return mensaje(400, "Error al intentar actualizar datos", error);
    }
};
