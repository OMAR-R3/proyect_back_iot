// Función para estructurar respuestas en formato de objeto JSON
export function mensaje(status, mensajeUsuario, datos = null, mensajeOriginal="",token=""){
    return{
        status, // Código de estado de la respuesta 
        mensajeUsuario, // Mensaje amigable para el usuario
        mensajeOriginal: mensajeUsuario, // Mensaje original
        token,// Token opcional si es necesario devolverlo en la respuesta
        datos// Datos opcionales a incluir en la respuesta
    }
}