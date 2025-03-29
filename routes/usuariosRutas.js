import { Router } from "express";
import QRCode from "qrcode";
import { generarQrConId, enviarQRAD } from "../db/correos.js";
import { deleteId, login, register, show, showId, updateId } from "../db/usuariosDB.js";
import { registerAdmin, showAdmins, showIdAdmin, deleteIdAdmin, updateIdAdmin} from "../db/administradoresDB.js";
import { ubicationRegister, showUbication, showUbicationId } from "../db/ubicationDB.js";
import { log } from "console";
const router = Router();
import { adminAutorizado, usuarioAutorizado } from "../middlewares/funcionesPassword.js";
// Rutas para gestión de usuarios
// Registro de usuario
router.post("/registro", async (req, res) => {
    const respuesta = await register(req.body);
    res.cookie("token", respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);
});
// Creación de usuario
router.post("/crearUsuario", async (req, res) => {
    const respuesta = await crearUsuario(req.body);
    res.cookie("token", respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);
});
// Inicio de sesión de usuario
router.post("/login", async (req, res) => {
    console.log(req.body);
    const respuesta = await login(req.body);
    res.cookie("token", respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);

});
// Obtener todos los usuarios
router.get("/show", async (req, res) => {
    const respuesta = await show();
    console.log(respuesta.mensajeOriginal);
    res.status(respuesta.status).json({
        datos: respuesta.datos || null,
    });
});
// Obtener un usuario por ID
router.get("/showId/:id", async (req, res) => {
    const respuesta = await showId(req.params.id);
    console.log(respuesta.mensajeOriginal);
    res.status(respuesta.status).json({
        datos: respuesta.datos || null,
    });
});
// Eliminar usuario por ID
router.delete("/deleteId/:id", async (req, res) => {
    const respuesta = await deleteId(req.params.id);
    console.log(respuesta.mensajeOriginal);
    res.status(respuesta.status).json({
        mensaje: respuesta.mensajeUsuario
    });
});
// Actualizar usuario
router.patch("/updateId", async (req, res) => {
    const respuesta = await updateId(req.body);
    console.log(respuesta.mensajeOriginal);
    res.status(respuesta.status).json({
        mensaje: respuesta.mensajeUsuario
    });
});
// Cerrar sesión
router.get("/salir", async (req, res) => {
    res.cookie('token', '', { expires: new Date(0) }).clearCookie('token').status(200).json("Cerraste sesión correctamente");

});
// Ver usuarios logueados
router.get("/usuariosLogueados", async (req, res) => {
    const respuesta = usuarioAutorizado(req.cookies.token, req);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});
// Verificar si es un administrador autorizado
router.get("/administradores", async (req, res) => {
    //console.log("Cookies recibidas en la solicitud:");
    //console.log(req.cookies.token);
    const respuesta = await adminAutorizado(req);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});
// Ruta accesible sin autenticación
router.get("/cualquierUsuario", async (req, res) => {
    res.json("Todos pueden usar sin loguearse");
});
//ubicaciones
// Ruta para registrar una nueva ubicación
router.post("/ingresarUbicacion", async (req, res) => {
    const respuesta = await ubicationRegister(req.body);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});
// Ruta para mostrar todas las ubicaciones
router.get("/ubicationShow", async (req, res) => {
    const respuesta = await showUbication();
    res.status(respuesta.status).json({
        datos: respuesta.datos || null,
    });
});
// Ruta para mostrar una ubicación específica por ID
router.get("/showIdUbication/:id", async (req, res) => {
    const respuesta = await showUbicationId(req.params.id);
    res.status(respuesta.status).json({
        datos: respuesta.datos || null,
    });
});
//admins
// Registro de administrador
router.post("/registroAdmin", async (req, res) => {
    console.log("1");
    const respuesta = await registerAdmin(req.body);
    res.cookie("token", respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);
});


// Inicio de sesión de administrador
router.post("/loginAdmin", async (req, res) => {
    console.log(req.body);
    const respuesta = await loginAdmin(req.body);
    res.cookie("token", respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);

});
// Obtener todos los administradores
router.get("/showAdmins", async (req, res) => {
    const respuesta = await showAdmins();
    console.log(respuesta.mensajeOriginal);
    res.status(respuesta.status).json({
        datos: respuesta.datos || null,
    });
});
// Obtener un administrador por ID
router.get("/showIdAdmin/:id", async (req, res) => {
    const respuesta = await showIdAdmin(req.params.id);
    console.log(respuesta.mensajeOriginal);
    res.status(respuesta.status).json({
        datos: respuesta.datos || null,
    });
});
// Eliminar un administrador por ID
router.delete("/deleteIdAdmin/:id", async (req, res) => {
    const respuesta = await deleteIdAdmin(req.params.id);
    console.log(respuesta.mensajeOriginal);
    res.status(respuesta.status).json({
        mensaje: respuesta.mensajeUsuario
    });
});
// Actualizar un administrador
router.patch("/updateIdAdmin", async (req, res) => {
    const respuesta = await updateIdAdmin(req.body);
    console.log(respuesta.mensajeOriginal);
    res.status(respuesta.status).json({
        mensaje: respuesta.mensajeUsuario
    });
});

router.get("/generarQr/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Obtener datos desde la base de datos
        const respuesta = await generarQrConId(id);
        if (respuesta.status !== 200) {
            return res.status(400).json({ error: respuesta.mensajeUsuario });
        }
        // Generar el QR con el objeto JSON (stringificado)
        const qrCode = await QRCode.toDataURL(respuesta.token); // respuesta.token contiene el objeto JSON
        // Convertir base64 a imagen binaria
        const img = Buffer.from(qrCode.split(",")[1], "base64");
        // Enviar la imagen del QR como respuesta
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Content-Disposition", 'attachment; filename="qrcode.png"');
        res.send(img);
    } catch (err) {
        res.status(400).json({ error: "Error al generar el QR" });
    }
});

router.get("/enviarQr/:id", async (req, res) => {
    const { id } = req.params;
    const respuesta = await enviarQRAD(id);
    console.log(respuesta.mensajeOriginal);
    res.status(respuesta.status).json({
        mensaje: respuesta.mensajeUsuario
    });
});

// Ruta para borrar todas las ubicaciones
router.delete("/deleteAllUbications", async (req, res) => {
    try {
        const respuesta = await Ubication.deleteMany({});
        console.log("Todas las ubicaciones han sido borradas.");
        res.status(200).json({ mensaje: "Todas las ubicaciones han sido borradas correctamente." });
    } catch (error) {
        console.error("Error al borrar las ubicaciones:", error);
        res.status(500).json({ error: "Error al borrar las ubicaciones." });
    }
});
export default router;