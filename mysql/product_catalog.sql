-- Crear la base de datos 'product_catalogo' si no existe
CREATE DATABASE IF NOT EXISTS product_catalog;

-- Usar la base de datos 'product_catalogo'
USE product_catalog;

-- Crear la tabla 'products'
CREATE TABLE IF NOT EXISTS products (
    id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200),
    description TEXT,
    price DECIMAL(8,2),
	quantity BIGINT(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear la tabla 'images'
CREATE TABLE IF NOT EXISTS images (
    id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    path VARCHAR(200),
    product_id BIGINT(20) UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
);



-- Índice para la columna 'product_id' en la tabla 'images'
CREATE INDEX idx_product_id ON images (product_id);
