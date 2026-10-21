# VÉRA — El Corazón (prototipo inicial)

## Qué es
Una base inicial de la interfaz de VÉRA, preparada para probar desde un navegador:
- El Corazón en formato de novela interactiva (por ahora guarda tus narraciones, no genera respuestas).
- Archivo automático de escenas en el almacenamiento local del navegador.
- Propuestas de recuerdos que requieren aprobación.
- Notas del canon.
- Exportación e importación manual de una copia de seguridad JSON.
- Diseño adaptable a pantallas de Android.

## Qué NO incluye todavía
- No contiene una IA conectada.
- No tiene sincronización en la nube.
- No es un APK.
- No hay publicaciones ni mensajes conectados a redes sociales reales.
- Los datos se guardan en el navegador/dispositivo. Borrar los datos del navegador puede borrarlos; exportá respaldos regularmente.

## Cómo empezar desde Android
1. Descomprimí esta carpeta en el teléfono.
2. Abrí `index.html` con el navegador para revisar la interfaz. Algunas funciones de instalación y modo sin conexión requieren servir el sitio por HTTPS.
3. Para instalarla como PWA, subí estos archivos a un alojamiento estático HTTPS compatible. Una opción habitual es GitHub Pages, aunque requiere crear una cuenta y seguir su configuración.
4. Antes de agregar IA, primero probá guardar escenas, proponer/aprobar recuerdos y exportar/importar el respaldo.

## Sobre la IA y las claves
No pegues claves API en `app.js`, `index.html` ni ningún archivo público. Una conexión real a IA debe pasar por un backend seguro o un proveedor que gestione secretos del lado del servidor. Las claves API pueden generar cargos y deben protegerse.

## Memoria y privacidad
- `localStorage` es adecuado solo para un prototipo pequeño. Para una historia grande, conviene migrar a IndexedDB y diseñar exportaciones y copias de seguridad.
- La exportación contiene texto personal de tu historia. Guardala en un lugar privado.
- La nube gratuita tiene cuotas y condiciones que pueden cambiar; no prometemos almacenamiento ilimitado.
