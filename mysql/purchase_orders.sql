-- Crear la base de datos 'purchase_orders' si no existe
CREATE DATABASE IF NOT EXISTS purchase_orders;

-- Usar la base de datos 'purchase_orders'
USE purchase_orders;

-- Crear la tabla 'purchase_orders'
CREATE TABLE IF NOT EXISTS orders (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    date DATETIME(6),
    status VARCHAR(50) COLLATE utf8mb4_general_ci,
    delivery_address VARCHAR(255) COLLATE utf8mb4_general_ci,
    payment_method VARCHAR(50) COLLATE utf8mb4_general_ci,
    user_id INT(11)
);

-- Crear la tabla 'order_details'
CREATE TABLE IF NOT EXISTS order_details (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT(11),
    product_id INT(11),
    quantity INT(11),
	FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Índice para la columna 'order_id' en la tabla 'order_details'
CREATE INDEX idx_order_id ON order_details (order_id);

GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;