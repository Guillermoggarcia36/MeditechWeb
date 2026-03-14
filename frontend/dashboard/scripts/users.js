// Endpoints
const API_URL = "http://localhost:9000/users";
const API_URL_RESTABLECER = "http://localhost:9000/users/restablecer-clave";
const API_URL_ORDENDESCENDENTE = "http://localhost:9000/users/orden-descendente";
const API_URL_ORDENASCENDENTE = "http://localhost:9000/users/orden-ascendente"; 

// Variables globales
let totalUsuarios = [];
let limite = 10; // usuarios por página
let desde = 0;
let paginas = 1;
let paginaActiva = 1;

// Contenedores en el DOM
const cuerpoTabla = document.getElementById("usuarios-body");
const contenedorPaginacion = document.getElementById("pages");

// Función para traer usuarios desde la API
async function traerDatos() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const usuarios = await response.json();
    totalUsuarios = usuarios;

    // Calcular número de páginas
    paginas = Math.ceil(totalUsuarios.length / limite);

    // Renderizar tabla y paginación
    cargarUsuarios();
    cargarItemPaginacion();

  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
}

// Funcion para mostrar usuarios en la tabla según la página activa
function cargarUsuarios() {
  cuerpoTabla.innerHTML = "";

  const arreglo = totalUsuarios.slice(desde, desde + limite);

  arreglo.forEach((usuario) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td class="td-idUsuario">${usuario.id_usuario}</td>
      <td>${usuario.nombres}</td>
      <td>${usuario.apellidos}</td>
      <td>${roles[usuario.id_rolFK] || "Desconocido"}</td>
      <td id="tipodocumentoData">${usuario.tipo_documento}</td>
      <td id="telefonoData">${usuario.numero_telefono}</td>
      <td id="correoData">${usuario.correo_electronico}</td>
      <td>${usuario.estado_usuario}</td>
      <td>
        <img class="edit-btn" src="../assets/icons/editar.png" alt="Editar">
        <img class="delete-btn" src="../assets/icons/borrar.png" alt="Eliminar">
      </td>
    `;
    cuerpoTabla.appendChild(fila);
  });
}

// Funcion para crear botones de paginación
function cargarItemPaginacion() {
  contenedorPaginacion.innerHTML = "";

  for (let index = 0; index < paginas; index++) {
    const btn = document.createElement("button");
    btn.className = `page-btn ${paginaActiva === index + 1 ? "active" : ""}`;
    btn.textContent = index + 1;
    btn.addEventListener("click", () => pasarPagina(index));
    contenedorPaginacion.appendChild(btn);
  }
}

//Funcion para cambiar de página
window.pasarPagina = (paginaIndex) => {
  paginaActiva = paginaIndex + 1;
  desde = limite * paginaIndex;
  cargarUsuarios();
  cargarItemPaginacion();
};

window.nextPage = () => {
  if (paginaActiva < paginas) {
    paginaActiva++;
    desde += limite;
    cargarUsuarios();
    cargarItemPaginacion();
  }
};

window.previusPage = () => {
  if (paginaActiva > 1) {
    paginaActiva--;
    desde -= limite;
    cargarUsuarios();
    cargarItemPaginacion();
  }
};

// Ejecutar al cargar la pagina
document.addEventListener("DOMContentLoaded", () => {
  traerDatos();

  // Conectar botones de paginación
  const prevBtn = document.querySelector("#previous-btn button");
  const nextBtn = document.querySelector("#next-page button");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      previusPage();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextPage();
    });
  }
});

// Variable de datos de tabla
const tbody = document.getElementById("usuarios-body");

// RolesFK de tabla ROL en BD
const roles = {
    1: "Administrativo",
    2: "Medico",
    3: "Paciente",
    4: "Enfermeria"
};

// Funcion para traducir y mostrar nombre de roles
function translateNameRol(idRol) {
    return roles[idRol] || "Desconocido";
};

// Funcion asincrona para tomar datos de formulario y mandarlo a BD
async function creationUser() {

    const newUser = {
        "id_usuario": document.getElementById("idusuario").value,
        "id_rolFK": document.getElementById("rol").value,
        "clave": document.getElementById("idusuario").value,
        "nombres": document.getElementById("nombres").value,
        "apellidos": document.getElementById("apellidos").value,
        "tipo_documento": document.getElementById("tipodocumento").value,
        "numero_telefono": document.getElementById("telefono").value,
        "correo_electronico": document.getElementById("correo").value,
        "estado_usuario": document.getElementById("checkbox").checked ? "Activo" : "Inactivo",
        "cambio_clave": "1"
    };

    console.log(newUser);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        });

        if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Usuario creado:", data.message || data);
        traerDatos();
  } catch (error) {
    console.error("Error al enviar datos:", error);
  }
};

// Evento de elemento de tabla para traer datos de usuario a formulario - Que cuando se le de al boton del lapiz editar traiga los datos a formulario
tbody.addEventListener("click", (e) => {
  if (e.target && e.target.alt === "Editar") {
    const fila = e.target.closest("tr");
    const celdas = fila.querySelectorAll("td");

    const userContainer = document.getElementById("adduser-container");
    const overlay = document.getElementById("overlay");
    const closeAddUser = document.getElementById("cancel");


    // Relación entre nombre del rol y su ID
    const rolMap = {
      "Administrativo": "1",
      "Medico": "2",
      "Paciente": "3",
      "Enfermeria": "4"
    };

    // Capturar datos de la fila
    const userInfo = {
      "id_usuario": celdas[0].textContent,
      "nombres": celdas[1].textContent,
      "apellidos": celdas[2].textContent,
      "id_rolFK": celdas[3].textContent,
      "tipo_documento": celdas[4].textContent,
      "numero_telefono": celdas[5].textContent,
      "correo_electronico": celdas[6].textContent,
      "estado_usuario": celdas[7].textContent
    };

    const iduserForm = document.getElementById("idusuario");
    iduserForm.readOnly = true;
    iduserForm.style.cursor = "no-drop";
    iduserForm.style.backgroundColor = "#00000048";
    iduserForm.disabled = true;

    // Rellenar formulario con los datos del usuario seleccionado
    document.getElementById("idusuario").value = userInfo.id_usuario;
    document.getElementById("nombres").value = userInfo.nombres;
    document.getElementById("apellidos").value = userInfo.apellidos;
    document.getElementById("rol").value = rolMap[userInfo.id_rolFK] || "";
    document.getElementById("tipodocumento").value = userInfo.tipo_documento;
    document.getElementById("telefono").value = userInfo.numero_telefono;
    document.getElementById("correo").value = userInfo.correo_electronico;
    document.getElementById("checkbox").checked = (userInfo.estado_usuario === "Activo");

    // Mostrar ventana emergente
    userContainer.style.display = "grid";
    userContainer.style.animation = "fadeIn 0.65s";
    overlay.classList.add("active");

    const restablecerBtn = document.getElementById("restablecer");
    restablecerBtn.style.display = "block";

    const btnSubmit = document.getElementById("submit");
    btnSubmit.style.display = "none";

    const saveBtn = document.getElementById("save-changes");
    saveBtn.style.display = "block";

    // Evento para restablecer contraseña
    restablecerBtn.addEventListener("click", async () => {
        try {
        const response = await fetch(API_URL_RESTABLECER, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario: userInfo.id_usuario})
        });

        const data = await response.json();
        console.log(data.message);
          Swal.fire({
              title: 'Clave restablecida<br> exitosamente',
              icon: 'success',
              color: '#000000ff',
              confirmButtonColor: '#3085d6',
              timer: '2000',
              customClass: {
                  popup: 'formsubmited'
              }          });
        closeForm();
    } catch (error) {
        console.error("Error al restablecer la clave:", error);
    }
    });

    // Boton cerrar ventana
    closeAddUser.addEventListener("click", () => {
      iduserForm.readOnly = false;
      iduserForm.style.cursor = "all";
      iduserForm.style.backgroundColor = "#FFFFFF";
      iduserForm.disabled = false;
    });
  }
});


//Variable de boton "guardar cambios"
const guardarCambios = document.getElementById("save-changes");

//Evento para actualizar información de usuario
guardarCambios.addEventListener("click", async () => {
  const id_usuario = document.getElementById("idusuario").value;
  const nombres = document.getElementById("nombres").value;
  const apellidos = document.getElementById("apellidos").value;
  const id_rolFK = document.getElementById("rol").value;
  const tipo_documento = document.getElementById("tipodocumento").value;
  const numero_telefono = document.getElementById("telefono").value;
  const correo_electronico = document.getElementById("correo").value;
  const estado_usuario = document.getElementById("checkbox").checked ? "Activo" : "Inactivo";

    const updatedUser = {
      id_usuario,
      id_rolFK,
      nombres,
      apellidos,
      tipo_documento,
      numero_telefono,
      correo_electronico,
      estado_usuario
    };

    console.log(updatedUser);

    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser)
      });

      if (response.ok) {
        const data = await response.json();
              Swal.fire({
                  title: 'Cambios se guardaron correctamente',
                  icon: 'success',
                  color: '#000000ff',
                  confirmButtonColor: '#3085d6',
                  timer: '3000',
                  customClass: {
                      popup: 'inactivationPopup'
                  }
              })
        console.log("Respuesta del servidor:", data);
        closeForm();
        traerDatos();
      } else {
        const errorText = await response.text();
        console.error("Error en la actualización:", errorText);
      }
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      alert("No se pudo conectar con el servidor");
    }
});

// Evento de inactivar usuario
tbody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {

    //Variables para obtener fila y sus celdas
    const fila = e.target.closest("tr");
    const celdas = fila.querySelectorAll("td");

    //Información capturada de usuario
    const userInfo = {
      id_usuario: celdas[0].textContent,
      estado_usuario: celdas[7].textContent.trim()
    };

    //Verificación de estado de usuario
    if (userInfo.estado_usuario === "Inactivo") {
      Swal.fire({
        title: "El usuario ya se encuentra inactivo",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: 'inactivationPopup' }
      });
      return; //Detiene ejecución del codigo posterior en caso tal de que se encuentre inactivo
    }

    //Aviso para inactivar
    Swal.fire({
      icon: 'question',
      title: "¿Desea inactivar<br>usuario?",
      showDenyButton: true,
      confirmButtonText: "Sí",
      customClass: { popup: 'inactivationPopup' }
    }).then(async (result) => {
      if (result.isConfirmed) { //Si se le confirma muestra mensaje

        Swal.fire({
          title: '¡Inactivación exitosa!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'inactivationPopup' }
        });

        //Variable para guardar inactivación de usuario
        const updatedUser = {
          id_usuario: userInfo.id_usuario,
          estado_usuario: "Inactivo"
        };
        console.log("Datos enviados:", updatedUser);

        //Mediante API envia actualización de inactivacion
        try {
          const response = await fetch(API_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUser)
          });

          if (response.ok) {
            console.log("Inactivación exitosa");
            traerDatos();
          }
        } catch (error) {
          console.error("Error actualizando usuario:", error);
        }

      } else if (result.isDenied) { //Si resultado es negativo muestra anuncio de cancelación
        Swal.fire({
          title: '¡Operación cancelada!',
          icon: 'warning',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'inactivationPopup' }
        });
      }
    });
  }
});


// Carga de elementos + boton añadir usuario
document.addEventListener("DOMContentLoaded", () => {
    const btnAddUser = document.getElementById("btn-adduser");
    const userContainer = document.getElementById("adduser-container");
    const overlay = document.getElementById("overlay");
    const restablecerBtn = document.getElementById("restablecer");
    const submitBtn = document.getElementById("submit");

    btnAddUser.addEventListener("click", () => {
      overlay.classList.add("active");
      userContainer.style.display = "block";
      submitBtn.style.display = "block";
      restablecerBtn.style.display = "none";

      const saveBtn = document.getElementById("save-changes");
      saveBtn.style.display = "none";
    });
});

// Variables de pantalla de formulario de usuario
const btnAddUser = document.getElementById("btn-adduser");
const overlay = document.getElementById("overlay");
const form = document.getElementById('adduser-form');

//Funcion para cerrar formulario
function closeForm() {
    overlay.classList.remove("active");
    const form = document.getElementById('adduser-form');
        form.querySelectorAll('input, select, p').forEach(el => {
            el.classList.remove('correct', 'incorrect');
            el.style.border = "";
            el.style.backgroundImage = "";
        });
        form.querySelectorAll('p').forEach(el => {
            el.style.display = "none";
        });
};

const cancelBtn = document.getElementById("cancel");

// Cerrar al presionar el botón "Cerrar"
cancelBtn.addEventListener("click", () => {
    closeForm();
    form.reset()
});

const formulario = document.getElementById('adduser-form');
const inputs = document.querySelectorAll('#adduser-form input');

// Variable de validación de expresiones
const expresiones = {
	idusuario: /^.{6,12}$/, // 6 a 12 digitos.
	nombres: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	apellidos: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
  telefono: /^\d{7,14}$/, // 7 a 14 numeros.
	correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
};

// Variables estaticas de validación en form
const campos = {
    idusuario: false,
    nombres: false,
    apellidos: false,
    rol: false,
    tipodocumento: false,
    telefono: false,
    correo: false
};

//Funcion para verificar si el id de usuario existe o no e impida su creación en caso de existir
async function verificarId() {
  
    try {
    const response = await fetch(API_URL);

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error HTTP ${response.status}: ${text}`);
    }

    const usuarios = await response.json();

    if (!Array.isArray(usuarios)) {
      console.error("La respuesta no es un arreglo:", usuarios);
      return;
    };

    usuarios.forEach(usuario => {
        {usuario.id_usuario};

        const idusuario = usuario.id_usuario;
        const formIdusuario = document.getElementById("idusuario").value;

        if (idusuario == formIdusuario) 
          {
          document.getElementById('idusuario').classList.add('incorrect');
          document.getElementById('idusuario').classList.remove('correct');
          document.getElementById('idusuarioduplicado').style.display = "block";
          document.getElementById('idusuario').style.backgroundImage = 'url("../../assets/icons/incorrecto.png")';
          document.getElementById('idusuario').style.backgroundRepeat = 'no-repeat';
          document.getElementById('idusuario').style.backgroundPosition = 'right 10px center';
          document.getElementById('idusuario').style.backgroundSize = '20px';
          campos ['idusuario'] = false;
        }
      });
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
};

