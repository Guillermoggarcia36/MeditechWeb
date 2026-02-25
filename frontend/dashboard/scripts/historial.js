// Endpoints
API_HISTORIAL = "http://localhost:9000/historial";
API_HISTORIALRESUMEN = "http://localhost:9000/historial/resumen";
API_PACIENTES = "http://localhost:9000/users";
API_CONSULTAS = "http://localhost:9000/historial/consultas";
API_PROCEDIMIENTOS = "http://localhost:9000/historial/procedimientos";

const overlay = document.getElementById("overlay");
const addHistorialContainer = document.getElementById("addhistorial-container");

function openForm() {
  overlay.classList.add("active");
  addHistorialContainer.style.display = "flex";
}

function closeForm() {
  overlay.classList.remove("active");
  addHistorialContainer.style.display = "none";
  addHistorialContainer.querySelector("form").reset();
}

const nuevoRegistro = document.getElementById("nuevo-registroBtn");
nuevoRegistro.addEventListener("click", () => {
  openForm();
  cargarPacientes();
});

const cancelBtn = document.getElementById("cancel");
cancelBtn.addEventListener("click", closeForm);

const buscadorPaciente = document.getElementById("pacienteBuscador");

// Variable global para almacenar el id_historialFK sin mostrar
let id_historialFK_actual = null;

async function cargarPacientes() {
  try {
    const response = await fetch(API_PACIENTES);
    const pacientes = await response.json();
    const datalist = document.getElementById("listaPacientes");
    datalist.innerHTML = ""; // Limpia opciones previas

    pacientes.forEach((paciente) => {
      const option = document.createElement("option");
      const idPaciente = paciente.id_usuario; // Asegúrate de que este campo exista en tu respuesta
      option.value = idPaciente; // El valor que se enviara al formulario
      option.textContent = paciente.nombres + " " + paciente.apellidos; // O el campo que desees mostrar
      datalist.appendChild(option);
    });
  } catch (error) {
    console.error("Error cargando pacientes:", error);
}}

const expresiones = {
  id_usuarioFK: /^.{6,12}$/, // 6 a 12 digitos.
  peso_paciente: /^\d{1,3}(\.\d{1,2})?$/, // Número con hasta 3 dígitos y opcionalmente 2 decimales.
  altura_paciente: /^\d{1,3}(\.\d{1,2})?$/, // Número con hasta 3 dígitos y opcionalmente 2 decimales.
  grupo_sanguineo: /^(A|B|AB|O)[+-]$/, // Grupos sanguíneos válidos.
  antecedentes_personales: /^.{0,500}$/, // Hasta 500 caracteres.
  antecedentes_familiares: /^.{0,500}$/, // Hasta 500 caracteres.
  descripcion_general: /^.{0,500}$/, // Hasta 500 caracteres.
  procedimientos_quirurgicos: /^.{0,500}$/, // Hasta 500 caracteres.
};

const campos = {
    id_usuarioFK: false,
    fecha_registro: false,
    peso_paciente: false,
    altura_paciente: false,
    grupo_sanguineo: false,
    antecedentes_personales: false,
    antecedentes_familiares: false,
    procedimientos_quirurgicos: false,
    descripcion_general: false,
    estado_clinico: false
}

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "id_usuarioFK":
            campos.id_usuarioFK = expresiones.id_usuarioFK.test(e.target.value);
            break;
        case "peso_paciente":
            campos.peso_paciente = expresiones.peso_paciente.test(e.target.value);
            break;
        case "altura_paciente":
            campos.altura_paciente = expresiones.altura_paciente.test(e.target.value);
            break;
        case "grupo_sanguineo":
            campos.grupo_sanguineo = expresiones.grupo_sanguineo.test(e.target.value);
            break;
        case "antecedentes_personales":
            campos.antecedentes_personales = expresiones.antecedentes_personales.test(e.target.value);
            break;
        case "antecedentes_familiares":
            campos.antecedentes_familiares = expresiones.antecedentes_familiares.test(e.target.value);
            break;
        case "procedimientos_quirurgicos":
            campos.procedimientos_quirurgicos = expresiones.procedimientos_quirurgicos.test(e.target.value);
            break;
        case "descripcion_general":
            campos.descripcion_general = expresiones.descripcion_general.test(e.target.value);
            break;
        case "estado_clinico":
            campos.estado_clinico = expresiones.descripcion_general.test(e.target.value);
            break;
    }
};

const form = document.getElementById("addhistorial-form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (campos.id_usuarioFK && campos.fecha_registro && campos.peso_paciente && campos.altura_paciente && campos.grupo_sanguineo && campos.antecedentes_personales && campos.antecedentes_familiares && campos.procedimientos_quirurgicos && campos.descripcion_general && campos.estado_clinico) {
        nuevoHistorial();
        // Aquí puedes enviar newHistorial al backend usando fetch o XMLHttpRequest
    }
});

function ocultarContenedor() {
  const historialContainer = document.getElementById("historial-container");
  historialContainer.style.display = "none";
}

