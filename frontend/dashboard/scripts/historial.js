// Endpoints
API_HISTORIAL = "http://localhost:9000/historial";
API_PACIENTES = "http://localhost:9000/users";
API_CONSULTAS = "http://localhost:9000/consultas";
API_PROCEDIMIENTOS = "http://localhost:9000/historial/procedimientos";
API_MEDICAMENTOS = "http://localhost:9000/inventario/medicamentos";
API_AUTORIZACIONES = "http://localhost:9000/autorizaciones";

const overlay = document.getElementById("overlay");
const addHistorialContainer = document.getElementById("addhistorial-container");
const addConsultaContainer = document.getElementById("addconsulta-container");
const addRecetaContainer = document.getElementById("addreceta-container");
const cancelBtnForms = document.querySelectorAll(".cancelBtn");
const addForms = document.querySelectorAll(".addForms");

function openFormHistorial() {
  overlay.classList.add("active");
  addHistorialContainer.style.display = "flex";

  addConsultaContainer.style.display = "none"; // Asegura que el formulario de consulta esté oculto
  addRecetaContainer.style.display = "none"; // Asegura que el formulario de receta esté oculto
}

function closeForm() {
  overlay.classList.remove("active");
  addHistorialContainer.style.display = "none";
  addHistorialContainer.querySelector("form").reset();

  addConsultaContainer.style.display = "none";
  addConsultaContainer.querySelector("form").reset();

  addRecetaContainer.style.display = "none";
  addRecetaContainer.querySelector("form").reset();
}

function openFormConsulta() {
  overlay.classList.add("active");
  addConsultaContainer.style.display = "flex";
  addHistorialContainer.style.display = "none"; // Asegura que el formulario de historial esté oculto   
}

function openFormReceta() {
  overlay.classList.add("active");
  addRecetaContainer.style.display = "flex";
  addHistorialContainer.style.display = "none"; // Asegura que el formulario de historial esté oculto
  addConsultaContainer.style.display = "none"; // Asegura que el formulario de consulta esté oculto
  cargarMedicamentos(); // Carga los medicamentos al abrir el formulario de receta
}

const nuevoRegistroHistorial = document.getElementById("nuevo-registroBtn");
nuevoRegistroHistorial.addEventListener("click", () => {
  openFormHistorial();
  cargarPacientes();
});

cancelBtnForms.forEach((btn) => {
  btn.addEventListener("click", () => {
    closeForm();
    addForms.forEach((form) => form.reset());
  });
});

const nuevoRegistroConsulta = document.getElementById("consultaBtn");
nuevoRegistroConsulta.addEventListener("click", openFormConsulta);

const nuevoRegistroReceta = document.getElementById("recetaBtn");
nuevoRegistroReceta.addEventListener("click", openFormReceta);

const buscadorPaciente = document.getElementById("pacienteBuscador");

// Variable global para almacenar el id_historialFK sin mostrar
let id_historialFK_actual = null;