const validarFormulario = (e) => {
    if (e.target.value.trim() === "") {
        const input = e.target;
        input.classList.remove('correct', 'incorrect');
        input.style.backgroundImage = "none";
        input.style.border = "";
        
        // Oculta mensajes de error si existen
        const errorIds = ["erroridusuario", "idusuarioduplicado"];

        // Recorres cada uno
        errorIds.forEach(id => {
          const errorElement = document.getElementById(id);
          if (errorElement) {
            errorElement.style.display = "none"; // Oculta si existe
          }
        });

        // Marca el campo como falso en el objeto campos
        if (campos.hasOwnProperty(input.name)) {
            campos[input.name] = false;
        }

        // Sale de la función para no ejecutar las validaciones posteriores
        return;
    };
    switch (e.target.name) {
        case "idusuario":
            if (expresiones.idusuario.test(e.target.value)) {
                document.getElementById('idusuario').classList.remove('incorrect');
                document.getElementById('idusuario').classList.add('correct');
                document.getElementById('erroridusuario').style.display = "none";
                document.getElementById('idusuarioduplicado').style.display = "none";
                document.getElementById('idusuario').style.backgroundImage = 'url("../../assets/icons/correcto.png")';
                document.getElementById('idusuario').style.backgroundRepeat = 'no-repeat';
                document.getElementById('idusuario').style.backgroundPosition = 'right 10px center';
                document.getElementById('idusuario').style.backgroundSize = '20px';
                campos ['idusuario'] = true;
                verificarId(idusuario);
            } else {
                document.getElementById('idusuario').classList.add('incorrect');
                document.getElementById('idusuario').classList.remove('correct');
                document.getElementById('idusuarioduplicado').style.display = "none";
                document.getElementById('erroridusuario').style.display = "block";
                document.getElementById('idusuario').style.backgroundImage = 'url("../../assets/icons/incorrecto.png")';
                document.getElementById('idusuario').style.backgroundRepeat = 'no-repeat';
                document.getElementById('idusuario').style.backgroundPosition = 'right 10px center';
                document.getElementById('idusuario').style.backgroundSize = '20px';
                campos ['idusuario'] = false;
            }
        break;

        case "nombres":
            if (expresiones.nombres.test(e.target.value)) {
                document.getElementById('nombres').classList.remove('incorrect');
                document.getElementById('nombres').classList.add('correct');
                document.getElementById('errornombres').style.display = "none";
                document.getElementById('nombres').style.backgroundImage = 'url("../../assets/icons/correcto.png")';
                document.getElementById('nombres').style.backgroundRepeat = 'no-repeat';
                document.getElementById('nombres').style.backgroundPosition = 'right 10px center';
                document.getElementById('nombres').style.backgroundSize = '20px';
                campos ['nombres'] = true;
            } else {
                document.getElementById('nombres').classList.add('incorrect');
                document.getElementById('nombres').classList.remove('correct');
                document.getElementById('errornombres').style.display = "block";
                document.getElementById('nombres').style.backgroundImage = 'url("../../assets/icons/incorrecto.png")';
                document.getElementById('nombres').style.backgroundRepeat = 'no-repeat';
                document.getElementById('nombres').style.backgroundPosition = 'right 10px center';
                document.getElementById('nombres').style.backgroundSize = '20px';
                campos ['nombres'] = false;
            }
        break;
        
        case "apellidos":
            if (expresiones.apellidos.test(e.target.value)) {
                document.getElementById('apellidos').classList.remove('incorrect');
                document.getElementById('apellidos').classList.add('correct');
                document.getElementById('errorapellidos').style.display = "none";
                document.getElementById('apellidos').style.backgroundImage = 'url("../../assets/icons/correcto.png")';
                document.getElementById('apellidos').style.backgroundRepeat = 'no-repeat';
                document.getElementById('apellidos').style.backgroundPosition = 'right 10px center';
                document.getElementById('apellidos').style.backgroundSize = '20px';
                campos ['apellidos'] = true;                
            } else {
                document.getElementById('apellidos').classList.add('incorrect');
                document.getElementById('apellidos').classList.remove('correct');
                document.getElementById('errorapellidos').style.display = "block";
                document.getElementById('apellidos').style.backgroundImage = 'url("../../assets/icons/incorrecto.png")';
                document.getElementById('apellidos').style.backgroundRepeat = 'no-repeat';
                document.getElementById('apellidos').style.backgroundPosition = 'right 10px center';
                document.getElementById('apellidos').style.backgroundSize = '20px';
                campos ['apellidos'] = true;                
            }
        break;

        case "rol":
            if (e.target.value !== "") {
                document.getElementById('rol').style.border = "2px solid green";
                campos['rol'] = true;
            } else {
                document.getElementById('rol').style.border = "2px solid red";
                campos['rol'] = false;
            }
        break;

        case "tipodocumento":
            if (e.target.value !== "") {
                document.getElementById('tipodocumento').style.border = "2px solid green";
                campos['tipodocumento'] = true;
            } else {
                document.getElementById('tipodocumento').style.border = "2px solid red";
                campos['tipodocumento'] = false;
            }
        break;

        case "telefono":
            if (expresiones.telefono.test(e.target.value)) {
                document.getElementById('telefono').classList.remove('incorrect');
                document.getElementById('telefono').classList.add('correct');
                document.getElementById('errortelefono').style.display = "none";
                document.getElementById('telefono').style.backgroundImage = 'url("../../assets/icons/correcto.png")';
                document.getElementById('telefono').style.backgroundRepeat = 'no-repeat';
                document.getElementById('telefono').style.backgroundPosition = 'right 10px center';
                document.getElementById('telefono').style.backgroundSize = '20px';
                campos ['telefono'] = true;
            } else {
                document.getElementById('telefono').classList.add('incorrect');
                document.getElementById('telefono').classList.remove('correct');
                document.getElementById('errortelefono').style.display = "block";
                document.getElementById('telefono').style.backgroundImage = 'url("../../assets/icons/incorrecto.png")';
                document.getElementById('telefono').style.backgroundRepeat = 'no-repeat';
                document.getElementById('telefono').style.backgroundPosition = 'right 10px center';
                document.getElementById('telefono').style.backgroundSize = '20px';
                campos ['telefono'] = false;
            }
        break;

        case "correo":
            if (expresiones.correo.test(e.target.value)) {
                document.getElementById('correo').classList.remove('incorrect');
                document.getElementById('correo').classList.add('correct');
                document.getElementById('errorcorreo').style.display = "none";
                document.getElementById('correo').style.backgroundImage = 'url("../../assets/icons/correcto.png")';
                document.getElementById('correo').style.backgroundRepeat = 'no-repeat';
                document.getElementById('correo').style.backgroundPosition = 'right 10px center';
                document.getElementById('correo').style.backgroundSize = '20px';
                campos ['correo'] = true;
            } else {
                document.getElementById('correo').classList.add('incorrect');
                document.getElementById('correo').classList.remove('correct');
                document.getElementById('errorcorreo').style.display = "block";
                document.getElementById('correo').style.backgroundImage = 'url("../../assets/icons/incorrecto.png")';
                document.getElementById('correo').style.backgroundRepeat = 'no-repeat';
                document.getElementById('correo').style.backgroundPosition = 'right 10px center';
                document.getElementById('correo').style.backgroundSize = '20px';
                campos ['correo'] = false;
            }
        break;
    };
};

