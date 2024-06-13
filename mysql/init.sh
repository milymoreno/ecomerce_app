
# Ejecutar el primer script SQL
echo "Ejecutando el primer script SQL..."
#mysql -u root -padmin product_catalog < /docker-entrypoint-initdb.d/product_catalog.sql

# Ejecutar el segundo script SQL
echo "Ejecutando el segundo script SQL..."
#mysql -u root -padmin purchase_orders < /docker-entrypoint-initdb.d/purchase_orders.sql

echo "¡Contraseña asignada y scripts SQL ejecutados correctamente!"


