import { Router } from "express";
import { deleteId, login, register, show, showId, updateId, crearUsuario,ubicationRegister} from "../db/usuariosDB.js";
import { log } from "console";
const router = Router();
import { adminAutorizado, usuarioAutorizado } from "../middlewares/funcionesPassword.js";

router.post("/registro", async (req, res) => {
    const respuesta = await register(req.body);
    res.cookie("token", respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);
    //console.log(req.cookies);
});

router.post("/crearUsuario", async (req, res) => {
    const respuesta = await crearUsuario(req.body);
    res.cookie("token", respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);
    //console.log(req.cookies);
});

/*router.post("/login", async (req, res) => {
    const respuesta = await login(req.body);
    console.log(respuesta.mensajeOriginal);
    res.cookie("token", respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);
});*/

router.post("/login", async (req, res) => {
    console.log(req.body);
    const respuesta = await login(req.body);
    res.cookie("token", respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);

});

router.get("/show", async (req, res) => {
    const respuesta = await show();
    console.log(respuesta.mensajeOriginal);
    res.status(respuesta.status).json({
        datos: respuesta.datos || null,  // Si hay datos, se devuelven; si no, se pasa null.
    });
});

router.get("/showId/:id", async (req, res) => {
    //console.log(req.params.id);

    const respuesta = await showId(req.params.id);
    console.log(respuesta.mensajeOriginal);
    res.status(respuesta.status).json({
        datos: respuesta.datos || null,  // Si hay datos, se devuelven; si no, se pasa null.
    });
});

router.delete("/deleteId/:id", async (req, res) => {
    //console.log(req.params.id);
    const respuesta = await deleteId(req.params.id);
    console.log(respuesta.mensajeOriginal);
    res.status(respuesta.status).json({
        mensaje: respuesta.mensajeUsuario
    });
});

router.patch("/updateId", async (req, res) => {
    const respuesta = await updateId(req.body);
    console.log(respuesta.mensajeOriginal);
    res.status(respuesta.status).json({
        mensaje: respuesta.mensajeUsuario
    });
});

router.get("/salir", async (req, res) => {
    res.cookie('token', '', { expires: new Date(0) }).clearCookie('token').status(200).json("Cerraste sesión correctamente");

});

router.get("/usuariosLogueados", async (req, res) => {
    const respuesta = usuarioAutorizado(req.cookies.token, req);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});


/*router.get("/administradores",async(req,res)=>{
    const respuesta = await adminAutorizado(req);
    console.log(respuesta);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});*/

router.get("/administradores", async(req, res) => {
    //console.log("Cookies recibidas en la solicitud:");
    //console.log(req.cookies.token);
    const respuesta = await adminAutorizado(req);
    res.status(respuesta.status).json(respuesta.mensajeUsuario);
});



router.get("/cualquierUsuario", async (req, res) => {
    res.json("Todos pueden usar sin loguearse");
});



router.post("/ingresarUbicacion", async(req,res)=>{
    const respuesta = await ubicationRegister(req.body);
    res.cookie("token", respuesta.token).status(respuesta.status).json(respuesta.mensajeUsuario);
})


//faltantes
router.get("/ubicationShow", async (req, res) => {
    const respuesta = await show();
    console.log(respuesta.mensajeOriginal);
    res.status(respuesta.status).json({
        datos: respuesta.datos || null,  // Si hay datos, se devuelven; si no, se pasa null.
    });
});

router.get("/showId/:id", async (req, res) => {

    const respuesta = await showId(req.params.id);
    console.log(respuesta.mensajeOriginal);
    res.status(respuesta.status).json({
        datos: respuesta.datos || null,  // Si hay datos, se devuelven; si no, se pasa null.
    });
});
router.get("/showId/:id", async (req, res) => {

    console.log("pueba 1");
  
});
export default router;