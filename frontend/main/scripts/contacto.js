// Manejo del formulario de contacto
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Obtener valores del formulario
            const nombre = document.getElementById('nombre').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();
            const autorizacion = document.getElementById('autorizacion').checked;

            // Validar que todos los campos estén completos
            if (!nombre || !telefono || !correo || !mensaje) {
                alert('Por favor, completa todos los campos requeridos');
                return;
            }

            // Validar autorización
            if (!autorizacion) {
                alert('Debes autorizar el tratamiento de datos para continuar');
                return;
            }

            // Crear objeto con los datos
            const datosContacto = {
                nombre,
                telefono,
                correo,
                mensaje,
                autorizacion
            };

            try {
                // Aquí puedes agregar la URL de tu backend para enviar el formulario
                // Por ahora, solo mostramos un mensaje de éxito
                console.log('Datos del formulario:', datosContacto);
                
                alert('¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.');
                
                // Limpiar el formulario
                form.reset();
                
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                alert('Hubo un error al enviar el mensaje. Intenta de nuevo.');
            }
        });
    }
});

