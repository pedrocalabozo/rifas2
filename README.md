
# Rifa Facil - Plataforma de Rifas Online

¡Bienvenido a Rifa Facil! Esta es una aplicación web moderna construida con Next.js que permite a los usuarios participar en rifas y ganar premios. Cuenta con autenticación de usuarios, gestión de perfiles, múltiples métodos de pago y una interfaz de usuario amigable.

## Tabla de Contenidos

1.  [Tecnologías Utilizadas](#tecnologías-utilizadas)
2.  [Características Principales](#características-principales)
3.  [Configuración del Proyecto](#configuración-del-proyecto)
    *   [Prerrequisitos](#prerrequisitos)
    *   [Instalación](#instalación)
    *   [Variables de Entorno](#variables-de-entorno)
    *   [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
4.  [Cómo Ejecutar la Aplicación](#cómo-ejecutar-la-aplicación)
5.  [Estructura del Proyecto](#estructura-del-proyecto)
6.  [Autenticación](#autenticación)
7.  [Base de Datos](#base-de-datos)
    *   [Esquema de Tablas](#esquema-de-tablas)
8.  [Despliegue](#despliegue)
9.  [Funcionalidades Futuras (Ideas)](#funcionalidades-futuras-ideas)

## Tecnologías Utilizadas

*   **Framework Frontend/Backend:** [Next.js](https://nextjs.org/) (con App Router)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **UI:** [React](https://reactjs.org/)
*   **Componentes UI:** [ShadCN/UI](https://ui.shadcn.com/)
*   **Estilos CSS:** [Tailwind CSS](https://tailwindcss.com/)
*   **Autenticación:** [NextAuth.js](https://next-auth.js.org/) (con Google Provider)
*   **Base de Datos:** [MySQL](https://www.mysql.com/)
*   **ORM/Acceso a BD:** [serverless-mysql](https://github.com/serverless-heaven/serverless-mysql)
*   **Inteligencia Artificial (GenAI):** [Genkit (Google AI)](https://firebase.google.com/docs/genkit) - _Configurado pero no implementado activamente en las características actuales._
*   **Gestión de Estado (UI):** React Hooks (useState, useEffect), Context API (implícita en NextAuth SessionProvider)
*   **Validación de Formularios:** [React Hook Form](https://react-hook-form.com/) con [Zod](https://zod.dev/)

## Características Principales

*   **Listado de Rifas Activas:** Los usuarios pueden ver las rifas disponibles con detalles como título, descripción, precio del boleto e imagen.
*   **Participación en Rifas:**
    *   Selección de cantidad de números.
    *   Generación aleatoria de números de boleto.
    *   Múltiples métodos de pago (Pago Móvil, Criptomoneda USDT-TRC20, Zinli).
*   **Autenticación de Usuarios:**
    *   Inicio de sesión seguro con cuentas de Google (OAuth 2.0).
*   **Gestión de Perfil de Usuario:**
    *   Los usuarios deben completar su perfil (apellido, teléfono, número de ID) para participar.
    *   Actualización de la información del perfil.
*   **Páginas Informativas:**
    *   Reglas de participación.
    *   Lista de ganadores (actualmente con datos de ejemplo).
*   **Diseño Responsivo:** Interfaz adaptable a diferentes tamaños de pantalla.

## Configuración del Proyecto

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos

*   [Node.js](https://nodejs.org/) (versión 18.x o superior recomendada)
*   [npm](https://www.npmjs.com/) o [Yarn](https://yarnpkg.com/)
*   Un servidor de base de datos MySQL accesible.
*   Credenciales de Google Cloud Console para OAuth 2.0.

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_DIRECTORIO_DEL_PROYECTO>
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    # o
    yarn install
    ```

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto y configura las siguientes variables. **Nunca subas este archivo a tu repositorio Git.**

```env
# NextAuth (Google OAuth)
NEXTAUTH_URL=http://localhost:9002 # URL base de tu aplicación (ajusta para producción)
NEXTAUTH_SECRET= # Genera una clave secreta: openssl rand -hex 32
GOOGLE_CLIENT_ID=TU_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=TU_GOOGLE_CLIENT_SECRET

# Base de Datos MySQL
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

Asegúrate de que tu servidor MySQL esté en ejecución y accesible. Crea las siguientes tablas en tu base de datos:

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

1.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    # o
    yarn dev
    ```
    La aplicación estará disponible en `http://localhost:9002` (o el puerto que hayas configurado).

2.  **(Opcional) Si usas Genkit para funciones de IA:**
    En una terminal separada, ejecuta:
    ```bash
    npm run genkit:dev
    ```

## Estructura del Proyecto

Una visión general de los directorios clave:

*   `public/`: Archivos estáticos.
*   `src/`: Código fuente principal de la aplicación.
    *   `ai/`: Configuración y flujos de Genkit.
        *   `flows/`: Lógica de los flujos de IA (actualmente no en uso activo).
        *   `genkit.ts`: Configuración global de Genkit.
    *   `app/`: Rutas de la aplicación (App Router de Next.js).
        *   `api/`: Rutas de API (backend).
        *   `(pages)/`: Directorios para las diferentes páginas de la aplicación (e.g., `profile`, `raffles`).
        *   `globals.css`: Estilos globales y configuración de tema de Tailwind/ShadCN.
        *   `layout.tsx`: Layout principal de la aplicación.
        *   `page.tsx`: Página de inicio.
    *   `components/`: Componentes React reutilizables.
        *   `auth/`: Componentes relacionados con la autenticación (botones de login/logout).
        *   `layout/`: Componentes de estructura (Header, Footer).
        *   `profile/`: Componentes para la página de perfil.
        *   `raffles/`: Componentes para mostrar y participar en rifas.
        *   `ui/`: Componentes de UI de ShadCN (Button, Card, Input, etc.).
    *   `hooks/`: Hooks personalizados de React (e.g., `use-toast`, `use-mobile`).
    *   `lib/`: Utilidades y lógica central.
        *   `auth.ts`: Configuración de NextAuth.js.
        *   `db.ts`: Lógica de conexión y consulta a la base de datos.
        *   `utils.ts`: Funciones de utilidad general (e.g., `cn` para clases).
    *   `providers/`: Proveedores de contexto (e.g., `SessionProvider`).
    *   `types/`: Definiciones de tipos TypeScript.
*   `.env.local`: Variables de entorno (NO versionar).
*   `next.config.ts`: Configuración de Next.js.
*   `package.json`: Dependencias y scripts del proyecto.
*   `tailwind.config.ts`: Configuración de Tailwind CSS.
*   `components.json`: Configuración de ShadCN/UI.

## Autenticación

La autenticación se maneja con NextAuth.js, utilizando el proveedor de Google OAuth.

*   Los usuarios inician sesión a través de su cuenta de Google.
*   La información del usuario (ID de Google, email, nombre, imagen) se almacena en la tabla `Usuarios`.
*   Los datos adicionales del perfil (apellido, teléfono, ID) se recopilan después del primer inicio de sesión.
*   Las sesiones se gestionan mediante JWT (JSON Web Tokens).

## Base de Datos

Se utiliza una base de datos MySQL para persistir los datos.

*   **Conexión:** Se usa `serverless-mysql` para una gestión eficiente de las conexiones, especialmente en entornos serverless.
*   **Consultas:** El archivo `src/lib/db.ts` exporta una función `query` para interactuar con la base de datos.

### Esquema de Tablas

Consulta la sección [Configuración de la Base de Datos](#configuración-de-la-base-de-datos) para ver los scripts SQL de creación de tablas.

## Despliegue

La aplicación está configurada para ser desplegada en plataformas como Netlify.

*   **Comando de Build:** `npm run build`
*   **Directorio de Publicación:** `.next`
*   **Variables de Entorno en Producción:** Asegúrate de configurar todas las variables de entorno necesarias (definidas en `.env.local`) en la configuración de tu proveedor de hosting (e.g., panel de Netlify). Esto incluye las credenciales de NextAuth y de la base de datos.
*   **Acceso a la Base de Datos:** Tu base de datos MySQL debe ser accesible desde los servidores de tu proveedor de hosting. Podría ser necesario configurar listas blancas de IP en tu servidor MySQL.

## Funcionalidades Futuras (Ideas)

*   **Panel de Administración:** Para crear/gestionar rifas, ver usuarios, gestionar pagos.
*   **Verificación de Pagos:** Integración real con pasarelas o sistemas de confirmación de pagos.
*   **Notificaciones:** Avisos a usuarios sobre nuevas rifas, resultados, etc.
*   **Sorteo de Ganadores:** Implementar la lógica para seleccionar aleatoriamente a los ganadores.
*   **Internacionalización (i18n):** Soportar múltiples idiomas.
*   **Mejoras de SEO.**
*   **Integración más profunda de Genkit:** Para generación de descripciones de rifas, imágenes de premios, etc.

---

¡Gracias por usar y explorar Rifa Facil!