// Validacion de tecleado en inputs de formsUser
inputs.forEach((input) => {
    input.addEventListener('keyup',validarFormulario);
});

const buscadorUsuario = document.getElementById("form-busqueda");

buscadorUsuario.addEventListener("keyup", (e) => {
  const texto = buscadorUsuario.value.toLowerCase();
  const pagingContainer = document.getElementById("paging");

  // Si está vacío → mostrar todo
  if (texto === "") {
    desde = 0;
    paginaActiva = 1;
    cargarUsuarios();
    cargarItemPaginacion();
    pagingContainer.classList.remove("hidden");
    return;
  }

  // Filtro
  const filtrados = totalUsuarios.filter(usuario => {
    return (
      usuario.nombres.toLowerCase().includes(texto) ||
      usuario.apellidos.toLowerCase().includes(texto) ||
      usuario.tipo_documento.toLowerCase().includes(texto) ||
      translateNameRol(usuario.id_rolFK).toLowerCase().includes(texto) ||
      String(usuario.id_usuario).includes(texto)
    );
  });

  console.log("Filtrados:", filtrados);

  if (filtrados.length === 0) {
    // No hay resultados
    cuerpoTabla.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px; color: #999;">No se encontraron usuarios</td></tr>';
    return;
  }

  // reemplazar temporalmente totalUsuarios
  const respaldo = totalUsuarios; // guardo original
  totalUsuarios = filtrados;      // pongo filtrados

  desde = 0;                       // reset paginación
  paginaActiva = 1;               // reset página activa
  cargarUsuarios();                // carga filtrados
  cargarItemPaginacion();          // actualizar paginación
  pagingContainer.classList.remove("hidden");

  totalUsuarios = respaldo;       // restauro los originales
});

