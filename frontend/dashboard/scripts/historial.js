// Endpoints
API_HISTORIAL = "http://localhost:9000/historial";
API_HISTORIALRESUMEN = "http://localhost:9000/historial/resumen";
API_PACIENTES = "http://localhost:9000/users";

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
  }
}       


const campos = {
    id_usuarioFK: true,
    fecha_registro: true,
    peso_paciente: true,
    altura_paciente: true,
    grupo_sanguineo: true,
    antecedentes_personales: true,
    antecedentes_familiares: true,
    procedimientos_quirurgicos: true,
    descripcion_general: true,
    estado_clinico: true
}

const form = document.getElementById("addhistorial-form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (campos.id_usuarioFK && campos.fecha_registro && campos.peso_paciente && campos.altura_paciente && campos.grupo_sanguineo && campos.antecedentes_personales && campos.antecedentes_familiares && campos.procedimientos_quirurgicos && campos.descripcion_general && campos.estado_clinico) {
        nuevoHistorial();
        console.log("Datos a enviar:", newHistorial);
        // Aquí puedes enviar newHistorial al backend usando fetch o XMLHttpRequest
    }
});

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
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${historial.codigo_historial}</td>
                <td>${historial.id_pacienteFK}</td>
                <td>${formatearFecha(historial.fecha_registro)}</td>
                <td>${historial.estado_clinico}</td>
                <td>${historial.descripcion_general}</td>
                <td>
                  <button id="ver-detalles">Ver detalles</button>
                </td>
            `;
      historialBody.appendChild(row);
    });
    historialBody.style.animation = "fadeIn 0.5s ease-out";
  } catch (error) {
    console.error("Error cargando historial:", error);
  }
}

// Cargar el historial al cargar la página
window.addEventListener("DOMContentLoaded", cargarHistorial);

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
    const generalInfo = document.getElementById("generalInfo-container");
    generalInfo.innerHTML = `
        <img id="paciente-icono" src="../assets/icons/usuario.png" alt="Paciente Icono" style="width: 100px; height: auto; border-radius: 50%; margin-bottom: 20px;">
        <p id="nombre-paciente">${historial.paciente_nombre} ${historial.paciente_apellido}</p> 
        <p id="codigo-historial">${historial.codigo_historial}</p>
        <p id="id-paciente">Id paciente: ${historial.id_pacienteFK}</p>
        <p id="fecha-nacimiento">Fecha nacimiento: ${historial.fecha_nacimiento}</p>
        <p id="edad">Edad: ${calcularEdad(historial.fecha_nacimiento) || "Desconocida"} años</p>
        <p id="sexo">Sexo: ${historial.sexo}</p>
        <p id="rh">RH: ${historial.grupo_sanguineo}</p>
    `;

    generalInfo.style.display = "grid";
    generalInfo.style.justifyItems = "center";
    generalInfo.style.animation = "slideInGeneral 0.5s ease-out forwards";

    console.log("Información general mostrada:", historial);
} 

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

// Event delegation para botones dinámicos
historialBody.addEventListener("click", (event) => {
    if (event.target.id === "ver-detalles") {
        cargarResumenHistorial({
            codigo_historial: event.target.closest("tr").children[0].textContent,
            id_pacienteFK: event.target.closest("tr").children[1].textContent,
            fecha_registro: event.target.closest("tr").children[2].textContent,
            estado_clinico: event.target.closest("tr").children[3].textContent,
            descripcion_general: event.target.closest("tr").children[4].textContent
        });
          ocultarContenedor();
    }
});

const backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", () => {
    cerrarInformacionGeneral();
});