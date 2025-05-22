
# Rifa Facil - Plataforma de Rifas Online (Análogo a un Proyecto Laravel con Next.js)

¡Bienvenido a Rifa Facil! Esta es una aplicación web moderna que permite a los usuarios participar en rifas y ganar premios. Aunque está construida con Next.js (React/Node.js), este README intentará trazar paralelismos conceptuales con un proyecto Laravel para facilitar la comprensión a desarrolladores familiarizados con dicho framework.

## Tabla de Contenidos

1.  [Visión General del Proyecto (El "Qué" y el "Por qué")](#visión-general-del-proyecto)
2.  [Tecnologías Utilizadas (El "Stack Tecnológico")](#tecnologías-utilizadas)
3.  [Funcionalidades Principales (El "Core" de la Aplicación)](#funcionalidades-principales)
4.  [Configuración del Proyecto (Como `php artisan key:generate` y `.env`)](#configuración-del-proyecto)
    *   [Prerrequisitos](#prerrequisitos)
    *   [Instalación](#instalación)
    *   [Variables de Entorno](#variables-de-entorno)
    *   [Configuración de la Base de Datos (Como "Migrations" y "Seeders")](#configuración-de-la-base-de-datos)
5.  [Cómo Ejecutar la Aplicación (Como `php artisan serve`)](#cómo-ejecutar-la-aplicación)
6.  [Estructura del Proyecto (Análogo a la Estructura de Directorios de Laravel)](#estructura-del-proyecto)
7.  [Autenticación (Como "Laravel Breeze/Sanctum/Passport")](#autenticación)
8.  [Base de Datos (Como "Eloquent ORM" con Consultas SQL Directas)](#base-de-datos)
    *   [Esquema de Tablas](#esquema-de-tablas)
9.  [Despliegue (Como "Laravel Forge/Envoyer" o Despliegue Manual)](#despliegue)
10. [Funcionalidades Futuras (Ideas para Evolucionar)](#funcionalidades-futuras-ideas)

## Visión General del Proyecto

"Rifa Facil" es una plataforma diseñada para que los usuarios puedan:
*   Ver rifas activas con premios atractivos.
*   Comprar boletos de forma sencilla y segura.
*   Registrar sus pagos a través de diversos métodos populares en Venezuela.
*   Gestionar su información de perfil necesaria para la participación y entrega de premios.
*   Consultar reglas y listas de ganadores.

Conceptualmente, piensa en esto como una aplicación web full-stack donde Next.js maneja tanto el frontend (como las vistas Blade enriquecidas con Vue/React en Laravel) como el backend (como los controladores y rutas API de Laravel).

## Tecnologías Utilizadas

*   **Framework Principal:** [Next.js](https://nextjs.org/) (App Router) - Actúa como el framework full-stack, similar a Laravel.
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) - Equivalente a usar tipado estricto en PHP.
*   **UI (Frontend):** [React](https://reactjs.org/) - Análogo a usar Vue.js o React como librería frontend en Laravel.
*   **Componentes UI:** [ShadCN/UI](https://ui.shadcn.com/) - Piensa en esto como una librería de componentes pre-estilizados tipo Bootstrap/TailwindUI, pero integrada con React.
*   **Estilos CSS:** [Tailwind CSS](https://tailwindcss.com/) - Framework CSS de utilidad, comúnmente usado también en proyectos Laravel.
*   **Autenticación:** [NextAuth.js](https://next-auth.js.org/) (con Google Provider) - Similar a Laravel Breeze, Jetstream, Passport o Sanctum para manejar la autenticación OAuth y sesiones.
*   **Base de Datos:** [MySQL](https://www.mysql.com/) - Base de datos relacional estándar, compatible con Laravel.
*   **Acceso a BD:** [serverless-mysql](https://github.com/serverless-heaven/serverless-mysql) - Un conector de base de datos optimizado para entornos serverless. No es un ORM completo como Eloquent, sino más bien un query builder ligero y gestor de conexiones.
*   **Validación de Formularios:** [React Hook Form](https://react-hook-form.com/) con [Zod](https://zod.dev/) - Similar a las "Form Requests" y reglas de validación de Laravel.
*   **Inteligencia Artificial (GenAI):** [Genkit (Google AI)](https://firebase.google.com/docs/genkit) - Configurado pero no implementado activamente. Podría usarse para generar contenido, similar a cómo se integraría un SDK de OpenAI en Laravel.

## Funcionalidades Principales

Aquí se detallan las capacidades clave de "Rifa Facil":

1.  **Visualización y Descubrimiento de Rifas:**
    *   **Listado de Rifas Activas:** En la página principal, los usuarios pueden explorar un catálogo de todas las rifas actualmente disponibles.
    *   **Detalles por Rifa:** Cada rifa en el listado muestra información esencial: título, una breve descripción, una imagen representativa del premio, el precio por boleto y un botón para participar.
    *   **Página Dedicada por Rifa:** Al seleccionar una rifa, el usuario accede a una vista detallada con toda la información: descripción completa, imagen ampliada, precio del boleto, fecha de finalización (si está definida) y el número máximo de boletos que se pueden comprar (o el total de números disponibles para la rifa).
    *(Equivalente en Laravel: Un `RaffleController` con un método `index()` para listar y `show()` para detalles, interactuando con un modelo `Raffle` y vistas Blade.)*

2.  **Autenticación y Registro de Usuarios:**
    *   **Inicio de Sesión/Registro con Google:** Los usuarios se registran e inician sesión de manera fluida y segura utilizando sus cuentas de Google existentes (protocolo OAuth 2.0).
    *   **Captura de Datos Iniciales:** Durante el primer inicio de sesión, el sistema captura automáticamente el nombre, correo electrónico e imagen de perfil del usuario desde Google.
    *   **Gestión de Sesiones Segura:** NextAuth.js se encarga de manejar las sesiones de usuario mediante JSON Web Tokens (JWT), asegurando que las interacciones subsecuentes estén autenticadas.
    *(Equivalente en Laravel: Uso de Laravel Socialite para OAuth con Google, y el sistema de autenticación integrado para gestionar usuarios y sesiones.)*

3.  **Gestión de Perfil de Usuario:**
    *   **Requisito de Perfil Completo:** Antes de poder participar en cualquier rifa, los usuarios deben completar su perfil con información adicional que no se obtiene de Google.
    *   **Campos Adicionales:** Estos campos incluyen apellido, número de teléfono de contacto y un número de identificación nacional (cédula o DNI). Esta información es vital para la verificación y entrega de premios.
    *   **Actualización de Perfil:** Los usuarios pueden modificar esta información adicional en cualquier momento a través de la página de su perfil. El nombre y correo electrónico (obtenidos de Google) generalmente no son editables directamente en la plataforma.
    *(Equivalente en Laravel: Un `UserProfileController` que maneja la visualización y actualización de un modelo `User` extendido con campos personalizados.)*

4.  **Proceso de Participación en Rifas y Registro de Pagos:**
    *   **Selección de Cantidad de Números:** En la página de una rifa específica, el usuario decide cuántos boletos desea adquirir para esa rifa.
    *   **Generación Aleatoria de Números:** Una vez especificada la cantidad, el sistema genera automáticamente y de forma aleatoria los números de boleto correspondientes (por ejemplo, si compra 3 boletos, obtiene 3 números únicos entre 1 y 900). Estos números se muestran al usuario.
    *   **Cálculo del Monto Total:** El sistema calcula el precio total basado en la cantidad de boletos y el precio unitario.
    *   **Selección de Método de Pago:** El usuario elige entre los métodos de pago configurados:
        *   **Pago Móvil (Venezuela):** Se proporcionan los datos bancarios para la transferencia.
        *   **Criptomoneda (USDT - Red TRC20):** Se muestra la dirección de la billetera para el depósito de USDT.
        *   **Zinli:** Se facilita el correo electrónico asociado a la cuenta Zinli para el envío del dinero.
    *   **Registro de Referencia de Pago:** Tras realizar el pago por el canal externo elegido, el usuario debe regresar a la plataforma e ingresar los detalles de la transacción (ej., número de referencia de Pago Móvil, Hash de transacción de cripto, ID de transacción o nota de Zinli) y el monto pagado.
    *   **Creación de Boletos "Pendientes":** Al enviar esta información, se crea un registro en la tabla `Boletos` asociando los números generados al usuario y la rifa, con un estado de pago "pendiente".
    *(Equivalente en Laravel: Un `RaffleParticipationController` o `TicketController` que maneja la lógica de negocio, interactuando con modelos `Ticket` y `User`. La selección de pago podría ser parte de un flujo de "checkout".)*
    *   **Verificación de Pago (Manual):** Es importante destacar que el sistema actual registra la intención de pago y los datos proporcionados por el usuario. La verificación real del pago (confirmar que el dinero fue recibido) es un proceso manual que realizaría un administrador fuera del sistema. Tras la verificación, el estado del boleto se cambiaría manualmente en la base de datos a "pagado" o "verificado".

5.  **Páginas Informativas y de Usuario:**
    *   **Reglas de Participación:** Una página estática que detalla los términos y condiciones para participar en las rifas, requisitos de edad, y el proceso general.
    *   **Lista de Ganadores:** Una página que muestra (actualmente con datos de ejemplo) los ganadores de rifas anteriores, incluyendo el nombre de la rifa, el nombre del ganador, el número ganador y el premio.
    *   **Interfaz de Usuario Moderna y Responsiva:** La aplicación está diseñada para ser visualmente agradable y fácil de navegar en computadoras de escritorio, tabletas y dispositivos móviles.

## Configuración del Proyecto

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos

*   [Node.js](https://nodejs.org/) (versión 18.x o superior recomendada)
*   [npm](https://www.npmjs.com/) o [Yarn](https://yarnpkg.com/)
*   Un servidor de base de datos MySQL accesible.
*   Credenciales de Google Cloud Console para OAuth 2.0.

### Instalación

1.  **Clona el repositorio (Como `git clone`):**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_DIRECTORIO_DEL_PROYECTO>
    ```

2.  **Instala las dependencias (Como `composer install`):**
    ```bash
    npm install
    # o
    yarn install
    ```

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto (análogo al `.env` de Laravel). **Nunca subas este archivo a tu repositorio Git.**

```env
# NextAuth (Google OAuth) - Similar a las credenciales de Socialite
NEXTAUTH_URL=http://localhost:9002 # URL base de tu aplicación (ajusta para producción)
NEXTAUTH_SECRET= # Genera una clave secreta: openssl rand -hex 32 (Como APP_KEY)
GOOGLE_CLIENT_ID=TU_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=TU_GOOGLE_CLIENT_SECRET

# Base de Datos MySQL - Similar a la configuración DB_* en Laravel
DB_HOST=TU_HOST_MYSQL
DB_DATABASE=TU_NOMBRE_DE_BASE_DE_DATOS
DB_USER=TU_USUARIO_MYSQL
DB_PASSWORD=TU_CONTRASEÑA_MYSQL
DB_PORT=3306 # Puerto de MySQL (usualmente 3306)

# Genkit (Opcional si no se usa GenAI activamente)
# GOOGLE_API_KEY=TU_GOOGLE_AI_STUDIO_API_KEY (si habilitas Genkit)
```

**Importante:**
*   Para `NEXTAUTH_URL`, usa `http://localhost:9002` para desarrollo local. En producción, será la URL de tu sitio desplegado.
*   `NEXTAUTH_SECRET` es crucial para la seguridad de las sesiones.
*   Obtén `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` desde [Google Cloud Console](https://console.cloud.google.com/) configurando un cliente OAuth 2.0.
    *   **Orígenes de JavaScript autorizados:** Debe incluir `http://localhost:9002` (para desarrollo) y la URL de tu sitio en producción.
    *   **URIs de redirección autorizados:** Debe incluir `http://localhost:9002/api/auth/callback/google` (para desarrollo) y `TU_URL_DE_PRODUCCION/api/auth/callback/google`.

### Configuración de la Base de Datos

Asegúrate de que tu servidor MySQL esté en ejecución y accesible. Crea las siguientes tablas en tu base de datos (esto es como ejecutar `php artisan migrate` pero de forma manual):

1.  **Tabla `Usuarios`**:
    ```sql
    CREATE TABLE Usuarios (
        id_usuario INT AUTO_INCREMENT PRIMARY KEY,
        google_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        nombre VARCHAR(255),
        apellido VARCHAR(255),
        telefono VARCHAR(50),
        numero_id VARCHAR(50), -- Cédula o ID nacional
        imagen_perfil TEXT,    -- URL de la imagen de perfil
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    ```

2.  **Tabla `Rifas`**:
    ```sql
    CREATE TABLE Rifas (
        id_rifa INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        foto_url VARCHAR(2048),
        data_ai_hint VARCHAR(100), -- Sugerencia para búsqueda de imágenes AI
        precio_boleto DECIMAL(10, 2) NOT NULL,
        estado VARCHAR(20) DEFAULT 'activa', -- Ej: 'activa', 'finalizada', 'cancelada'
        fecha_fin DATETIME,
        max_numeros INT DEFAULT 900,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    ```

3.  **Tabla `Boletos`**:
    ```sql
    CREATE TABLE Boletos (
        id_boleto INT AUTO_INCREMENT PRIMARY KEY,
        id_rifa INT NOT NULL,
        id_usuario INT NOT NULL,
        numeros_comprados JSON NOT NULL, -- Almacena un array de números [123, 456, ...]
        cantidad_numeros INT NOT NULL,
        metodo_pago VARCHAR(50) NOT NULL, -- Ej: 'Pago Movil', 'Criptomoneda', 'Zinli'
        estado_pago VARCHAR(20) DEFAULT 'pendiente', -- Ej: 'pendiente', 'pagado', 'verificado', 'fallido'
        fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_rifa) REFERENCES Rifas(id_rifa),
        FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
    );
    ```

## Cómo Ejecutar la Aplicación

1.  **Inicia el servidor de desarrollo (Como `php artisan serve` o `npm run dev` en un proyecto Laravel con Vite):**
    ```bash
    npm run dev
    # o
    yarn dev
    ```
    La aplicación estará disponible en `http://localhost:9002` (o el puerto que hayas configurado).

2.  **(Opcional) Si usas Genkit para funciones de IA (Como ejecutar un worker de colas o un servicio separado):**
    En una terminal separada, ejecuta:
    ```bash
    npm run genkit:dev
    ```

## Estructura del Proyecto

Una visión general de los directorios clave, con analogías a Laravel:

*   `public/`: Archivos estáticos (Similar al directorio `public` de Laravel).
*   `src/`: Código fuente principal de la aplicación (Todo lo que usualmente está en `app/`, `resources/`, `routes/` en Laravel).
    *   `ai/`: Configuración y flujos de Genkit (Podría ser un directorio de `Services` o `Jobs` relacionados con IA).
        *   `flows/`: Lógica de los flujos de IA.
        *   `genkit.ts`: Configuración global de Genkit.
    *   `app/`: Rutas de la aplicación (App Router de Next.js). Es el corazón del enrutamiento y renderizado de páginas, combinando conceptos de `routes/web.php` y `Controllers` que retornan vistas.
        *   `api/`: Rutas de API (backend) (Similar a `routes/api.php` en Laravel).
            *   `auth/[...nextauth]/route.ts`: Manejador de NextAuth.js (Como las rutas de autenticación de Laravel Breeze/Jetstream).
            *   `profile/route.ts`: API para actualizar perfil (Como un `ProfileController` con método `update`).
            *   `raffles/participate/[id]/route.ts`: API para participar en rifas (Como un `TicketController` con método `store`).
        *   `(pages)/`: Directorios para las diferentes páginas/vistas de la aplicación. Cada directorio con un `page.tsx` es una ruta accesible.
            *   `profile/page.tsx`: Vista y lógica del perfil de usuario.
            *   `raffles/[id]/page.tsx`: Vista detallada de una rifa.
        *   `globals.css`: Estilos globales (Similar a `app.css` o configuración de Tailwind en Laravel).
        *   `layout.tsx`: Layout principal de la aplicación (Análogo al `layouts/app.blade.php` de Laravel).
        *   `page.tsx`: Página de inicio (Como la vista para la ruta `/`).
    *   `components/`: Componentes React reutilizables (Como componentes Blade o Vue/React en `resources/js/components`).
        *   `auth/`: Componentes de autenticación (botones de login/logout).
        *   `layout/`: Componentes de estructura (Header, Footer).
        *   `profile/`: Componentes para la página de perfil (ej. `ProfileForm.tsx`).
        *   `raffles/`: Componentes para mostrar y participar en rifas.
        *   `ui/`: Componentes de UI de ShadCN (Button, Card, Input, etc.).
    *   `hooks/`: Hooks personalizados de React (Funcionalidad específica de React, sin un análogo directo en Laravel puro, pero podrían ser `Traits` o `Helpers` en PHP).
    *   `lib/`: Utilidades y lógica central (Similar a directorios `app/Services`, `app/Helpers`, `config/`).
        *   `auth.ts`: Configuración de NextAuth.js (Como `config/auth.php` o configuración de servicios de autenticación).
        *   `db.ts`: Lógica de conexión y consulta a la base de datos (Podría ser un `DatabaseService` o donde configurarías Eloquent).
        *   `utils.ts`: Funciones de utilidad general.
    *   `providers/`: Proveedores de contexto React (Específico de React para gestión de estado global, como `SessionProvider`).
    *   `types/`: Definiciones de tipos TypeScript (En PHP, esto se manejaría con type hinting, clases DTO, o PHPDoc).
*   `.env.local`: Variables de entorno (NO versionar) (Igual que `.env` en Laravel).
*   `next.config.ts`: Configuración de Next.js (No hay un archivo único equivalente en Laravel, partes estarían en `config/app.php`, `webpack.mix.js`, etc.).
*   `package.json`: Dependencias y scripts del proyecto (Como `composer.json` y los scripts de `composer.json`).
*   `tailwind.config.ts`: Configuración de Tailwind CSS (Igual que `tailwind.config.js` en un proyecto Laravel con Tailwind).
*   `components.json`: Configuración de ShadCN/UI.

## Autenticación

La autenticación se maneja con NextAuth.js, utilizando el proveedor de Google OAuth.

*   Los usuarios inician sesión a través de su cuenta de Google.
*   La información del usuario (ID de Google, email, nombre, imagen) se almacena/actualiza en la tabla `Usuarios` de MySQL.
*   Los datos adicionales del perfil (apellido, teléfono, ID) se recopilan después del primer inicio de sesión y se guardan en la misma tabla `Usuarios`.
*   Las sesiones se gestionan mediante JWT (JSON Web Tokens), que NextAuth.js maneja internamente.

*(Conceptualmente, NextAuth.js actúa como un "Authentication Guard" y "Socialite" combinados, interactuando con el modelo `User` (nuestra tabla `Usuarios`)).*

## Base de Datos

Se utiliza una base de datos MySQL para persistir los datos.

*   **Conexión:** Se usa `serverless-mysql` para una gestión eficiente de las conexiones. No es un ORM como Eloquent; las consultas se escriben en SQL puro.
*   **Consultas:** El archivo `src/lib/db.ts` exporta una función `query` para interactuar con la base de datos. Esto es similar a usar `DB::select(...)` o `DB::statement(...)` en Laravel cuando no se usa Eloquent.

### Esquema de Tablas

Consulta la sección [Configuración de la Base de Datos](#configuración-de-la-base-de-datos) para ver los scripts SQL de creación de tablas (análogo a los archivos de migración).

## Despliegue

La aplicación está configurada para ser desplegada en plataformas como Netlify, que soportan aplicaciones Next.js.

*   **Comando de Build (Como `npm run prod` en Laravel con Vite/Mix):** `npm run build`
*   **Directorio de Publicación (Como el directorio `public` tras el build):** `.next`
*   **Variables de Entorno en Producción:** Asegúrate de configurar todas las variables de entorno necesarias (definidas en `.env.local`) en la configuración de tu proveedor de hosting (e.g., panel de Netlify). Esto es crucial, igual que en Laravel.
*   **Acceso a la Base de Datos:** Tu base de datos MySQL debe ser accesible desde los servidores de tu proveedor de hosting. Podría ser necesario configurar listas blancas de IP en tu servidor MySQL.

## Funcionalidades Futuras (Ideas)

*   **Panel de Administración (Como "Nova" o un Admin Panel custom):** Para crear/gestionar rifas, ver usuarios, gestionar pagos.
*   **Verificación de Pagos Automatizada:** Integración real con pasarelas o sistemas de confirmación de pagos.
*   **Notificaciones (Como el sistema de "Notifications" de Laravel):** Avisos a usuarios sobre nuevas rifas, resultados, etc.
*   **Sorteo de Ganadores:** Implementar la lógica para seleccionar aleatoriamente a los ganadores.
*   **Internacionalización (i18n) (Como los archivos de idioma de Laravel):** Soportar múltiples idiomas.
*   **Mejoras de SEO.**
*   **Integración más profunda de Genkit:** Para generación de descripciones de rifas, imágenes de premios, etc.

---

¡Gracias por usar y explorar Rifa Facil! Si tienes experiencia con Laravel, esperamos que estas analogías te ayuden a navegar el código y los conceptos de esta aplicación Next.js.