const selectRol = document.getElementById('rol'); //Input tipo select de rol
selectRol.addEventListener('change', validarFormulario); //Evento para convertir y validar las expresiones del rol

const selectDocumento = document.getElementById('tipodocumento'); //Input tipo select de tipo de documento
selectDocumento.addEventListener('change', validarFormulario); //Evento para convertir y validar las expresiones del tipo de documento

// Evento para validar y/o enviar datos de usuario
formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    if (
        campos.idusuario &&
        campos.nombres &&
        campos.apellidos &&
        campos.rol &&
        campos.tipodocumento &&
        campos.telefono &&
        campos.correo 
    ) {
        closeForm();
        creationUser();
            Swal.fire({
            icon: 'success',
            title: 'Operación completado<br> exitosamente',
            color: '#000000ff',
            confirmButtonColor: '#3085d6',
            timer: '2000',
            customClass: {
                popup: 'formsubmited'
            }
            });
        form.reset();
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Información',
            text: 'Por favor valida todos los campos para continuar.',
            color: '#000000ff',
            confirmButtonColor: '#3085d6',
            timer: '5000',
            customClass: {
                popup: 'emptycamps-alert'
                        }
                });
    }
});

const idBtn = document.getElementById("id");
const nombresBtn = document.getElementById("Nombres");
const apellidosBtn = document.getElementById("Apellidos");
const rolBtn = document.getElementById("Rol");
const activoBtn = document.getElementById("Activo");