function cerrarInformacionGeneral() {
  const resumenContainer = document.getElementById("resumen-historial");
  resumenContainer.style.display = "none";

  const historialContainer = document.getElementById("historial-container");
  historialContainer.style.display = "block";

  const backContainer = document.getElementById("back-container");
  backContainer.style.display = "none"; // Muestra el botón de volver
}

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null;

  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);

  if (nacimiento > hoy) return null;

  let edad = hoy.getFullYear() - nacimiento.getFullYear();

  if (
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() &&
      hoy.getDate() < nacimiento.getDate())
  ) {
    edad--;
  }

  return edad;
}

function nuevoHistorial() {
    const newHistorial = {
        id_usuarioFK: document.getElementById("pacienteBuscador").value,
        fecha_registro: new Date().toISOString().split("T")[0], // Fecha actual en formato YYYY-MM-DD
        peso_paciente: document.getElementById("pesoPaciente").value,
        altura_paciente: document.getElementById("alturaPaciente").value,
        grupo_sanguineo: document.getElementById("grupoSanguineo").value,
        antecedentes_personales: document.getElementById("antecedentesPersonales").value,
        antecedentes_familiares: document.getElementById("antecedentesFamiliares").value,
        procedimientos_quirurgicos: document.getElementById("procedimientosQuirurgicos").value,
        descripcion_general: document.getElementById("descripcionGeneral").value,
        estado_clinico: document.getElementById("estadoClinico").value
    };

    console.log("Datos a enviar:", newHistorial);
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-CO");
}

function formatearHora12(hora24) {
  if (!hora24) return "";

  const [horas, minutos] = hora24.split(":");
  let h = parseInt(horas, 10);
  const m = minutos;
  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12;
  h = h === 0 ? 12 : h; // 0 → 12

  return `${h}:${m} ${ampm}`;
}

const historialBody = document.getElementById("historial-body");

async function cargarHistorial() {
  const backContainer = document.getElementById("back-container");
  backContainer.style.display = "none"; // Muestra el botón de volver

  try {
    const response = await fetch(API_HISTORIAL);
    const historiales = await response.json();
    historialBody.innerHTML = ""; // Limpia el cuerpo de la tabla antes de agregar nuevos datos

    historiales.forEach((historial) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
                <td>${historial.codigo_historial}</td>
                <td>${historial.id_pacienteFK}</td>
                <td>${formatearFecha(historial.fecha_registro)}</td>
                <td>${historial.estado_clinico}</td>
                <td>${historial.descripcion_general}</td>
                <td>
                  <button id="ver-detalles">Ver detalles</button>
                </td>
            `;
      historialBody.appendChild(fila);
    });
    historialBody.style.animation = "fadeIn 0.5s ease-out";
  } catch (error) {
    console.error("Error cargando historial:", error);
  }
}

async function cargarConsultas() {
  const id_historialFK = id_historialFK_actual;

  try {
    const response = await fetch(`${API_CONSULTAS}?id_historialFK=${id_historialFK}`);
    const consultas = await response.json();
    const consultasBody = document.getElementById("consultas-body");
    consultasBody.innerHTML = "";
    
    if (!consultas || consultas.length === 0) {
      consultasBody.innerHTML = "<tr><td colspan='6' style='text-align: center; padding: 20px;'>No hay consultas médicas registradas</td></tr>";
      return;
    }
    
    consultas.forEach((consulta) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td style="font-size: 2rem;">•</td>
        <td>${formatearFecha(consulta.fecha_consulta)}</td>
        <td>${formatearHora12(consulta.hora_consulta)}</td>
        <td>${consulta.motivo_consulta}</td>
        <td>${consulta.diagnostico}</td>
        <button id="ver-consulta">
          <img src="../assets/icons/ver.png" alt="Ver Consulta" style="width: 20px; height: auto;">
        </button>
      `;
      consultasBody.appendChild(fila);
    });
    consultasBody.style.animation = "fadeIn 0.5s ease-out";
  } catch (error) {
    console.error("Error cargando consultas:", error);
  }
}

