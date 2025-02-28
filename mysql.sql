-- Crear la base de datos
DROP DATABASE pasteleria_rhenania;
CREATE DATABASE IF NOT EXISTS pasteleria_rhenania;
USE pasteleria_rhenania;

-- Tabla para almacenar los refrigeradores
CREATE TABLE IF NOT EXISTS refrigeradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

-- Tabla para almacenar los datos de temperatura
CREATE TABLE IF NOT EXISTS datos_temperatura (
    id INT AUTO_INCREMENT PRIMARY KEY,
    refrigerador_id INT NOT NULL,
    uid VARCHAR(255) NOT NULL,
    fecha DATETIME NOT NULL,
    temperatura FLOAT NOT NULL,
    ip VARCHAR(255) NOT NULL,
    equipo VARCHAR(255) NOT NULL,
    FOREIGN KEY (refrigerador_id) REFERENCES refrigeradores(id)
);

-- Tabla para almacenar los usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    usuario VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL
);

-- Tabla para almacenar la configuración del dispositivo
CREATE TABLE IF NOT EXISTS configuracion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uid VARCHAR(255) NOT NULL UNIQUE,
    wifi_ssid VARCHAR(255) NOT NULL,
    wifi_password VARCHAR(255) NOT NULL,
    server_ip VARCHAR(255) NOT NULL,
    medicion_intervalo INT NOT NULL
);

-- Insertar datos iniciales (opcional)
INSERT INTO refrigeradores (nombre) VALUES ('Refrigerador 1'), ('Refrigerador 2');
INSERT INTO usuarios (nombre, apellido, usuario, email, contrasena) VALUES
('Admin', 'User', 'admin', 'admin@example.com', 'admin123'); -- Cambia la contraseña por una segura
INSERT INTO configuracion (uid, wifi_ssid, wifi_password, server_ip, medicion_intervalo) VALUES
('001', 'MiWiFi', 'MiContraseña', '192.168.1.100', 5000); -- Ajusta los valores según tu configuración

-- Insertar datos para el Refrigerador 1 (id = 1)
INSERT INTO datos_temperatura (refrigerador_id, uid, fecha, temperatura, ip, equipo) VALUES
(1, 'UID001', '2023-10-01 08:00:00', 4.5, '192.168.1.10', 'Refrigerador'),
(1, 'UID001', '2023-10-01 09:00:00', 4.3, '192.168.1.10', 'Refrigerador'),
(1, 'UID001', '2023-10-01 10:00:00', 4.7, '192.168.1.10', 'Refrigerador');

-- Insertar datos para el Refrigerador 2 (id = 2)
INSERT INTO datos_temperatura (refrigerador_id, uid, fecha, temperatura, ip, equipo) VALUES
(2, 'UID002', '2023-10-01 08:00:00', -18.0, '192.168.1.11', 'Congelador'),
(2, 'UID002', '2023-10-01 09:00:00', -18.5, '192.168.1.11', 'Congelador'),
(2, 'UID002', '2023-10-01 10:00:00', -17.8, '192.168.1.11', 'Congelador');