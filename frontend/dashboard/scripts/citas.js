// Endpoints
API_URL_CONSULTASEDES = "http://localhost:9000/citas/sedes";

// Variables de paginación
let totalCitas = [];
let citasCompletas = []; // Guardar citas originales sin filtrar
let limite = 10;
let desde = 0;
let paginas = 1;
let paginaActiva = 1;

const nombrePaciente = localStorage.getItem("nameUser") + " " + localStorage.getItem("apellidoUser");
const idPaciente = localStorage.getItem("idUsuario");

// Variable de seleccion de cita para envio a BD
let datosCita = {
  id_sedeFK: null,
  id_medicoFK: null,
  id_pacienteFK: idPaciente,
  fecha: null,
  hora: null,
};

// Variable de datos de resumen de cita a agendar
let resumenCita = {
  sede: null,
  direccion: null,
  medico: null,
  paciente: nombrePaciente,
  fecha: datosCita.fecha,
  hora: datosCita.hora,
};

// Variables de contenedores e inputs
const contentContainer = document.querySelector(".content-container");
const citasContainer = document.getElementById("citas-container");
const stepsNotes = document.getElementById("steps-notes");
const scheduleSubtitle = document.querySelector("#subtitle-content h2");
const inputCita = document.getElementById("searchInput-cita");

// Boton y evento para abrir contenedor para agendar cita
const agendarCita = document.getElementById("new-cita");
agendarCita.addEventListener("click", () => {
  validacionSeleccion();

  contentContainer.style.boxShadow = "none";

  citasContainer.style.boxShadow = "2px 20px 20px 20px rgba(128, 128, 128, 0.171)";
  citasContainer.style.width = "auto";
  citasContainer.style.height = "auto";
  citasContainer.style.marginLeft = "5%";  
  citasContainer.style.marginRight = "5%";
  citasContainer.style.position = "relative";
  citasContainer.style.setProperty("--barra-color", "#3b82f6");

  const scheduleCita = document.getElementById("schedule-cita");
  scheduleCita.style.display = "block";

  const selectMenu = document.getElementById("select-menu");
  selectMenu.style.display = "none";

  stepsNotes.textContent = "Selecciona una sede";
  cargarSedes();
})

// Variable y evento para cancelar registro de cita
const cancelarBtn = document.getElementById("cancel-btn");
cancelarBtn.addEventListener("click", () => {
    window.location.href = "dashboard-citas.html";
})

// Variable de elementos HTML para insertar datos de las sedes de BD
const cuerpoSedes = document.getElementById("options-sedes");
const cuerpoMedicos = document.getElementById("options-medicos");

function marcarSeleccion(btnSeleccionado) {
  // quitar clase a todos
  const botonesSedes = cuerpoSedes.querySelectorAll(".options-btn");
  botonesSedes.forEach((b) => b.classList.remove("opcion-seleccionada"));
  cuerpoMedicos.querySelectorAll(".options-btn").forEach((b) => b.classList.remove("opcion-seleccionada"));

  // poner clase al seleccionado
  btnSeleccionado.classList.add("opcion-seleccionada");
}

// Funcion para consulta de sedes desde BD atraves de API e insertarla en elementos
async function cargarSedes() {
  cuerpoSedes.innerHTML = "";

  try {
    const response = await fetch(API_URL_CONSULTASEDES);
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
    const sedes = await response.json();

    // vaciamos y creamos botones
    sedes.forEach((sede) => {
      const btn = document.createElement("button");
      btn.type = "button";
      // guardamos el id y nombre en atributos data-*
      btn.dataset.id = sede.id_sede ?? sede.id ?? sede.id_sede;
      btn.dataset.nombre = sede.nombre_sede;
      btn.dataset.direccion = sede.direccion;
      btn.classList.add("options-btn");

      btn.innerHTML = `
        <img src="../assets/icons/sedes.png" alt="icon sede">
        <p>${sede.nombre_sede}</p>
      `;

      // al hacer click almacenamos el objeto sede en datosCita
      btn.addEventListener("click", () => {
        // Guardar datos minimos (puedes guardar todo el objeto si lo deseas)
        datosCita.id_sedeFK = btn.dataset.id;

        resumenCita.sede = btn.dataset.nombre;
        resumenCita.direccion = btn.dataset.direccion;

        // marcar visualmente el seleccionado
        marcarSeleccion(btn);
  
        console.log("Sede seleccionada:", resumenCita.sede);   
        console.log("Sede seleccionada:", resumenCita.direccion);
        const nextBtn = document.getElementById("next-btn");

        nextBtn.style.opacity = "100%";
        nextBtn.style.pointerEvents = "all";
        nextBtn.style.cursor = "pointer";
      });

      cuerpoSedes.appendChild(btn);
    });
  } catch (error) {
    console.error("Error al obtener sedes:", error);
  }
}

