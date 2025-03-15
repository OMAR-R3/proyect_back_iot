export function mensaje(status, mensajeUsuario, datos = null, mensajeOriginal="",token=""){
    return{
        status,
        mensajeUsuario,
        mensajeOriginal: mensajeUsuario,
        token,
        datos
    }
}