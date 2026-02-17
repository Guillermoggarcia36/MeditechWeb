// URLs - Endpoints
const LOGIN_URL = "http://localhost:9000/users/login";
const CAMBIAR_CLAVE_URL = "http://localhost:9000/users/cambiar-clave";
const DASHBOARD_URL = "../../frontend/dashboard/dashboard-main.html";

//Evento para mostrar u ocultar contraseña en input
document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.getElementById('show-password');
    const passwordInput = document.getElementById('contraseña');

    togglePassword?.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type');
        passwordInput.setAttribute('type', type === 'password' ? 'text' : 'password');
        togglePassword.style.backgroundImage = type === 'password'
            ? "url('../assets/icons/hide.png')"
            : "url('../assets/icons/show.png')";
    });
});

//Funcion ingreso usuario / login
async function iniciarSesion() {
    const id_usuario = document.getElementById("id-usuario").value;
    const clave = document.getElementById("contraseña").value;

    if (!id_usuario || !clave) {
        Swal.fire('Error', 'ID y contraseña son requeridos', 'error');
        return;
    }

    try {
        const res = await fetch(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario, clave })
        });

        const data = await res.json();

        if (!res.ok) {
            Swal.fire('Error', data.message || 'Ocurrió un error al iniciar sesión', 'info');
            return;
        }

        // En caso de primer ingreso o restablecimiento pide cambio de clave
        if (data.cambio_clave) {
            await changePassword(data.usuario.id_usuario, data.token);
            localStorage.setItem("nameUser", data.usuario.nombres);
            localStorage.setItem("apellidoUser", data.usuario.apellidos);
            localStorage.setItem("token", data.token);
        } 
        else {
            console.log(data.usuario.nombres, data.usuario.apellidos);
            localStorage.setItem("nameUser", data.usuario.nombres);
            localStorage.setItem("apellidoUser", data.usuario.apellidos);
            localStorage.setItem("token", data.token);
            localStorage.setItem("idUsuario", data.usuario.id_usuario);
            Swal.fire({
                title: 'Inicio de sesión exitoso',
                text: 'Ingresando',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,               // 2 segundos
                timerProgressBar: true,
                allowOutsideClick: false,
                willOpen: () => {
                Swal.showLoading();      // opcional, muestra una animación breve
                },
            }).then(() => {
                // redirigir al cerrar el Swal (por timer o manual)
                window.location.href = DASHBOARD_URL;
            });
            }
            } catch (err) {
        console.error("Error login:", err);
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
};

// Funcion cambio de contraseña en caso tal de que sea primer ingreso
async function changePassword(id_usuario, token) {
    // Pedir nueva contraseña al usuario
    const { value: nuevaClave } = await Swal.fire({
        title: 'Cambia tu contraseña',
        icon: 'info',
        input: 'password',
        inputLabel: 'Nueva contraseña',
        inputPlaceholder: 'Ingresa tu nueva contraseña',
        inputAttributes: {
            maxlength: 20,
            autocapitalize: 'off',
            autocorrect: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Cambiar',
        cancelButtonText: 'Cancelar',
        preConfirm: (clave) => {
            if (!clave || clave.length < 6) {
                Swal.showValidationMessage('Debe tener al menos 6 caracteres');
            }
            return clave;
        },
    });

    // Si el usuario cancela o no ingresa contraseña
    if (!nuevaClave) {
        await Swal.fire({
            icon: 'info',
            title: 'Atención',
            text: 'Debes cambiar la contraseña para continuar',
        });
        return;
    }

    try {
        // Peticion al backend para actualizar la contraseña
        const res = await fetch(CAMBIAR_CLAVE_URL, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id_usuario, nuevaClave })
        });

        const data = await res.json();

        if (res.ok) {
            // Mensaje de contraseña actualizada
            await Swal.fire({
                icon: 'success',
                title: 'Contraseña actualizada',
                text: 'Serás redirigido al dashboard',
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true
            });

            localStorage.setItem("token", token);
            window.location.href = DASHBOARD_URL;
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message || 'No se pudo actualizar la contraseña'
            });
        }
    } catch (err) {
        console.error(err);
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al actualizar la contraseña'
        });
    }
}

// Evento para iniciar sesión al darle clic al boton de login
document.querySelector("#btn-login")?.addEventListener("click", iniciarSesion);

// Evento para cuando se presiona Enter ingresar
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    console.log("Presionaste Enter");
    iniciarSesion()
  }
});

document.addEventListener('DOMContentLoaded', function() {
    const fieldId = document.getElementById("idusuario");

    if (fieldId) {
        fieldId.addEventListener('input', function() {
            if (this.value.length > this.maxLength) {
                this.value = this.value.slice(0, this.maxLength);
            }
        });
    }
});

// Almacenar token
localStorage.setItem("token", data.token);

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("⚠️ No tienes sesión activa. Por favor inicia sesión.");
    window.location.href = "../index.html"; // redirige al login
    return;
  }

  // Si hay token, puedes verificarlo con el backend
  fetch("http://localhost:9000/users/verifyToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {
    if (data.valid) {
      console.log("✅ Token válido, acceso permitido");
    } else {
      alert("⛔ Sesión expirada. Inicia sesión nuevamente.");
      localStorage.removeItem("token");
      window.location.href = "../index.html";
    }
  })
  .catch(err => {
    console.error("Error verificando token:", err);
    alert("Error de conexión al servidor.");
    window.location.href = "../login.html"
  });
});