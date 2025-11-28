# TiendaApiYCliente

Proyecto de ejemplo para la asignatura — Tienda web (API + cliente).

## Descripción
TiendaApiYCliente es una tienda de coches de ejemplo que integra una API muy sencilla en PHP con un cliente web en HTML y JavaScript. El propósito del proyecto es practicar la lectura y escritura de datos en formato JSON, el uso de peticiones HTTP desde el cliente y la persistencia básica en el navegador mediante localStorage. Está pensado para ejecutarse localmente con XAMPP y se entrega como ejercicio de 2º DAW.

## Tecnologías
- Frontend: HTML, CSS, JavaScript (sin frameworks)
- Backend: PHP (scripts en la carpeta `php`)
- Datos: JSON (`tienda.json`, `usuarios.json`)

## Cómo ejecutar
1. Copia la carpeta del proyecto en el directorio público de XAMPP (por ejemplo: C:\xampp\htdocs\TiendaApiYCliente).
2. Arranca Apache desde el panel de control de XAMPP.
3. Abre en el navegador: `http://localhost/TiendaApiYCliente/login.html`.

## Credenciales de prueba
Hay dos usuarios de ejemplo disponibles debajo del formulario de login:
- admin / admin123
- user / user123

## Estructura y pruebas básicas
- `tienda.json`: datos de la tienda (categorías, productos e imágenes).
- `usuarios.json`: usuarios para autenticación contra `php/login.php`.
- localStorage: al iniciar sesión la tienda se guarda en la entrada `store`. Si modificas `tienda.json` y no ves los cambios en el frontend, borra la entrada `store` del localStorage o cierra la sesión para forzar la recarga.

Páginas principales:
- `login.html`: pantalla de acceso
- `dashboard.html`: destacados y navegación a categorías
- `categories.html`: listado filtrado por categoría
- `product.html`: ficha de producto
- `cart.html`: vista del carrito