async function cargarMedicos() {
  cuerpoMedicos.innerHTML = "";
  inputCita.placeholder = "Buscar medico por nombre";
  try {
    const response = await fetch("http://localhost:9000/users/medicos");
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
    const medicos = await response.json();
    // vaciamos y creamos botones
    medicos.forEach((medico) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.id = medico.id_usuario;
      btn.dataset.nombre = medico.nombres + " " + medico.apellidos;
      btn.classList.add("options-btn");
      btn.innerHTML = `
        <img src="../assets/icons/usuario4.png" alt="icon medico">
        <p>${medico.nombres} ${medico.apellidos}</p>
      `;

      // al hacer click almacenamos el objeto medico en datosCita
      btn.addEventListener("click", () => {
        datosCita.id_medicoFK = btn.dataset.id;
        resumenCita.medico = btn.dataset.nombre;
        console.log("Medico seleccionado:", resumenCita.medico);
        console.log("Medico seleccionado:", datosCita.id_medicoFK);
        marcarSeleccion(btn);
        nextBtn.style.opacity = "100%";
        nextBtn.style.pointerEvents = "all";
        nextBtn.style.cursor = "pointer";        
      });
      cuerpoMedicos.appendChild(btn);
    });
  } catch (error) {
    console.error("Error al obtener medicos:", error);
  }
}

// Funcion para cargar inputs de calendario para seleccion
function cargarCalendario() {
  inputCita.style.display = "none";

  const calendarioDiv = document.getElementById("options-calendario");
  calendarioDiv.style.display = "flex";

  const horaSeleccion = document.getElementById("hora-cita");
  const fechaSeleccion = document.getElementById("fecha-cita");
  
  horaSeleccion.addEventListener("change", (e) => {
    datosCita.hora = e.target.value;
    resumenCita.hora = datosCita.hora;
    validacionSeleccion();
    console.log("Hora seleccionada:", datosCita.hora);
  });
  fechaSeleccion.addEventListener("change", (e) => {
    datosCita.fecha = e.target.value;
    resumenCita.fecha = datosCita.fecha;
    validacionSeleccion();
    console.log("Fecha seleccionada:", datosCita.fecha);
  });
}

// Funcion para cargar el resumen de los datos seleccionados durante el agendamiento
function cargarResumenCita() {
  const resumenCitaDiv = document.getElementById("resumen-cita");
  console.log(resumenCita);
  console.log(datosCita);

  stepsNotes.textContent = "Resumen de la cita";

  resumenCitaDiv.style.display = "block";
  resumenCitaDiv.innerHTML = `
    <p><strong>Lugar:</strong> ${resumenCita.sede}</p>
    <p><strong>Dirección:</strong> ${resumenCita.direccion}</p>
    <p><strong>Medico:</strong> ${resumenCita.medico}</p>
    <p><strong>Fecha:</strong> ${resumenCita.fecha}</p>
    <p><strong>Hora:</strong> ${resumenCita.hora}</p>
    <p><strong>Paciente:</strong> ${nombrePaciente}</p>
  `;

  nextBtnText.textContent = "Confirmar";
  const nextBtnImage = document.querySelector("#next-btn img");
  nextBtnImage.style.display = "none";
}

