-- Recomendado: crear la base de datos y usarla
-- CREATE DATABASE learnflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE learnflow;

-- Desactivar checks mientras se crean tablas (opcional)
SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- TABLAS PRINCIPALES
-- =========================

CREATE TABLE Rol (
    idRol      INT AUTO_INCREMENT PRIMARY KEY,
    tipoRol    VARCHAR(10) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE Persona (
    idPersona       INT AUTO_INCREMENT PRIMARY KEY,
    nombreCompleto  VARCHAR(170) NOT NULL,
    fechaNacimiento DATE,
    mail            VARCHAR(80) NOT NULL,
    contrasenia     VARCHAR(10) NOT NULL,
    nit             INT,
    fotografia      VARCHAR(200),
    idRol           INT NOT NULL,
    CONSTRAINT fk_persona_rol
        FOREIGN KEY (idRol)
        REFERENCES Rol (idRol)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE Dificultad (
    idDificultad   INT AUTO_INCREMENT PRIMARY KEY,
    tipoDificultad VARCHAR(20) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE Tematica (
    idTematica   INT AUTO_INCREMENT PRIMARY KEY,
    tipoTematica VARCHAR(25) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE Curso (
    idCurso        INT AUTO_INCREMENT PRIMARY KEY,
    nombreCurso    VARCHAR(200) NOT NULL,
    resumen        VARCHAR(100),
    descripcion    VARCHAR(250) NOT NULL,
    anioProduccion INT NOT NULL,
    idDificultad   INT NOT NULL,
    idPersona      INT NOT NULL,
    idTematica     INT NOT NULL,
    CONSTRAINT fk_curso_dificultad
        FOREIGN KEY (idDificultad)
        REFERENCES Dificultad (idDificultad)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_curso_persona
        FOREIGN KEY (idPersona)
        REFERENCES Persona (idPersona)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_curso_tematica
        FOREIGN KEY (idTematica)
        REFERENCES Tematica (idTematica)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE Contenido (
    idContenido   INT AUTO_INCREMENT PRIMARY KEY,
    titulo        VARCHAR(150) NOT NULL,
    pathContenido VARCHAR(250) NOT NULL,
    descripcion   VARCHAR(250),
    idCurso       INT NOT NULL,
    CONSTRAINT fk_contenido_curso
        FOREIGN KEY (idCurso)
        REFERENCES Curso (idCurso)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE Estudiante_Curso (
    idCurso   INT NOT NULL,
    idPersona INT NOT NULL,
    PRIMARY KEY (idCurso, idPersona),
    CONSTRAINT fk_estudiante_curso_curso
        FOREIGN KEY (idCurso)
        REFERENCES Curso (idCurso)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_estudiante_curso_persona
        FOREIGN KEY (idPersona)
        REFERENCES Persona (idPersona)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE EstadoSuscripcion (
    idEstadoSuscripcion INT AUTO_INCREMENT PRIMARY KEY,
    tipoEstadoSolicitud VARCHAR(12) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE Tarifa (
    idTarifa   INT AUTO_INCREMENT PRIMARY KEY,
    tipoTarifa VARCHAR(11) NOT NULL,
    precio     DECIMAL(10,2) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE Suscripcion (
    idSuscripcion       INT AUTO_INCREMENT PRIMARY KEY,
    fechaCompra         DATE NOT NULL,
    fechaCaducidad      DATE NOT NULL,
    idEstadoSuscripcion INT NOT NULL,
    idTarifa            INT NOT NULL,
    idPersona           INT NOT NULL,
    CONSTRAINT uq_suscripcion_persona UNIQUE (idPersona),
    CONSTRAINT fk_suscripcion_estado
        FOREIGN KEY (idEstadoSuscripcion)
        REFERENCES EstadoSuscripcion (idEstadoSuscripcion)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_suscripcion_tarifa
        FOREIGN KEY (idTarifa)
        REFERENCES Tarifa (idTarifa)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_suscripcion_persona
        FOREIGN KEY (idPersona)
        REFERENCES Persona (idPersona)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE Tarjeta (
    idTarjeta        INT AUTO_INCREMENT PRIMARY KEY,
    fechaVencimiento DATE NOT NULL,
    idPersona        INT NOT NULL,
    CONSTRAINT fk_tarjeta_persona
        FOREIGN KEY (idPersona)
        REFERENCES Persona (idPersona)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB;


CREATE TABLE Bitacora (
    idBitacora  INT AUTO_INCREMENT PRIMARY KEY,
    idPersona   INT NOT NULL,
    idContenido INT NOT NULL,
    fechaVista  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idPersona) REFERENCES Persona(idPersona) ON DELETE CASCADE,
    FOREIGN KEY (idContenido) REFERENCES Contenido(idContenido) ON DELETE CASCADE
);

-- Reactivar checks
SET FOREIGN_KEY_CHECKS = 1;

ALTER TABLE Persona MODIFY contrasenia VARCHAR(60) NOT NULL;
ALTER TABLE Tarjeta MODIFY idTarjeta BIGINT NOT NULL;
ALTER TABLE Tarifa ADD COLUMN descripcion VARCHAR(200);

-- Tabla para contenido del curso
CREATE TABLE TipoContenido (
    idTipoContenido INT AUTO_INCREMENT PRIMARY KEY,
    tipoContenido   VARCHAR(50) NOT NULL
);

ALTER TABLE Contenido ADD COLUMN idTipoContenido INT;
ALTER TABLE Contenido ADD CONSTRAINT fk_contenido_tipo 
    FOREIGN KEY (idTipoContenido) REFERENCES TipoContenido(idTipoContenido);