let columnaclickeada = "";
let ordenFiltro = 0;

function handleClick(element) {
    // Imprimir un valor diferente dependiendo del botón que se haya presionado
    switch (element.id) {
        case "id":
            columnaclickeada = "id_usuario";
            ordenFiltro = (ordenFiltro === 1) ? 0 : 1;  // Cambia entre 1 y 0
            break;
        case "Nombres":
            columnaclickeada = "nombres";
            ordenFiltro = (ordenFiltro === 1) ? 0 : 1;  // Cambia entre 1 y 0
            break;
        case "Apellidos":
            columnaclickeada = "apellidos";
            ordenFiltro = (ordenFiltro === 1) ? 0 : 1;  // Cambia entre 1 y 0
            break;
        case "Rol":
            columnaclickeada = "id_rolFK";
            ordenFiltro = (ordenFiltro === 1) ? 0 : 1;  // Cambia entre 1 y 0
            break;
        case "Activo":
            columnaclickeada = "estado_usuario";
            ordenFiltro = (ordenFiltro === 1) ? 0 : 1;  // Cambia entre 1 y 0
            break;
    }
    console.log(`Orden de filtro: ${ordenFiltro}`);
};

async function filtroOrden () {
  const datos = {
    "columna": columnaclickeada
  };

  if (ordenFiltro === 1) {
    try {
      const response = await fetch(API_URL_ORDENDESCENDENTE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos)
      });

      if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
      }

      const usuarios = await response.json();
      console.log("Datos recibidos:", usuarios);

      if (!Array.isArray(usuarios)) {
        console.error("La respuesta no es un arreglo:", usuarios);
        return;
      }

      const tbody = document.getElementById("usuarios-body");
      tbody.innerHTML = ""; // limpia el contenido anterior

      usuarios.forEach(usuario => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${usuario.id_usuario}</td>
          <td>${usuario.nombres}</td>
          <td>${usuario.apellidos}</td>
          <td>${roles[usuario.id_rolFK] || "Desconocido"}</td>
          <td id="tipodocumentoData">${usuario.tipo_documento}</td>
          <td id="telefonoData">${usuario.numero_telefono}</td>
          <td id="correoData">${usuario.correo_electronico}</td>
          <td>${usuario.estado_usuario}</td>
          <td>
            <img class="edit-btn" src="../assets/icons/editar.png" alt="Editar">
            <img class="delete-btn" src="../assets/icons/borrar.png" alt="Eliminar">
          </td>
        `;
        tbody.appendChild(fila);
      });

    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
    }
  else if (ordenFiltro == 0) {
    try {
      const response = await fetch(API_URL_ORDENASCENDENTE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos)
      });

      if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
      }

      const usuarios = await response.json();
      console.log("Datos recibidos:", usuarios);

      if (!Array.isArray(usuarios)) {
        console.error("La respuesta no es un arreglo:", usuarios);
        return;
      }

      const tbody = document.getElementById("usuarios-body");
      tbody.innerHTML = ""; // limpia el contenido anterior

      usuarios.forEach(usuario => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${usuario.id_usuario}</td>
          <td>${usuario.nombres}</td>
          <td>${usuario.apellidos}</td>
          <td>${roles[usuario.id_rolFK] || "Desconocido"}</td>
          <td id="tipodocumentoData">${usuario.tipo_documento}</td>
          <td id="telefonoData">${usuario.numero_telefono}</td>
          <td id="correoData">${usuario.correo_electronico}</td>
          <td>${usuario.estado_usuario}</td>
          <td>
            <img class="edit-btn" src="../assets/icons/editar.png" alt="Editar">
            <img class="delete-btn" src="../assets/icons/borrar.png" alt="Eliminar">
          </td>
        `;
        tbody.appendChild(fila);
      });

      console.log("Tabla actualizada con los usuarios");
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
    }
}

// Evento de filtrado a titulo de columnas
idBtn.addEventListener("click", () => {
  handleClick(idBtn);
  filtroOrden();
});
nombresBtn.addEventListener("click", () => {
  handleClick(nombresBtn);
  filtroOrden();
});
apellidosBtn.addEventListener("click", () => {
  handleClick(apellidosBtn);
  filtroOrden();
});
rolBtn.addEventListener("click", () => {
  handleClick(rolBtn);
  filtroOrden();
});
activoBtn.addEventListener("click", () => {
  handleClick(activoBtn);
  filtroOrden();
});