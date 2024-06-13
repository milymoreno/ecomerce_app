# Usa una imagen base de PHP 8.0.3
FROM php:8.0.3-apache
# Instalar extensiones de PHP necesarias



# Instala las dependencias necesarias para Laravel y RabbitMQ

# Instalar extensiones de PHP necesarias
RUN apt-get update && \
    apt-get install -y \
	supervisor \
    librabbitmq-dev \
    libzip-dev \
    zip \
    git && \
    docker-php-ext-install zip pdo pdo_mysql bcmath && \  
    pecl install amqp && \
    docker-php-ext-enable amqp && \
    rm -rf /var/lib/apt/lists/*
	

# Configura el servidor Apache
RUN a2enmod rewrite

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar los archivos de la aplicación al directorio raíz del servidor web
COPY . /var/www/html

# Establece permisos adecuados
RUN chown -R www-data:www-data /var/www/html

# Establecer el directorio de trabajo
WORKDIR /var/www/html

# Instalar dependencias de PHP
RUN  composer install --no-dev --optimize-autoloader


# Crear el directorio images en /var/www/html/public/storage
RUN mkdir -p /var/www/html/public/storage/images
RUN chown -R www-data:www-data /var/www/html/public/storage

# Crear el enlace simbólico
RUN php artisan storage:link


# Establecer permisos correctos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache


# Copiar el archivo de configuración de supervisord
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Exponer el puerto 8000
EXPOSE 8000

# Comando de inicio para supervisord
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