// Elemento boton Next de agendamiento de cita
const nextBtn = document.getElementById("next-btn");
const nextBtnText = document.getElementById("next-btnText");
// Evento para seguir avanzando en el agendamiento de cita y cuando esten completos los datos hacer registro a BD
nextBtn.addEventListener("click", () => {
  validacionSeleccion();
  if (
    (datosCita.id_sedeFK &&
      datosCita.id_medicoFK &&
      datosCita.fecha &&
      datosCita.hora) ||
    (resumenCita.sede &&
      resumenCita.direccion &&
      resumenCita.medico &&
      resumenCita.paciente &&
      resumenCita.fecha &&
      resumenCita.hora)
  ) {
    const calendarioDiv = document.getElementById("options-calendario");
    calendarioDiv.style.display = "none";

    nextBtn.style.opacity = "100%";
    nextBtn.style.pointerEvents = "all";

    citasContainer.style.setProperty("--barra-width", "100%");
    cargarResumenCita();

    nextBtn.addEventListener("click", () => {
      console.log("Datos cita a enviar:", datosCita);
      fetch("http://localhost:9000/citas", 
        {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(datosCita)
        })
        .then((response) => { {
          if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
          }
          return response.json();
          }})
        .then((data) => {console.log("Cita creada con ID:", data.id);})
        .catch((error) => {console.error("Error al crear la cita:", error);})
        .finally(() => {
          Swal.fire({
            icon: "success",
            title: "Cita agendada con éxito",
            timer: 1500,
            timerProgressBar: true, // barra de carga
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading(); // animación de carga
            },
          }).then(() => {
            window.location.href = "dashboard-citas.html";
          })
        });
    });
  }
});

function validacionSeleccion() {
  if (!datosCita.id_sedeFK || !resumenCita.sede) {
    return;
  }

  stepsNotes.textContent = "Selecciona un medico";
  cuerpoSedes.style.display = "none";
  citasContainer.style.setProperty("--barra-width", "40%");

  const cuerpoMedicos = document.getElementById("options-medicos");
  cuerpoMedicos.style.display = "grid";
  cargarMedicos();

  if (!datosCita.id_medicoFK || !resumenCita.medico) 
    {nextBtn.style.opacity = "40%";
    nextBtn.style.pointerEvents = "none";
    return;
  }

  nextBtn.style.opacity = "100%";
  nextBtn.style.pointerEvents = "all";

  stepsNotes.textContent = "Selecciona una fecha y hora";
  cuerpoMedicos.style.display = "none";
  citasContainer.style.setProperty("--barra-width", "75%");
  cargarCalendario();

  if (!datosCita.fecha || !resumenCita.fecha || !datosCita.hora || !resumenCita.hora) 
    {nextBtn.style.opacity = "40%";
    nextBtn.style.pointerEvents = "none";
  }
}

async function verificarEstadoCitas() {
  try {
    const response = await fetch("http://localhost:9000/citas");
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
    const citas = await response.json();
    
    const ahora = new Date();
    let citasActualizadas = false;
    
    for (const cita of citas) {
      const fechaCita = cita.fecha.trim().split('T')[0];
      const horaCita = cita.hora.trim();
      
      const fechaHoraCita = new Date(fechaCita + 'T' + horaCita);
      const citaPasada = ahora > fechaHoraCita;
      
      console.log(`Cita ${cita.id_cita}: ${formatearFecha(fechaCita)} ${formatearHora12(horaCita)}, Estado: ${cita.estado_cita}`);
      
      if (citaPasada && cita.estado_cita === "Pendiente") {
        console.log(`Cita ${cita.id_cita} está caducada. Actualizando a "Sin asistencia"...`);
        const updateResponse = await fetch("http://localhost:9000/citas/sin-asistencia", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_cita: cita.id_cita })
        });
        
        if (!updateResponse.ok) {
          console.error(`Error al actualizar cita ${cita.id_cita}: ${updateResponse.status}`);
        } else {
          console.log(`Cita ${cita.id_cita} actualizada exitosamente`);
          citasActualizadas = true;
        }
      }
    }
    console.log("Verificacion completada");
    
    if (citasActualizadas) {
      console.log("Refrescando lista de citas...");
      const response = await fetch("http://localhost:9000/citas");
      if (response.ok) {
        citasCompletas = await response.json();
        totalCitas = citasCompletas;
        paginas = Math.ceil(totalCitas.length / limite);
        renderCitas();
        cargarItemPaginacion();
      }
    }
  } catch (error) {
    console.error("Error al verificar estado de citas:", error);
  }
}