async function cargarPacientes() {
  try {
    const response = await fetch(API_PACIENTES);
    const pacientes = await response.json();
    const select = document.getElementById("pacienteBuscador");
    select.innerHTML = '<option value="" disabled selected hidden>Seleccione un paciente</option>';

    pacientes.forEach((paciente) => {
      const option = document.createElement("option");
      option.value = paciente.id_usuario;
      option.textContent = paciente.id_usuario + " - " + paciente.nombres + " " + paciente.apellidos;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error cargando pacientes:", error);
}}

let medicamentosData = [];

async function cargarMedicamentos() {
    try {
        const response = await fetch(API_MEDICAMENTOS);
        medicamentosData = await response.json();
        llenarSelectMedicamento(document.querySelector(".medicamentoBuscador"));
    } catch (error) {
        console.error("Error cargando medicamentos:", error);
    }
}

function llenarSelectMedicamento(select) {
    select.innerHTML = '<option value="" disabled selected hidden>Seleccione un medicamento</option>';
    medicamentosData.forEach((medicamento) => {
        const option = document.createElement("option");
        option.value = medicamento.id_medicamento;
        option.textContent = medicamento.nombre_medicamento;
        select.appendChild(option);
    });
}

function crearFilaMedicamento() {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>
            <select class="medicamentoBuscador" name="medicamento_id">
                <option value="" disabled selected hidden>Seleccione un medicamento</option>
            </select>
        </td>
        <td style="text-align: center;">
            <input class="medicamentoCantidad" type="number" name="medicamento_cantidad" min="1">
        </td>
        <td>
            <textarea class="medicamentoNotas" placeholder="Notas adicionales"></textarea>
        </td>
        <td>
            <button type="button" class="deleteMedicamento-btn">
                <img src="../assets/icons/borrar.png" alt="Eliminar medicamento">
            </button>
        </td>
    `;
    llenarSelectMedicamento(tr.querySelector(".medicamentoBuscador"));
    tr.classList.add("fila-medicamento-nueva");
    return tr;
}

const expresiones = {
  id_pacienteFK: /^\d{1,12}$/, // 6 a 12 digitos.
  peso_paciente: /^\d{1,3}?$/, // Número con hasta 2 dígitos.
  altura_paciente: /^\d{1}(\.\d{1,2})?$/, // Número con hasta 3 dígitos y opcionalmente 2 decimales.
  fechas: /^\d{4}-\d{2}-\d{2}$/, // Formato de fecha YYYY-MM-DD.
  sexo: /^(Masculino|Femenino)$/, // Solo "Masculino" o "Femenino".
  grupo_sanguineo: /^(A|B|AB|O)[+-]$/, // Grupos sanguíneos válidos.
  text_areas: /^[\s\S]{0,500}$/, // Hasta 500 caracteres.
};

const campos = {
    id_pacienteFK: false,
    peso_paciente: false,
    altura_paciente: false,
    fecha_nacimiento: false,
    fecha_registro: false,
    fecha_consulta: false,
    motivo_consulta: false,
    descripcion_consulta: false,
    diagnostico: false,
    observaciones: false,
    sexo: false,
    grupo_sanguineo: false,
    antecedentes_personales: false,
    antecedentes_familiares: false,
    procedimientos_quirurgicos: false,
    descripcion_general: false,
    estado_clinico: false
}

const validarFormulario = (e) => {
  if (e.target.value.trim() === "") {
    const input = e.target;
    input.classList.remove("correct", "incorrect");

    if (campos.hasOwnProperty(input.name)) {
      campos[input.name] = false;
    }
    return;
  }
    switch (e.target.name) {
        case "id_pacienteFK":
          if (expresiones.id_pacienteFK.test(e.target.value)) {
            document.getElementById("pacienteBuscador").classList.remove("incorrect");
            document.getElementById("pacienteBuscador").classList.add("correct");
            campos["id_pacienteFK"] = true;
          } else {
            document.getElementById("pacienteBuscador").classList.add("incorrect");
            document.getElementById("pacienteBuscador").classList.remove("correct");
            campos["id_pacienteFK"] = false;
          }
          console.log("Campo id_pacienteFK:", campos["id_pacienteFK"]);
        break;
        case "peso_paciente":
            if (expresiones.peso_paciente.test(e.target.value)) {
              document.getElementById("pesoPaciente").classList.remove("incorrect");
              document.getElementById("pesoPaciente").classList.add("correct");
              campos["peso_paciente"] = true;
            } else {
              document.getElementById("pesoPaciente").classList.add("incorrect");
              document.getElementById("pesoPaciente").classList.remove("correct");
              campos["peso_paciente"] = false;
            }
            console.log("Campo peso_paciente:", campos["peso_paciente"]);
        break;
        case "altura_paciente":
            if (expresiones.altura_paciente.test(e.target.value)) {
              document.getElementById("alturaPaciente").classList.remove("incorrect");
              document.getElementById("alturaPaciente").classList.add("correct");
              campos["altura_paciente"] = true;
            } else {
              document.getElementById("alturaPaciente").classList.add("incorrect");
              document.getElementById("alturaPaciente").classList.remove("correct");
              campos["altura_paciente"] = false;
            }
            console.log("Campo altura_paciente:", campos["altura_paciente"]);
        break;
        case "fecha_nacimiento":
            if (expresiones.fechas.test(e.target.value)) {
              document.getElementById("fechaNacimiento").classList.remove("incorrect");
              document.getElementById("fechaNacimiento").classList.add("correct");
              campos["fecha_nacimiento"] = true;
            } else {
              document.getElementById("fechaNacimiento").classList.add("incorrect");
              document.getElementById("fechaNacimiento").classList.remove("correct");
              campos["fecha_nacimiento"] = false;
            }
            console.log("Campo fecha_nacimiento:", campos["fecha_nacimiento"]);
        break;
        case "sexo":
            if (expresiones.sexo.test(e.target.value)) {
              document.getElementById("sexo").style.border = "2px solid green";
              campos["sexo"] = true;
            } else {
              document.getElementById("sexo").style.border = "2px solid red";
              campos["sexo"] = false;
            }
            console.log("Campo sexo:", campos["sexo"]);
        break;
        case "grupo_sanguineo":
            if (e.target.value !== "") {
              document.getElementById("grupoSanguineo").style.border = "2px solid green";
              campos["grupo_sanguineo"] = true;
            } else {
              document.getElementById("grupoSanguineo").style.border = "2px solid red";
              campos["grupo_sanguineo"] = false;
            }
            console.log("Campo grupo_sanguineo:", campos["grupo_sanguineo"]);
        break;
        case "antecedentes_personales":
            if (expresiones.text_areas.test(e.target.value)) {
              document.getElementById("antecedentesPersonales").classList.remove("incorrect");
              document.getElementById("antecedentesPersonales").classList.add("correct");
              campos["antecedentes_personales"] = true;
            } else {
              document.getElementById("antecedentesPersonales").classList.add("incorrect");
              document.getElementById("antecedentesPersonales").classList.remove("correct");
              campos["antecedentes_personales"] = false;
            }
            console.log("Campo antecedentes_personales:", campos["antecedentes_personales"]);
        break;
        case "antecedentes_familiares":
            if (expresiones.text_areas.test(e.target.value)) {
              document.getElementById("antecedentesFamiliares").classList.remove("incorrect");
              document.getElementById("antecedentesFamiliares").classList.add("correct");
              campos["antecedentes_familiares"] = true;
            } else {
              document.getElementById("antecedentesFamiliares").classList.add("incorrect");
              document.getElementById("antecedentesFamiliares").classList.remove("correct");
              campos["antecedentes_familiares"] = false;
            }
            console.log("Campo antecedentes_familiares:", campos["antecedentes_familiares"]);
        break;
        case "procedimientos_quirurgicos":
            if (expresiones.text_areas.test(e.target.value)) {
              document.getElementById("procedimientosQuirurgicos").classList.remove("incorrect");
              document.getElementById("procedimientosQuirurgicos").classList.add("correct");
              campos["procedimientos_quirurgicos"] = true;
            } else {
              document.getElementById("procedimientosQuirurgicos").classList.add("incorrect");
              document.getElementById("procedimientosQuirurgicos").classList.remove("correct");
              campos["procedimientos_quirurgicos"] = false;
            }
            console.log("Campo procedimientos_quirurgicos:", campos["procedimientos_quirurgicos"]);
        break;
        case "descripcion_general":
            if (expresiones.text_areas.test(e.target.value)) {
              document.getElementById("descripcionGeneral").classList.remove("incorrect");
              document.getElementById("descripcionGeneral").classList.add("correct");
              campos["descripcion_general"] = true;
            } else {
              document.getElementById("descripcionGeneral").classList.add("incorrect");
              document.getElementById("descripcionGeneral").classList.remove("correct");
              campos["descripcion_general"] = false;
            }
            console.log("Campo descripcion_general:", campos["descripcion_general"]);
        break;
        case "estado_clinico":
            if (e.target.value !== "") {
                document.getElementById('estadoClinicoSelect').style.border = "2px solid green";
                document.getElementById('estadoClinicoSelect').style.borderRadius = "2px";
                campos['estado_clinico'] = true;
            } else {
                document.getElementById('estadoClinicoSelect').style.border = "2px solid red";
                document.getElementById('estadoClinicoSelect').style.borderRadius = "2px";
                campos['estado_clinico'] = false;
            }
            console.log("Campo estado_clinico:", campos["estado_clinico"]);
        break;
        case "fecha_consulta":
            if (expresiones.fechas.test(e.target.value)) {
              document.getElementById("fechaConsulta").classList.remove("incorrect");
              document.getElementById("fechaConsulta").classList.add("correct");
              campos["fecha_consulta"] = true;
            } else {
              document.getElementById("fechaConsulta").classList.add("incorrect");
              document.getElementById("fechaConsulta").classList.remove("correct");
              campos["fecha_consulta"] = false;
            }
            console.log("Campo fecha_consulta:", campos["fecha_consulta"]);
        break;
        case "motivo_consulta":
            if (expresiones.text_areas.test(e.target.value)) {
              document.getElementById("motivoConsulta").classList.remove("incorrect");
              document.getElementById("motivoConsulta").classList.add("correct");
              campos["motivo_consulta"] = true;
            } else {
              document.getElementById("motivoConsulta").classList.add("incorrect");
              document.getElementById("motivoConsulta").classList.remove("correct");
              campos["motivo_consulta"] = false;
            }
            console.log("Campo motivo_consulta:", campos["motivo_consulta"]);
        break;
        case "descripcion_consulta":
            if (expresiones.text_areas.test(e.target.value)) {
              document.getElementById("descripcionConsulta").classList.remove("incorrect");
              document.getElementById("descripcionConsulta").classList.add("correct");
              campos["descripcion_consulta"] = true;
            } else {
              document.getElementById("descripcionConsulta").classList.add("incorrect");
              document.getElementById("descripcionConsulta").classList.remove("correct");
              campos["descripcion_consulta"] = false;
            }
            console.log("Campo descripcion_consulta:", campos["descripcion_consulta"]);
        break;
        case "diagnostico":
            if (expresiones.text_areas.test(e.target.value)) {
              document.getElementById("diagnosticoConsulta").classList.remove("incorrect");
              document.getElementById("diagnosticoConsulta").classList.add("correct");
              campos["diagnostico"] = true;
            } else {
              document.getElementById("diagnosticoConsulta").classList.add("incorrect");
              document.getElementById("diagnosticoConsulta").classList.remove("correct");
              campos["diagnostico"] = false;
            }
            console.log("Campo diagnostico:", campos["diagnostico"]);
        break;
        case "observaciones":
            if (expresiones.text_areas.test(e.target.value)) {
              document.getElementById("observaciones").classList.remove("incorrect");
              document.getElementById("observaciones").classList.add("correct");
              campos["observaciones"] = true;
            } else {
              document.getElementById("observaciones").classList.add("incorrect");
              document.getElementById("observaciones").classList.remove("correct");
              campos["observaciones"] = false;
            }
            console.log("Campo observaciones:", campos["observaciones"]);
        break;
    }
};

const inputs = document.querySelectorAll(".addForms input");

inputs.forEach((input) => {
  input.addEventListener("keyup", validarFormulario);
  input.addEventListener("blur", validarFormulario);
});

// Agregar listeners para select y textarea
const selects = document.querySelectorAll(".addForms select");
const textareas = document.querySelectorAll(".addForms textarea");

selects.forEach((select) => {
  select.addEventListener("change", validarFormulario);
});

textareas.forEach((textarea) => {
  textarea.addEventListener("keyup", validarFormulario);
  textarea.addEventListener("blur", validarFormulario);
});

const historialForm = document.getElementById("addhistorial-form");
historialForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (campos.id_pacienteFK && 
      campos.peso_paciente && 
      campos.altura_paciente && 
      campos.grupo_sanguineo && 
      campos.antecedentes_personales && 
      campos.antecedentes_familiares && 
      campos.procedimientos_quirurgicos && 
      campos.descripcion_general && 
      campos.estado_clinico) {
        creationHistorial();
        historialForm.reset();
    }
});

const consultaForm = document.getElementById("addconsulta-form");
consultaForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (campos.fecha_consulta &&
        campos.motivo_consulta &&
        campos.descripcion_consulta &&
        campos.diagnostico &&
        campos.observaciones) {
        creationConsulta();
        consultaForm.reset();
    }
});

const recetaForm = document.getElementById("addreceta-form");
recetaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    cargarReceta();
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

async function creationHistorial() {
    const newHistorial = {
        id_pacienteFK: document.getElementById("pacienteBuscador").value,
        fecha_registro: new Date().toISOString().split("T")[0], // Fecha actual en formato YYYY-MM-DD
        peso_paciente: document.getElementById("pesoPaciente").value,
        altura_paciente: document.getElementById("alturaPaciente").value,
        fecha_nacimiento: document.getElementById("fechaNacimiento").value,
        sexo: document.getElementById("sexo").value,
        grupo_sanguineo: document.getElementById("grupoSanguineo").value,
        antecedentes_personales: document.getElementById("antecedentesPersonales").value,
        antecedentes_familiares: document.getElementById("antecedentesFamiliares").value,
        procedimientos_quirurgicos: document.getElementById("procedimientosQuirurgicos").value,
        descripcion_general: document.getElementById("descripcionGeneral").value,
        estado_clinico: document.getElementById("estadoClinicoSelect").value
    };

    console.log("Datos enviados al servidor:", newHistorial);

    try {
        const response = await fetch(API_HISTORIAL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newHistorial),
        });
        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Registro creado",
                text: "El historial se ha registrado correctamente",
                timer: 2000,
                showConfirmButton: false
            });
            cargarHistorial();
        } else {
            throw new Error(`Error HTTP ${response.status}`);
        }
    } catch (error) {
        console.error("Error al crear historial:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo crear el registro"
        });
    }
}

async function cargarReceta() {
    const id_historialFK = id_historialFK_actual;
    // Aquí puedes implementar la lógica para cargar la receta asociada al historial
    const newAutorizacion = {
        id_historialFK: id_historialFK,
        estado_autorizacion: "Pendiente",
        fecha_autorizacion: document.getElementById("fechaReceta").value,
        nota: document.getElementById("notaReceta").value,
        medicamentos: [] // Este campo se llenará con los medicamentos seleccionados
    }

    const filasMedicamentos = document.querySelectorAll("#medicamentos-body .fila-medicamento-nueva");
    const medicamentos = Array.from(filasMedicamentos).map(fila => ({
        id_medicamentoFK: fila.querySelector(".medicamentoBuscador").value,
        cantidad: fila.querySelector(".medicamentoCantidad").value,
        notas: fila.querySelector(".medicamentoNotas").value
    }));
    medicamentos.forEach(medicamento => {
        newAutorizacion.medicamentos.push(medicamento);
    });

    console.log("Datos de autorizacion enviados al servidor:", newAutorizacion);
    try {
        const response = await fetch(API_AUTORIZACIONES, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newAutorizacion),
        });
        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Receta registrada",
                text: "La receta se ha registrado correctamente",
                timer: 2000,
                showConfirmButton: false
            });
            closeForm(); // Cierra el formulario después de guardar
        } else {
            throw new Error(`Error HTTP ${response.status}`);
        }
    } catch (error) {
        console.error("Error al crear receta:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo registrar la receta"
        });
    }
}

async function creationConsulta() {
    const newConsulta = {
        id_historialFK: id_historialFK_actual,
        fecha_consulta: document.getElementById("fechaConsulta").value,
        motivo_consulta: document.getElementById("motivoConsulta").value,
        descripcion_consulta: document.getElementById("descripcionConsulta").value,
        diagnostico: document.getElementById("diagnosticoConsulta").value,
        observaciones: document.getElementById("observaciones").value
    };

    console.log("Datos consulta enviados al servidor:", newConsulta);

    try {
        const response = await fetch(API_CONSULTAS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newConsulta),
        });
        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Consulta registrada",
                text: "La consulta se ha registrado correctamente",
                timer: 2000,
                showConfirmButton: false
            });
            cargarConsultas(); // Recarga la lista de consultas para mostrar la nueva
            closeForm(); // Cierra el formulario después de guardar
        } else {
            throw new Error(`Error HTTP ${response.status}`);
        }
    } catch (error) {
        console.error("Error al crear consulta:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo registrar la consulta"
        });
    }

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
                <td>${historial.paciente_nombre} ${historial.paciente_apellido}</td>
                <td>${formatearFecha(historial.fecha_registro)}</td>
                <td>${historial.estado_clinico}</td>
                <td class="td-descripcion">${historial.descripcion_general}</td>
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
        <td>${consulta.motivo_consulta}</td>
        <td>${consulta.diagnostico}</td>
        <td>
          <button class="ver-consulta" data-id="${consulta.id_consulta}">
            <img src="../assets/icons/ver.png" alt="Ver Consulta">
          </button>
        </td>
      `;
      // Guardar los datos completos en el elemento para accederlos al hacer click
      fila.querySelector(".ver-consulta").dataset.consulta = JSON.stringify(consulta);
      consultasBody.appendChild(fila);
    });

    consultasBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".ver-consulta");
      if (!btn) return;
      const consulta = JSON.parse(btn.dataset.consulta);
      Swal.fire({
        title: "Detalle de consulta",
        html: `
          <div style="text-align: left; line-height: 1.8;">
            <p><strong>Fecha:</strong> ${formatearFecha(consulta.fecha_consulta)}</p>
            <p><strong>Motivo:</strong> ${consulta.motivo_consulta}</p>
            <p><strong>Descripción:</strong> ${consulta.descripcion_consulta || "—"}</p>
            <p><strong>Diagnóstico:</strong> ${consulta.diagnostico}</p>
            <p><strong>Observaciones:</strong> ${consulta.observaciones || "—"}</p>
          </div>
        `,
        confirmButtonText: "<b>Cerrar</b>",
        confirmButtonColor: "#498EC9",
        width: "40%"
      });
    });

    consultasBody.style.animation = "fadeIn 0.5s ease-out";
  } catch (error) {
    console.error("Error cargando consultas:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo cargar las consultas"
    });
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
      `${API_HISTORIAL}?codigo_historial=${historial.codigo_historial}`,
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

    const pacienteReceta = document.getElementById("pacienteReceta");
    if (pacienteReceta) {
        pacienteReceta.value = `${historial.paciente_nombre} ${historial.paciente_apellido}`;
    }

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
    cargarHistorial();
});

document.getElementById("medicamentos-body").addEventListener("click", (e) => {
    const btn = e.target.closest(".deleteMedicamento-btn");
    if (!btn) return;
    const filas = document.querySelectorAll("#medicamentos-body tr");
    if (filas.length <= 2) return; // conservar al menos 1 fila de datos
    btn.closest("tr").remove();
});

const agregarMedicamentoBtn = document.getElementById("agregarMedicamento");
agregarMedicamentoBtn.addEventListener("click", () => {
    const tbody = document.getElementById("medicamentos-body");
    const ultimaFila = tbody.lastElementChild;
    const nuevaFila = crearFilaMedicamento();
    tbody.insertBefore(nuevaFila, ultimaFila);
});
