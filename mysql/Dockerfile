# Usa la imagen oficial de MySQL de Docker Hub
FROM mysql:latest

# Establece las variables de entorno para la configuración de MySQL
ENV MYSQL_ROOT_PASSWORD=admin
ENV MYSQL_ALLOW_EMPTY_PASSWORD=yes
ENV MYSQL_RANDOM_ROOT_PASSWORD=no

# Copia los scripts SQL de inicialización a la carpeta de inicio de MySQL
COPY ./init.sh /init.sh
#COPY ./init.sh /docker-entrypoint-initdb.d/
#COPY ./init.sql /docker-entrypoint-initdb.d/
COPY ./product_catalog.sql /docker-entrypoint-initdb.d/
COPY ./purchase_orders.sql /docker-entrypoint-initdb.d/

# Convertir los finales de línea a formato Unix (LF)
#RUN sed -i 's/\r$//'  ./init.sh /init.sh


# Concede permisos de ejecución al script init.sh
RUN chmod +x /init.sh
#RUN chmod +x /docker-entrypoint-initdb.d/init.sql
RUN chmod +x /docker-entrypoint-initdb.d/product_catalog.sql
RUN chmod +x /docker-entrypoint-initdb.d/purchase_orders.sql
# Expone el puerto 3306 (el puerto predeterminado de MySQL)
EXPOSE 3306

# Configura el punto de entrada y el comando predeterminado
ENTRYPOINT ["docker-entrypoint.sh"]

# Ejecuta el script para configurar MySQL
RUN /init.sh

# Ejecutar el script al iniciar el contenedor
#CMD ["/bin/bash", "/init.sh /init.sh"]

CMD ["mysqld"]