// Funcion para formatear la fecha a formato a ISO 8601
function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-CO");
}

// Funcion para formatear hora a formato 12 horas
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

// Funcion para colorear estado de cita segun sea su descripcion
function colorearEstadoCita(estadoCitaTd) {
  const estado = estadoCitaTd.textContent.trim();
  switch (estado) {
    case "Pendiente":
      estadoCitaTd.style.color = "#ffc95e";
      estadoCitaTd.style.fontWeight = "bold";      
      break;
    case "Confirmada":
      estadoCitaTd.style.color = "#28A745";
      estadoCitaTd.style.fontWeight = "bold";      
      break;
    case "Cancelada":
      estadoCitaTd.style.color = "#DC3545";
      estadoCitaTd.style.fontWeight = "bold";      
      break;
    case "No asistida":
      estadoCitaTd.style.color = "#6C757D"; // Gris
      estadoCitaTd.style.fontWeight = "bold"; 
      break;
    case "Asistida":
      estadoCitaTd.style.color = "#007BFF"; // Azul
      estadoCitaTd.style.fontWeight = "bold";
      break;   
  }
}

//Funcion para renderizar citas de la página activa
function renderCitas() {
  const cuerpoTablaCitas = document.getElementById("datos-citas");
  cuerpoTablaCitas.innerHTML = "";

  const citasPagina = totalCitas.slice(desde, desde + limite);

  citasPagina.forEach((cita) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td data-label="Código">${cita.codigo_cita}</td>        
      <td data-label="Sede">${cita.nombre_sede}</td>
      <td data-label="Médico">${cita.medico_nombre} ${cita.medico_apellidos}</td>
      <td data-label="Paciente">${cita.paciente_nombre} ${cita.paciente_apellido}</td>
      <td data-label="Fecha">${formatearFecha(cita.fecha)}</td>
      <td data-label="Hora">${formatearHora12(cita.hora)}</td>
      <td class="estado-cita" data-label="Estado">${cita.estado_cita}</td>
      <td class="cancelCita-btn" data-label="Cancelar">
        <img src="../assets/icons/cancelar.png" alt="icon cancelar cita">
      </td>
    `;
    cuerpoTablaCitas.appendChild(fila);

    // Colorear el estado de la cita
    const estadoCitaTd = fila.querySelector(".estado-cita");
    colorearEstadoCita(estadoCitaTd);

    // Ocultar la imagen si el estado es "Cancelada"
    if (cita.estado_cita === "Cancelada" || cita.estado_cita === "Confirmada" || cita.estado_cita === "Asistida" || cita.estado_cita === "No asistida") {
      const cancelBtn = fila.querySelector(".cancelCita-btn");
      cancelBtn.style.visibility = "hidden";
      cancelBtn.style.pointerEvents = "none";
    }

    // Agregar evento al boton de cancelar
    const cancelBtn = fila.querySelector(".cancelCita-btn");
    if (cancelBtn && cita.estado_cita !== "Cancelada") {
      cancelBtn.addEventListener("click", () => {
        Swal.fire({
          title: "¿Deseas cancelar esta cita?",
          text: `Cita: ${cita.codigo_cita}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DC3545",
          cancelButtonColor: "#6C757D",
          confirmButtonText: "Si, cancelar",
          cancelButtonText: "No, mantener"
        }).then((result) => {
          if (result.isConfirmed) {
            try {
              const response = fetch("http://localhost:9000/citas/cancelar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_cita: cita.id_cita })
              });
              if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
            } catch (error) {
              console.error("Error al cancelar la cita:", error);
            }
            Swal.fire({
              icon: "success",
              title: "Cita cancelada",
              text: `La cita ${cita.codigo_cita} ha sido cancelada exitosamente`,
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              obtenerCitas();
            });
          }
        });
      });
    }
  });
}

