Dependencias a instalar:
"cookie-parser"
"cors"
"dotenv"
"express"
"jsonwebtoken"
"mongoose"
"nodemailer"
"qrcode"

index.js-archivo

![1](https://github.com/user-attachments/assets/8b660a5b-3e23-4038-bc56-a3643a713061)

Este documento describe la configuración del servidor utilizando Express, incluyendo la conexión a la base de datos, manejo de rutas de usuarios y tareas programadas.

express: Framework para manejar solicitudes HTTPS.
cors: Permite peticiones entre diferentes dominios.
cookie-parser: Facilita la manipulación de cookies.
MongoDB: Base de datos conectada mediante la función conectarDB().
Tareas programadas: Se ejecutan en cronTasks.js.
Este servidor con Express permite la gestión de usuarios, conexión con MongoDB, uso de cookies y ejecución de tareas programadas.
 Está diseñado para funcionar en Vercel y entornos locales.

db-carpeta.
administradoresDB.js-archivo.

![2](https://github.com/user-attachments/assets/0e3b3eaa-169b-4630-834f-ee4319365cdb)

Este código define una función registerAdmin para registrar un administrador en una base de datos MongoDB. 
Primero, verifica si el nombre de usuario o el correo electrónico ya están registrados para evitar duplicados, si no se encuentran duplicados, encripta la contraseña del administrador antes de almacenarla junto con el nombre de usuario y el correo electrónico en la base de datos. 
Después, genera un token JWT con la información del administrador, lo que permite la autenticación en futuras solicitudes. 
Luego, envía un correo al nuevo administrador con los detalles de su registro. Si todo el proceso es exitoso, la función retorna un mensaje con el token generado; si ocurre un error, retorna un mensaje de error.

![3](https://github.com/user-attachments/assets/a9e49852-0ba4-4b49-a3f7-73818061096d)

Este código define dos funciones: showAdmins y showIdAdmin.
La función showAdmins recupera todos los administradores registrados en la base de datos de MongoDB, convirtiéndolos en objetos JSON y validando si hay administradores disponibles.
Si se encuentran administradores, devuelve un mensaje con la lista; si no, devuelve un mensaje de error.
Por otro lado, showIdAdmin busca un administrador específico usando el ID proporcionado, si el administrador es encontrado, retorna la información de ese administrador; de lo contrario, devuelve un mensaje de error.

![4](https://github.com/user-attachments/assets/f6579f71-5add-4101-bd7c-2aaa2b6e21f7)

Este código define dos funciones: deleteIdAdmin y updateIdAdmin. 
La función deleteIdAdmin se encarga de eliminar un administrador de la base de datos mediante su ID primero, verifica si el administrador existe, luego lo elimina y envía un correo informando de la eliminación, si ocurre algún error durante el proceso, devuelve un mensaje de error.
Por otro lado, la función updateIdAdmin actualiza la información de un administrador, como su correo electrónico y contraseña. Verifica si el administrador existe y si el nuevo correo no está registrado ya.
Encripta la nueva contraseña antes de actualizarla en la base de datos y también envía un correo notificando la actualización, si la actualización es exitosa, devuelve un mensaje de éxito, si no, maneja los errores y devuelve un mensaje correspondiente.

correos.js-archivo.

![1](https://github.com/user-attachments/assets/2fa1dc95-6360-4c4f-9c43-11096e870758)

Este código define una función enviarCorreoRegistro que envía un correo electrónico al usuario cuando se registra como administrador.
Primero, configura un servicio de correo utilizando nodemailer con las credenciales de una cuenta de Gmail, luego, genera un código QR que contiene los datos de acceso del usuario.
El correo se configura con un cuerpo en HTML que incluye un mensaje de bienvenida, los datos de la cuenta y el código QR generado como imagen adjunta permitiendo al usuario escanear y acceder rápidamente a su cuenta, finalmente, el correo se envía utilizando nodemailer, y si ocurre un error durante el proceso, se maneja e imprime en consola.

![2](https://github.com/user-attachments/assets/edf2e7a7-8c28-4003-807c-dd96844b0a3e)

Este fragmento de código es similar al anterior, pero está diseñado para enviar un correo electrónico después de que se haya actualizado una cuenta de usuario:
Generación del código QR: Se crea un código QR con los nuevos datos de acceso del usuario, este QR se genera en formato base64, convirtiéndolo en un buffer de imagen
Configuración del correo electrónico: Se configura un correo con los detalles de la cuenta actualizada, el nombre del hijo/a, la nueva contraseña y el código QR generado, se utiliza HTML para el cuerpo del correo, y el QR se adjunta como una imagen.
Envío del correo: El correo se envía a través de nodemailer con los detalles configurados. Si ocurre algún error durante el envío, se captura e imprime en la consola.

![3](https://github.com/user-attachments/assets/2353e0b0-9af7-41d2-9fef-eddd07498aa1)

Este código define una función llamada enviarCorreoDelete que envía un correo electrónico al usuario para notificarle que su cuenta ha sido eliminada. 
Configuración del correo: Se configura un transporte de correo usando nodemailer, con Gmail como servicio de envío, se proporcionan las credenciales de autenticación para acceder a la cuenta de correo.
Configuración del mensaje: El cuerpo del correo se define en formato HTML, notificando al usuario que su cuenta ha sido eliminada con éxito también se incluye un mensaje en caso de que el usuario considere que la eliminación fue un error, proporcionando un correo electrónico para aclaraciones.
Envío del correo: La función intenta enviar el correo utilizando transporter.sendMail(mailOptions) si ocurre algún error durante el envío, se captura e imprime en la consola.

![4](https://github.com/user-attachments/assets/0edd6b63-ef9c-457d-9532-7df9f8294dfd)

Este código define una función llamada enviarCorreoRegistroAdmin que envía un correo electrónico a un administrador al registrarlo en el sistema.
Configuración del correo: Se utiliza nodemailer para configurar el transporte de correo, en este caso con el servicio de Gmail se proporcionan las credenciales de autenticación para poder enviar el correo desde la cuenta configurada.
Configuración del mensaje: Se define el contenido del correo en formato HTML el correo incluye un saludo dirigido al administrador, confirmando la creación de su cuenta, y proporciona los datos relevantes: el nombre de usuario y la contraseña.
Envío del correo: Se intenta enviar el correo a través de transporter.sendMail(mailOptions) si ocurre algún error en el proceso de envío, se captura y se imprime un mensaje de error en la consola.

![5](https://github.com/user-attachments/assets/8a218cd6-cabe-4537-9fbf-c7015293e584)

La función enviarCorreoUpdateAdmin tiene el objetivo de enviar un correo electrónico a un administrador con la confirmación de que su cuenta ha sido actualizada, incluyendo la nueva contraseña.
Configuración del correo: La función utiliza nodemailer para crear un transporte de correo con el servicio de Gmail, se proporcionan las credenciales de la cuenta de Gmail para autenticar el envío de los correos.
Configuración del mensaje: El contenido del correo se configura en formato HTML el correo incluye un mensaje indicando que la cuenta ha sido actualizada con éxito, junto con la nueva contraseña del administrador.
Envío del correo: Se intenta enviar el correo con transporter.sendMail(mailOptions)si ocurre algún error en el proceso de envío, el error se captura y se imprime un mensaje en la consola.

![6](https://github.com/user-attachments/assets/770ad8b8-1ce1-4bc5-a1cd-29b34fe3869e)

La función generarQrConId permite generar un qr de forma dinamica en base a un id de un un usuario especifico permitiendo descargarlo o imprimirlo usando un formato JSON con la información del email
y password. La función enviarQRAD permite al administrador enviar un qr con los datos especificos al correo registrado usando sendMail

db.js-archivo.

![1](https://github.com/user-attachments/assets/01b8e566-03b6-4ef5-9999-15f4a1a2bf72)

La función conectarDB tiene como objetivo establecer una conexión con la base de datos MongoDB utilizando mongoose.
Conexión con MongoDB:
La función utiliza mongoose.connect para conectarse a una base de datos en Mongo Atlas se pasa la URL de conexión que incluye las credenciales y detalles de la base de datos.
Si la conexión es exitosa, se devuelve un mensaje de éxito con el código de estado 200.
Manejo de errores: Si ocurre un error durante la conexión, se captura el error y se devuelve un mensaje de error con el código 400 y los detalles del error.
Uso de mensaje: La función mensaje se utiliza para retornar los mensajes de éxito o error, de esta manera, puedes estandarizar la respuesta en todo el sistema.

ubicationDB.js-archivo.

![1](https://github.com/user-attachments/assets/706613f9-b6f1-41cd-ba0b-02e6d979d9b8)

La función ubicationRegister se encarga de registrar o actualizar las ubicaciones de un usuario y dispositivo en la base de datos.
Búsqueda de ubicación existente:
La función comienza buscando si ya existe una ubicación registrada para el usuario y el dispositivo proporcionados idUsuario, idDispositivo, para ello, se utiliza Ubication.findOne({ idUsuario, idDispositivo }).
Actualización de ubicación existente:
Si se encuentra una ubicación registrada, la función agrega un nuevo punto de coordenadas (latitud, longitud) con la fecha y hora actual, este nuevo punto se agrega al array puntos de la ubicación existente, después de agregar el punto, la ubicación se guarda de nuevo con ubicacionExistente.save().
Registro de nueva ubicación
Si no se encuentra una ubicación registrada, la función crea una nueva entrada en la colección de ubicaciones con el primer punto de coordenadas y la fecha y hora actual, se utiliza el modelo Ubication para crear un nuevo objeto y se guarda con nuevaUbicacion.save().
Manejo de respuestas
Si todo va bien, la función retorna un objeto con status: 200 y un mensaje indicando que la ubicación se registró correctamente.
En caso de error (por ejemplo, si hay un problema con la base de datos), la función captura el error, lo muestra en consola, y retorna un mensaje de error con status: 500.

![2](https://github.com/user-attachments/assets/6cd9e882-8ab4-4d02-be7d-b1447bd2c8cd)

Las funciones showUbication y showUbicationId permiten obtener todas las ubicaciones almacenadas en la base de datos y obtener una ubicación específica por su ID, respectivamente
Función showUbication
Se realiza una consulta a la base de datos con Ubication.find() para obtener todas las ubicaciones.
La opción .lean() se utiliza para convertir el resultado de la consulta en objetos JSON simples (sin los métodos de Mongoose).
Si no se encuentran ubicaciones, se devuelve un mensaje de error con el status 400.
Si se encuentran ubicaciones, se devuelve el status 200 junto con los datos de las ubicaciones.
En caso de error en la consulta, se captura el error y se retorna con un mensaje de error y status 500.
Función showUbicationId
Se realiza una consulta con Ubication.findOne({ _id }) para buscar una ubicación por su ID.
Si no se encuentra la ubicación, se retorna un mensaje con status 400.
Si se encuentra, se retorna el status 200 junto con los datos de la ubicación.
En caso de error, se captura y se retorna con status 500.

usuariosDB.js-archivo.

![1](https://github.com/user-attachments/assets/cf428ac1-0df0-4b4a-8451-e78cc06b11b0)

Función register:
Verificación de usuario duplicado:
Se verifican dos cosas: si el username ya está registrado y si el email ya existe en la base de datos. Esto es para evitar la creación de registros duplicados.
Encriptación de la contraseña:
La contraseña proporcionada por el usuario se encripta utilizando las funciones encriptarPassword, y luego se guarda el salt y el hash en la base de datos.
Creación del nuevo usuario:
Si no hay registros duplicados, se crea un nuevo documento de usuario con la información proporcionada y se guarda en la base de datos de MongoDB.
Generación del token JWT:
Una vez que el usuario es registrado correctamente, se genera un token JWT utilizando la función crearToken para autorizar al usuario en las futuras solicitudes.
Envío del correo de registro:
Se envía un correo con los detalles del registro, incluyendo el username y la contraseña original (antes de la encriptación) utilizando la función enviarCorreoRegistro.
Respuesta exitosa:
Si todo va bien, se retorna un mensaje de éxito con el token JWT generado.
Manejo de errores:
En caso de que ocurra cualquier error, se captura y se retorna un mensaje de error adecuado.

![2](https://github.com/user-attachments/assets/b2f52eea-0875-40b2-b652-b37392825c05)

Función login:
Búsqueda del usuario por email:
Se busca el usuario en la base de datos usando el correo electrónico proporcionado. Si no se encuentra, se retorna un mensaje de error.
Validación de la contraseña:
Se valida que la contraseña proporcionada coincida con la encriptada en la base de datos utilizando la función validarPassword. Si la contraseña no es válida, se retorna un mensaje de error.
Generación del token JWT:
Si las credenciales son correctas, se genera un token JWT utilizando la función crearToken, que contiene la información básica del usuario (id, username, sonName y email).
Respuesta exitosa:
Si el login es exitoso, se retorna un mensaje de éxito junto con el token JWT generado.
Manejo de errores:
Si ocurre cualquier error durante el proceso, se captura y se retorna un mensaje de error.

![3](https://github.com/user-attachments/assets/c8654cb4-c632-49f9-ad7e-19f095af43be)

Función show:
Obtención de todos los usuarios:
La función usa User.find().lean() para obtener todos los usuarios desde MongoDB y convertir los resultados a objetos JSON. Esto es eficiente si solo necesitas los datos en formato JSON sin instancias de Mongoose.
Validación de si se encontraron usuarios:
La función verifica si hay usuarios con usuarios.length y si no hay usuarios, devuelve un mensaje adecuado.
Manejo de errores:
Si ocurre algún error al interactuar con la base de datos, se captura y se devuelve un mensaje de error.

![4](https://github.com/user-attachments/assets/256632b7-162a-4add-9833-86c018a52acb)

La implementación de las funciones showId y deleteId para buscar y eliminar usuarios por su ID parece estar bien estructurada. Sin embargo, hay algunos aspectos que podrían mejorarse o ser más eficientes.
showId:
Función: Busca un usuario por su ID y devuelve la información si se encuentra.
Manejo de errores: Si no se encuentra al usuario, se devuelve un mensaje adecuado.
deleteId:
Función: Busca un usuario por su ID, lo elimina si existe y luego envía un correo informando sobre la eliminación de la cuenta.
Manejo de errores: Si algo falla durante el proceso (búsqueda, eliminación o envío de correo), se devuelve un mensaje de error.

![5](https://github.com/user-attachments/assets/d3cb540b-28d0-41c1-86b9-ad114b26cb3e)

Función updateId
Verificación del email duplicado:
Estás verificando el email solo si el usuario está intentando cambiarlo (usuarioEncontrado.email !== email). Sin embargo, esto es innecesario si el email no está cambiando. Se podría optimizar este bloque.
Encriptación de la contraseña:
Estás guardando la contraseña en su forma original antes de encriptarla para enviarla en el correo. Esto no es ideal desde un punto de vista de seguridad, ya que implica almacenar una versión en texto claro de la contraseña antes de la encriptación. Podrías considerar evitar esto, o si es necesario, almacenar la versión encriptada para el correo.
Eficiencia:
Podrías optimizar el flujo para evitar una segunda consulta de verificación de email, haciendo el proceso más eficiente. La verificación del email solo debería ocurrir si el email se está modificando.

libs-carpeta.
jwt.js-archivo.

![1](https://github.com/user-attachments/assets/c5b4a858-a193-4511-ae90-3b953a616961)

Librería jsonwebtoken
Uso de la clave secreta (SECRET_TOKEN):
Estás utilizando process.env.SECRET_TOKEN para la clave secreta, lo cual es una buena práctica, ya que mantiene la clave fuera del código fuente. Asegúrate de que esta variable de entorno esté definida correctamente en tu archivo .env y de que el archivo .env esté protegido.
Manejo de errores:
La función de rechazo de la promesa maneja bien los errores de generación del token, pero puedes simplificar un poco el manejo de los mensajes de error al centralizar la creación de los mensajes, ya que actualmente lo haces dentro de la promesa.
Expiración del token (expiresIn):
Definir el tiempo de expiración del token como "1d" (un día) es una buena opción. Sin embargo, dependiendo del uso de los tokens en tu aplicación, puede que quieras ajustarlo (por ejemplo, "2h" para tokens con una vida más corta o más larga).
mensajes.js-archivo

![1](https://github.com/user-attachments/assets/1b196ffe-5a0c-42df-8158-40cacd8e57d1)

La función mensaje
Parámetros Opcionales:
Este parámetro es opcional y puede ser null si no se necesita incluir información adicional en la respuesta. 
Mensaje Original:
Un mensaje que podría ser utilizado para registrar o mostrar el mensaje original sin modificarlo.
Código de estado:
El status es un código estándar de HTTP, por lo que es recomendable seguir convenciones de respuesta estándar, como 200 para éxito, 400 para malas solicitudes, 500 para errores internos del servidor, etc. Esto hará que la API sea más intuitiva para otros desarrolladores.

middlewares-carpeta.
funcionesPassword.js-archivo.

![1](https://github.com/user-attachments/assets/8b3193fa-033f-4fe1-afd5-973e629b6ee1)

Verificación de autorización de usuarios mediante tokens JWT
Encriptación de Contraseña:
Estás usando crypto.randomBytes, que es una buena opción para la encriptación de contraseñas, se asegura de que esta longitud sea suficiente para la seguridad que deseas, sin embargo
permite la desencriptacion.
Validación de Contraseña:
La función validarPassword compara el hash generado con el hash almacenado. Este proceso asegura que la contraseña proporcionada coincida con la almacenada.
Autorización del Usuario (Token):
El proceso de validación del token en la función usuarioAutorizado, si el token es inválido, solo se devuelve un mensaje sin interrupción. 

![2](https://github.com/user-attachments/assets/e75e7e7e-6314-4c83-80e6-69eef9cb2bb3)

Funcion de desencriptar password, usa la informacion guardada dentro de la base de datos para recuperar la contraseña original 
Esto permite facilitar la creacion de qr en otras funciones

models-carpeta
administradorModelo.js-archivo

![1](https://github.com/user-attachments/assets/404b6b2b-c858-44f5-a09c-f2bf4f380fa3)

Define un modelo para los administradores, donde se establecen campos obligatorios como username, email, y password, con restricciones para evitar duplicados en username y email.

ubicacionesModelo.js-archivo

![1](https://github.com/user-attachments/assets/eb1752e7-ab79-46f1-8bbf-a33874fe87b2)

Este esquema de Mongoose define un modelo para almacenar ubicaciones de usuarios y dispositivos. Contiene un campo obligatorio idUsuario que identifica al usuario y un campo obligatorio idDispositivo que identifica el dispositivo asociado a las ubicaciones. El esquema también incluye un arreglo de puntos de ubicación, donde cada punto tiene dos campos obligatorios: latitud y longitud, que se almacenan como cadenas de texto.

usuarioModelo.js-archivo

![1](https://github.com/user-attachments/assets/80866d9c-ce64-442b-8a43-4a3ebd4ba953)

Este esquema de Mongoose define el modelo para almacenar información de usuarios, con varios campos importantes. El campo username es obligatorio, único en la base de datos y se asegura de eliminar los espacios en blanco alrededor del nombre de usuario. El campo sonName es obligatorio para el apellido del usuario, también con la opción de eliminar espacios al principio y al final. El campo email es obligatorio y debe ser único, y también se eliminan los espacios en blanco alrededor del correo electrónico. El password es obligatorio y se almacenará en la base de datos de forma segura, mientras que salt almacena la clave de cifrado usada para encriptar la contraseña. El uso de timestamps: true agrega automáticamente los campos createdAt y updatedAt para registrar las fechas de creación y última actualización de cada usuario.

routes-carpeta
usuariosRutas.js-archivo

![1](https://github.com/user-attachments/assets/5f9c02cc-0811-442d-9865-044d88f18432)

Importa las funciones necesarias para el correcto funcionamiento de las rutas.
express.Router(): Utilizado para manejar rutas.
Funciones de Base de Datos: Cada archivo importado desde usuariosDB.js, administradoresDB.js, y ubicationDB.js contiene funciones que interactúan con la base de datos para registrar, actualizar, mostrar y eliminar registros de usuarios, administradores y ubicaciones.
Autorización: Las funciones usuarioAutorizado y adminAutorizado se usan como middlewares para controlar el acceso a rutas protegidas según el tipo de usuario

![2](https://github.com/user-attachments/assets/3b73e68c-83d0-4c85-8437-494fd3342df7)

Esta ruta permite crear un usuario, utilizada por un administrador para crear cuentas de usuario sin que el propio usuario tenga que hacerlo.

![3](https://github.com/user-attachments/assets/dfd51fab-9168-496e-a67c-9b9166b10e81)

Maneja la creacion de usuarios, por petición del administrador.

![4](https://github.com/user-attachments/assets/2ba6eb6d-5635-4a01-86da-11167883a433)

Esta ruta permite a los usuarios iniciar sesión. El cuerpo contiene las credenciales necesarias para el proceso (username y password).

![5](https://github.com/user-attachments/assets/0cff28c9-4008-4317-a95f-8e482d1abc44)

Esta ruta devuelve todos los usuarios registras en la base de datos.

.![6](https://github.com/user-attachments/assets/684a147a-b88a-43d1-909f-db4d296f95f8)

Devuelve los datos de un usuario especifico mediante su id.

![7](https://github.com/user-attachments/assets/6afd799e-99d7-4329-add5-3d230f1efb86)

Esta permite la eliminación de un usuario mediante el id.

![8](https://github.com/user-attachments/assets/337f34b7-d975-4939-881d-a18a72d6e029)

Esta ruta permite actualizar la información de un usuario específico, como su nombre de usuario o correo electrónico.

.![9](https://github.com/user-attachments/assets/264aeea7-5477-46ad-89a9-041487f37bae)

Se utiliza para cerrar la sesión del usuario.

![13](https://github.com/user-attachments/assets/68fb09d0-b388-4488-b42e-2dc882bdf0e7)

Esta ruta permite el registro de una nueva ubicación.

![14](https://github.com/user-attachments/assets/31dab5a3-912e-4b80-9fc3-fedb10c64a8a)

Devuelve todas las ubicaciones registradas en la base de datos.

![15](https://github.com/user-attachments/assets/f3d97683-3ed6-4907-9b3c-29d21bfb2d75)

Muestra los detalles de una ubicación específica mediante el ID.

![16](https://github.com/user-attachments/assets/d6232757-914a-4a15-ac96-5316e386fa3e)

Permite a un administrador registrar a otro administrador en el sistema.

![18](https://github.com/user-attachments/assets/c5ca3831-47ee-4470-8371-cbdea36f712e)

Permite a los administradores visualizar todos los administradores registrados en el sistema.

![19](https://github.com/user-attachments/assets/fa175792-0e8d-416d-9e01-36c9bd4a5a27)

Permite a los administradores consultar la información de un administrador específico, identificado por su ID.

![20](https://github.com/user-attachments/assets/02666a86-1266-4cd4-8864-d55a195802d5)

Permite a un administrador eliminar a otro administrador del sistema, lo que es necesario para la gestión de usuarios administrativos.

![21](https://github.com/user-attachments/assets/6803dd07-7778-49d8-9290-3a7f13dab45d)

Permite actualizar la información de un administrador.

![22](https://github.com/user-attachments/assets/596e928a-3d82-4a99-b27a-ee67af4e0bf3)

Funcion utlizada para borrar todas las ubicaciones y ahorrar memoria en la base de datos