async function cargarProcedimientos() {
    const id_historialFK = id_historialFK_actual;

    try {
        const response = await fetch(`${API_PROCEDIMIENTOS}?id_historialFK=${id_historialFK}`);
        const data = await response.json();
        const procedimientos = Array.isArray(data) ? data : (data ? [data] : []);
        const procedimientosBody = document.getElementById("procedimientos-body");

        procedimientosBody.innerHTML = "";
        
        if (!procedimientos || procedimientos.length === 0) {
            procedimientosBody.innerHTML = "<tr><td colspan='2' style='text-align: center; padding: 20px;'>No hay procedimientos quirúrgicos registrados</td></tr>";
            return;
        }
        
        procedimientos.forEach((procedimiento) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td style="font-size: 2rem;">•</td>
                <td>${procedimiento.procedimientos_quirurgicos}</td>
            `;
            procedimientosBody.appendChild(fila);
        });
        procedimientosBody.style.animation = "fadeIn 0.5s ease-out";
    } catch (error) {
        console.error("Error cargando procedimientos:", error);
    }
}

// Cargar el historial al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  cargarHistorial();
  cerrarInformacionGeneral();
});

async function cargarResumenHistorial(historial) {
  const resumenHistorial = document.getElementById("resumen-historial");
  resumenHistorial.style.display = "grid"; // Muestra el resumen del historial
  resumenHistorial.style.animation = "fadeIn 0.5s ease-out";

  const backContainer = document.getElementById("back-container");
  backContainer.style.display = "flex"; // Muestra el botón de volver

  try {
    const response = await fetch(
      `${API_HISTORIALRESUMEN}?codigo_historial=${historial.codigo_historial}`,
    );
    const resumen = await response.json();
    console.log("Resumen del historial:", resumen);

    // Filtrar el array para encontrar el elemento que coincida con el código_historial
    const historialSeleccionado = resumen.find(
      (h) => h.codigo_historial === historial.codigo_historial,
    );

    if (historialSeleccionado) {
      abrirInformacionGeneral(historialSeleccionado);
    } else {
      console.error(
        "No se encontró el historial con código:",
        historial.codigo_historial,
      );
    }
  } catch (error) {
    console.error("Error cargando resumen del historial:", error);
  }
}

function abrirInformacionGeneral(historial) {
    // Guardar el id_historial sin mostrar
    id_historialFK_actual = historial.id_historial;
    
    const generalInfo = document.getElementById("generalInfo-container");
    generalInfo.innerHTML = `
        <img id="paciente-icono" src="../assets/icons/usuario.png" alt="Paciente Icono" style="width: 100px; height: auto; border-radius: 50%; margin-bottom: 20px;">
        <p id="nombre-paciente">${historial.paciente_nombre} ${historial.paciente_apellido}</p> 
        <p id="codigo-historial">${historial.codigo_historial}</p>
        <p id="id-paciente">Id paciente: ${historial.id_pacienteFK}</p>
        <p id="fecha-nacimiento">Fecha nacimiento: ${formatearFecha(historial.fecha_nacimiento)}</p>
        <p id="edad">Edad: ${calcularEdad(historial.fecha_nacimiento) || "Desconocida"} años</p>
        <p id="sexo">Sexo: ${historial.sexo}</p>
        <p id="rh">RH: ${historial.grupo_sanguineo}</p>
        <p id="antecedentes-personales">Antecedentes personales: ${historial.antecedentes_personales}</p>
        <p id="antecedentes-familiares">Antecedentes familiares: ${historial.antecedentes_familiares}</p>
    `;

    const estadoClinicoSelect = document.getElementById("estadoClinico");
    estadoClinicoSelect.value = historial.estado_clinico || ""; // Establece el valor del select al estado clínico actual

    console.log("ID Historial del paciente:", id_historialFK_actual);

    generalInfo.style.display = "grid";
    generalInfo.style.justifyItems = "center";
    generalInfo.style.animation = "slideInGeneral 0.5s ease-out forwards";

    console.log("Información general mostrada:", historial);
} 

// Event delegation para botones dinámicos
historialBody.addEventListener("click", async (event) => {
    if (event.target.id === "ver-detalles") {
        const row = event.target.closest("tr");
        const codigoHistorial = row.children[0].textContent;
        
        // Cargar información general del paciente
        await cargarResumenHistorial({
            codigo_historial: codigoHistorial,
            id_pacienteFK: row.children[1].textContent,
            fecha_registro: row.children[2].textContent,
            estado_clinico: row.children[3].textContent,
            descripcion_general: row.children[4].textContent,
        });

        // Mostrar contenedor de consultas
        const consultasContainer = document.getElementById("consultas-container");
        if (consultasContainer) {
            consultasContainer.style.display = "block";
            consultasContainer.style.animation = "fadeIn 0.5s ease-out";
        }

        // Cargar las consultas del historial
        await cargarConsultas();
        await cargarProcedimientos();

        // Ocultar la tabla de historial
        ocultarContenedor();
    }
});

const backBtn = document.getElementById("backBtn");

async function cambiarEstadoClinico(id_historial, nuevoEstado) {
    try {
        const response = await fetch(`${API_HISTORIAL}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_historial, estado_clinico: nuevoEstado })
        });

        if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
        
        Swal.fire({
            icon: "success",
            title: "Estado actualizado",
            html: `Cambiado a:<br>${nuevoEstado}`,
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo actualizar el estado"
        });
    }
}

const estadoClinicoSelect = document.getElementById("estadoClinico");
if (estadoClinicoSelect) {
    estadoClinicoSelect.addEventListener("change", (e) => {
        const nuevoEstado = e.target.value;
        cambiarEstadoClinico(id_historialFK_actual, nuevoEstado);
    });
}

backBtn.addEventListener("click", () => {
    cerrarInformacionGeneral();
});