// Genera botones numerados de paginación
function cargarItemPaginacion() {
  const contenedorPaginacion = document.getElementById("pages");
  contenedorPaginacion.innerHTML = "";

  for (let index = 0; index < paginas; index++) {
    const btn = document.createElement("button");
    btn.className = `page-btn ${paginaActiva === index + 1 ? "active" : ""}`;
    btn.textContent = index + 1;
    btn.addEventListener("click", () => pasarPagina(index));
    contenedorPaginacion.appendChild(btn);
  }
}

window.pasarPagina = (paginaIndex) => {
  paginaActiva = paginaIndex + 1;
  desde = limite * paginaIndex;
  renderCitas();
  cargarItemPaginacion();
};

window.nextPage = () => {
  if (paginaActiva < paginas) {
    paginaActiva++;
    desde += limite;
    renderCitas();
    cargarItemPaginacion();
  }
};

window.previusPage = () => {
  if (paginaActiva > 1) {
    paginaActiva--;
    desde -= limite;
    renderCitas();
    cargarItemPaginacion();
  }
};

// Funcion asincrona para obtener citas registradas desde BD
async function obtenerCitas() {
  desde = 0;
  paginaActiva = 1;
  try {
    const response = await fetch("http://localhost:9000/citas");
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
    citasCompletas = await response.json(); // Guardar citas originales
    totalCitas = citasCompletas; // Mostrar todas
    paginas = Math.ceil(totalCitas.length / limite);
    console.log("Citas obtenidas:", totalCitas);
    renderCitas();
    cargarItemPaginacion();
  } catch (error) {
    console.error("Error al obtener citas:", error);
  }
}

const backBtn = document.getElementById("back-btn");
backBtn.addEventListener("click", () => {
  window.location.href = "dashboard-citas.html";
});

const searchInput = document.getElementById("searchInput-consult");
searchInput.addEventListener("input", () => {
  const filtro = searchInput.value.toLowerCase();
  const pagingContainer = document.getElementById("paging");

  if (filtro === "" || filtro.length < 5) {
    totalCitas = citasCompletas;
  } else {
    totalCitas = citasCompletas.filter(cita =>
      cita.codigo_cita.toLowerCase().includes(filtro) ||
      cita.medico_nombre.toLowerCase().includes(filtro) ||
      cita.medico_apellidos.toLowerCase().includes(filtro) ||
      cita.paciente_nombre.toLowerCase().includes(filtro) ||
      cita.paciente_apellido.toLowerCase().includes(filtro) ||
      cita.nombre_sede.toLowerCase().includes(filtro) ||
      formatearFecha(cita.fecha).toLowerCase().includes(filtro) ||
      formatearHora12(cita.hora).toLowerCase().includes(filtro) ||
      cita.estado_cita.toLowerCase().includes(filtro)
    );
  }

  desde = 0;
  paginaActiva = 1;
  paginas = Math.ceil(totalCitas.length / limite);
  renderCitas();
  cargarItemPaginacion();
  pagingContainer.classList.remove("hidden");
});

const prevBtn = document.querySelector("#previous-btn button");
const nextBtn2 = document.querySelector("#next-page button");

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    previusPage();
  });
}

if (nextBtn2) {
  nextBtn2.addEventListener("click", () => {
    nextPage();
  });
}

const consultCitaMenu = document.getElementById("consult-menu");
const consultCitasBtn = document.getElementById("consult-cita");
consultCitasBtn.addEventListener("click", () => {

    contentContainer.style.boxShadow = "none";

    citasContainer.style.boxShadow = "2px 20px 20px 20px rgba(128, 128, 128, 0.171)";
    citasContainer.style.width = "auto";
    citasContainer.style.height = "auto%";
    citasContainer.style.marginLeft = "5%";  
    citasContainer.style.marginRight = "5%";
    citasContainer.style.position = "relative";

    consultCitaMenu.style.display = "block";
    
    const selectMenu = document.getElementById("select-menu");
    selectMenu.style.display = "none";
    verificarEstadoCitas();
    obtenerCitas();
});
