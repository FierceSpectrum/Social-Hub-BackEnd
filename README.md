# Social Hub Backend

Social Hub Backend es la API que maneja la funcionalidad del proyecto Social Hub. Esta API permite a los usuarios crear, programar, y gestionar publicaciones en redes sociales como Reddit y Mastodon. También soporta la autenticación de dos factores (2FA) y el manejo de cronogramas para publicaciones automatizadas.

## Funcionalidades

- **Manejo de usuarios**: Los usuarios pueden registrarse, iniciar sesión y habilitar la autenticación de dos factores (2FA).
- **Publicaciones (POST)**: Los usuarios pueden crear publicaciones, programarlas para fechas específicas o ponerlas en cola para ser publicadas según un cronograma predefinido.
- **Cronogramas (SCHEDULE)**: Los usuarios pueden definir un cronograma para que sus publicaciones en cola sean enviadas automáticamente en los días y horas especificados.
- **Redes sociales soportadas**: Actualmente, la API soporta la integración con Reddit y Mastodon para publicar en nombre de los usuarios.

## Estructura de la Base de Datos

- **Usuario (USER)**:
  - `id`: Identificador único de la publicación.
  - `email`: Correo electrónico del usuario.
  - `password`: Contraseña encriptada del usuario.
  - `name`: Nombre del usuario.
  - `last_name`: Apellido del usuario.
  - `two_factor_enabled`: Booleano que indica si el 2FA está habilitado.
  - `otp_secret`: Secreto usado para generar el OTP para 2FA.
  - `state`: Estado del usuario (activo o eliminado).

- **Publicación (POST)**:
  - `id`: Identificador único de la publicación.
  - `user_id`: Identificador del usuario que creó la publicación.
  - `title`: Título de la publicación.
  - `content`: Contenido de la publicación.
  - `posting_date`: Fecha programada para la publicación.
  - `social_network`: JSON que contiene las redes sociales en las que se publicará.
  - `state`: Estado de la publicación (pending, posted, deleted).

- **Cronograma (SCHEDULE)**:
  - `id`: Identificador único del cronograma.
  - `user_id`: Identificador del usuario dueño del cronograma.
  - `monday`: Día de la semana con horas específicas para publicar (ejemplo: `"08:00/12:00"`).
  - `tuesday`: Día de la semana con horas específicas para publicar (ejemplo: `"09:00"`).
  - `wednesday`: Día de la semana con horas específicas para publicar (ejemplo: `"10:00/14:00"`).
  - `thursday`: Día de la semana con horas específicas para publicar (ejemplo: `"06:00/8:30/23:00"`).
  - `friday`: Día de la semana con horas específicas para publicar (ejemplo: `"08:00/20:31"`).
  - `saturday`: Día de la semana con horas específicas para publicar (ejemplo: `"17:50/23:59"`).
  - `sunday`: Día de la semana con horas específicas para publicar (ejemplo: `"00:01"`).
  - `state`: Estado del cronograma.

- **Reddit User**:
  - `id`: Identificador único de la publicación.
  - `user_id`: Identificador del usuario.
  - `access_token`: Token de acceso para publicar en nombre del usuario (tamaño de 2048 caracteres).
  - `state`: Estado del token.

- **Mastodon User**:
  - `id`: Identificador único de la publicación.
  - `user_id`: Identificador del usuario.
  - `access_token`: Token de acceso para publicar en nombre del usuario.
  - `state`: Estado del token.

## Scripts

- **ProcessQueuePost**: Se ejecuta cada minuto para revisar los posts en cola y publicarlos según el cronograma del usuario.
- **PublishScheduledPost**: Se ejecuta cada minuto para publicar posts programados en la fecha y hora establecidas.

## Servicios

- **AuthService**: Maneja la autenticación, generación de tokens JWT, y verificación de contraseñas.
- **MastodonService**: Maneja la obtención del access token y la publicación en Mastodon.
- **RedditService**: Maneja la obtención del access token y la publicación en Reddit.
- **SocialMediaService**: Decide en qué redes sociales se publicará un post, llamando a los servicios correspondientes.

## Middleware

- **AuthMiddleware**: Verifica si el usuario tiene un token JWT válido antes de permitir el acceso a las rutas protegidas.

## Rutas

- **AuthRouter**: Maneja las rutas de autenticación (`/login`, `/login/verify-otp`, `/login/user-id`).
- **MastodonRouter**: Maneja las rutas relacionadas con la integración con Mastodon.
- **RedditRouter**: Maneja las rutas relacionadas con la integración con Reddit.
- **UserRouter**: Maneja las rutas relacionadas con la gestión de usuarios.
- **PostRouter**: Maneja las rutas relacionadas con la gestión de publicaciones.
- **ScheduleRouter**: Maneja las rutas relacionadas con la gestión de cronogramas.

## Requisitos

- Node.js
- Express
- PostgreSQL
- Sequelize
- JWT (Json Web Tokens)
- Google Authenticator para 2FA

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/FierceSpectrum/Social-Hub-BackEnd
   ```
2. Instala las dependencias:
    ```bash
   npm install
   ```

3. Configura las variables de entorno en un archivo `.env`.
4. Inicia el servidor:
    ```bash
   npm start
   ```
## Uso
Usa Postman para probar las rutas y funcionalidades de la API.
Configura los cronogramas y programaciones según tus necesidades.

Licencia
Este proyecto no tiene una licencia formal y fue creado con fines educativos. No está destinado para uso comercial.
