-- Tabla para almacenar información de los usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE, -- ID de Google para vincular cuentas
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255), -- Nombre (puede venir de Google o ser ingresado)
    apellido VARCHAR(255), -- Apellido (requerido para participar)
    telefono VARCHAR(50), -- Teléfono (requerido para participar)
    numero_id VARCHAR(50), -- Cédula o número de identificación (requerido para participar)
    imagen_perfil VARCHAR(255), -- URL de la imagen de perfil (de Google)
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla para almacenar información de las rifas
CREATE TABLE IF NOT EXISTS Rifas (
    id_rifa INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    foto_url VARCHAR(255), -- URL de la imagen de la rifa
    data_ai_hint VARCHAR(255), -- Hint for AI image generation if placeholder is used
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP NULL, -- Fecha de finalización de la rifa
    precio_boleto DECIMAL(10, 2) NOT NULL,
    max_numeros INT DEFAULT 900, -- Número máximo de boletos o el número más alto a generar
    estado ENUM('activa', 'finalizada', 'cancelada') DEFAULT 'activa',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla para almacenar los boletos comprados por los usuarios
CREATE TABLE IF NOT EXISTS Boletos (
    id_boleto INT AUTO_INCREMENT PRIMARY KEY,
    id_rifa INT NOT NULL,
    id_usuario INT NOT NULL,
    numeros_comprados JSON, -- Almacena un array de números seleccionados/generados. Ej: [10, 25, 150]
    cantidad_numeros INT NOT NULL, -- Cantidad de números que representa este boleto/compra
    metodo_pago VARCHAR(50), -- Ej: 'pago_movil', 'criptomoneda', 'zinly'
    referencia_pago VARCHAR(255), -- Referencia del pago
    estado_pago ENUM('pendiente', 'pagado', 'verificando', 'fallido') DEFAULT 'pendiente',
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rifa) REFERENCES Rifas(id_rifa) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

-- Tabla para almacenar los ganadores de las rifas
CREATE TABLE IF NOT EXISTS Ganadores (
    id_ganador INT AUTO_INCREMENT PRIMARY KEY,
    id_rifa INT NOT NULL,
    id_usuario INT NOT NULL,
    id_boleto INT NOT NULL, -- El boleto específico que ganó
    numero_ganador INT, -- El número ganador (si aplica un solo número por boleto) o se puede referenciar a `Boletos.numeros_comprados`
    premio_descripcion VARCHAR(255), -- Descripción del premio ganado
    fecha_anuncio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rifa) REFERENCES Rifas(id_rifa),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_boleto) REFERENCES Boletos(id_boleto)
);

-- Índices para mejorar el rendimiento de las búsquedas comunes
CREATE INDEX idx_usuarios_email ON Usuarios(email);
CREATE INDEX idx_rifas_estado ON Rifas(estado);
CREATE INDEX idx_boletos_usuario_rifa ON Boletos(id_usuario, id_rifa);
