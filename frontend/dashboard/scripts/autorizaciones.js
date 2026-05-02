const API_AUTORIZACIONES = "http://localhost:9000/autorizaciones";
const API_MEDICAMENTOS = "http://localhost:9000/inventario/medicamentos";
const API_AUTORIZACIONES_MEDICAMENTOS = "http://localhost:9000/autorizaciones/medicamentos";
const construccionContenedor = document.getElementById("construccion");

function mostrarConstruccion() {
  construccionContenedor.style.display = "block";
}

function ocultarConstruccion() {
  construccionContenedor.style.display = "none";
}

ocultarConstruccion();

// Variables globales de paginación
let totalAutorizaciones = [];
let limite = 10;
let desde = 0;
let paginas = 1;
let paginaActiva = 1;

function formatearFecha(fecha) {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-CO");
}

let idHistorialActual;

// Renderiza autorizaciones de la página activa
function renderAutorizaciones() {
  const tbody = document.getElementById("autorizaciones-body");
  tbody.innerHTML = "";

  const arreglo = totalAutorizaciones.slice(desde, desde + limite);

  if (arreglo.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding: 1.5rem; color: #888;">
          No hay autorizaciones registradas.
        </td>
      </tr>
    `;
    return;
  }

  arreglo.forEach((autorizacion) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td data-label="Código">${autorizacion.codigo_autorizacion}</td>
      <td data-label="Paciente">${autorizacion.paciente_nombre + " " + autorizacion.paciente_apellido}</td>
      <td data-label="Fecha">${formatearFecha(autorizacion.fecha_autorizacion)}</td>
      <td data-label="Nota">${autorizacion.nota}</td>
      <td data-label="Estado" style="color: ${colorearEstado(autorizacion.estado_autorizacion)};">${autorizacion.estado_autorizacion}</td>
      <td data-label="Acciones">
        <button class="btn-verDetalles" data-id="${autorizacion.id_autorizacion}">Ver detalles</button>
      </td>
    `;
    tbody.appendChild(fila);
    console.log("Autorización renderizada:", autorizacion);
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
  renderAutorizaciones();
  cargarItemPaginacion();
};

window.nextPage = () => {
  if (paginaActiva < paginas) {
    paginaActiva++;
    desde += limite;
    renderAutorizaciones();
    cargarItemPaginacion();
  }
};

window.previusPage = () => {
  if (paginaActiva > 1) {
    paginaActiva--;
    desde -= limite;
    renderAutorizaciones();
    cargarItemPaginacion();
  }
};

async function cargarAutorizaciones() {
  try {
    const response = await fetch(API_AUTORIZACIONES);
    const autorizaciones = await response.json();

    totalAutorizaciones = autorizaciones;
    paginas = Math.ceil(totalAutorizaciones.length / limite);
    desde = 0;
    paginaActiva = 1;

    renderAutorizaciones();
    cargarItemPaginacion();
  } catch (error) {
    console.error("Error al cargar autorizaciones:", error);
    const tbody = document.getElementById("autorizaciones-body");
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding: 1.5rem; color: #888;">
          Error al cargar autorizaciones.
        </td>
      </tr>
    `;
  }
}

function colorearEstado(estado) {
  switch (estado.toLowerCase()) {
    case "aprobada":
      return "green";
    case "pendiente":
      return "orange";
    case "rechazada":
      return "red";
    default:
      return "gray";
  }
}

async function actualizarStockMedicamento(id_medicamento, stock_disponible) {
  try {
    const response = await fetch(API_MEDICAMENTOS, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_medicamento, stock_disponible })
    });
    console.log("Respuesta al actualizar stock del medicamento:", response);
    if (!response.ok) {
      throw new Error("Error al actualizar el stock del medicamento");
    }
  } catch (error) {
    console.error("Error al actualizar el stock del medicamento:", error);
  }
}

async function autorizarAutorizacion(id_autorizacion) {
    try {
      const response = await fetch(API_AUTORIZACIONES, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_autorizacion, estado_autorizacion: "Aprobada" })
      });
      if (response.ok) {
        Swal.fire({
          title: "Autorización aprobada",
          icon: "success",
          confirmButtonText: "Cerrar"
        });
        cargarAutorizaciones();
      } else {
        throw new Error("Error al aprobar autorización");
      }
    } catch (error) {
      console.error("Error al aprobar autorización:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo aprobar la autorización.",
        icon: "error",
        confirmButtonText: "Cerrar"
      });
    }
}

async function rechazarAutorizacion(id_autorizacion) {
    try {
      const response = await fetch(API_AUTORIZACIONES, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_autorizacion, estado_autorizacion: "Rechazada" })
      });
      if (response.ok) {
        Swal.fire({
          title: "Autorización rechazada",
          icon: "success",
          confirmButtonText: "Cerrar"
        });
        cargarAutorizaciones();
      } else {
        throw new Error("Error al rechazar autorización");
      }
    } catch (error) {
      console.error("Error al rechazar autorización:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo rechazar la autorización.",
        icon: "error",
        confirmButtonText: "Cerrar"
      });
    }
}

const autorizacionesBody = document.getElementById("autorizaciones-body");
autorizacionesBody.addEventListener("click", async (event) => {
  if (event.target.classList.contains("btn-verDetalles")) {
    const id_autorizacion = event.target.dataset.id;
    try {
      const response = await fetch(
        `${API_AUTORIZACIONES_MEDICAMENTOS}?id_autorizacionFK=${id_autorizacion}`,
      );
      const medicamentos = await response.json();
      console.log("Medicamentos obtenidos:", medicamentos);

      const filasHtml = medicamentos
        .map(
          (med) => `
        <tr>
          <td style="padding: 0.5rem 0.75rem; border-bottom: 1px solid #e0e0e0;">${med.nombre_medicamento}</td>
          <td style="padding: 0.5rem 0.75rem; border-bottom: 1px solid #e0e0e0; text-align:center;">${med.cantidad}</td>
          <td style="padding: 0.5rem 0.75rem; border-bottom: 1px solid #e0e0e0; color:#555;">${med.notas || "—"}</td>
        </tr>
      `,
        )
        .join("");

      Swal.fire({
        title: `Detalle autorización <br>${medicamentos[0]?.codigo_autorizacion || ""}</br>`,
        html: `
        <div style="text-align:left; line-height:1.8;">
          <p><strong>Paciente:</strong><br> ${medicamentos[0]?.paciente_nombre || ""} ${medicamentos[0]?.paciente_apellido || ""}</br></p>
          <p><strong>Fecha de autorización:</strong><br> ${formatearFecha(medicamentos[0]?.fecha_autorizacion) || ""}</br></p>
          <p><strong>Estado:</strong><br> <span style="color:${colorearEstado(medicamentos[0]?.estado_autorizacion)}; font-weight:600;">${medicamentos[0]?.estado_autorizacion || ""}</br></span></p>
          <p><strong>Nota:</strong><br> ${medicamentos[0]?.nota || "—"}</br></p>
        </div>
          <div style="text-align:left;">
            <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
              <thead>
                <tr style="background:#f0f4f8;">
                  <th style="padding: 0.5rem 0.75rem; text-align:left; border-bottom: 2px solid #498EC9;">Medicamento</th>
                  <th style="padding: 0.5rem 0.75rem; text-align:center; border-bottom: 2px solid #498EC9;">Cantidad</th>
                  <th style="padding: 0.5rem 0.75rem; text-align:left; border-bottom: 2px solid #498EC9;">Notas</th>
                </tr>
              </thead>
              <tbody>
                ${filasHtml}
              </tbody>
            </table>
          </div>
        `,
        showConfirmButton: true,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText:
          '<b><img src="../assets/icons/correcto.png" width="20" height="20" style="margin-right:8px">Autorizar</b>',
        denyButtonText:
          '<b><img src="../assets/icons/incorrecto.png" width="20" height="20" style="margin-right:8px">Rechazar</b>',
        cancelButtonText: "<b>Cerrar</b>",
        confirmButtonColor: "#49c963",
        denyButtonColor: "#e73c3c",
        cancelButtonColor: "#498EC9",
        width: "600px",
      });
      Swal.getConfirmButton().addEventListener("click", () => {
        if (medicamentos[0]?.estado_autorizacion.toLowerCase() === "aprobada") {
          Swal.fire({
            title: "Esta autorización ya fue aprobada.",
            icon: "info",
            confirmButtonText: "Cerrar",
          });
          return;
        }
        else if (medicamentos[0]?.estado_autorizacion.toLowerCase() === "rechazada") {
          Swal.fire({
            title: "Esta autorización ya fue rechazada.",
            icon: "info",
            confirmButtonText: "Cerrar",
          });
          return;
        }
        Swal.fire({
          title: "¿Estás seguro de aprobar esta autorización?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, aprobar",
          cancelButtonText: "No, cancelar",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await autorizarAutorizacion(id_autorizacion);
            for (const med of medicamentos) {
              const nuevoStock = Math.max(0, med.stock_disponible - med.cantidad);
              await actualizarStockMedicamento(med.id_medicamento, nuevoStock);
            }
          }
        });
      });
      Swal.getDenyButton().addEventListener("click", () => {
        if (medicamentos[0]?.estado_autorizacion.toLowerCase() === "aprobada") {
          Swal.fire({
            title: "Esta autorización ya fue aprobada y no puede ser rechazada.",
            icon: "info",
            confirmButtonText: "Cerrar",
          });
          return;
        }
        else if (medicamentos[0]?.estado_autorizacion.toLowerCase() === "rechazada") {
          Swal.fire({
            title: "Esta autorización ya fue rechazada.",
            icon: "info",
            confirmButtonText: "Cerrar",
          });
          return;
        }
        // Aquí puedes agregar la lógica para rechazar la autorización
        Swal.fire({
          title: "¿Estás seguro de rechazar esta autorización?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, rechazar",
          cancelButtonText: "No, cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            rechazarAutorizacion(id_autorizacion);
          }
        });
      });
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los detalles de la autorización.",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    }
}});

window.addEventListener("load", () => {
  cargarAutorizaciones();

  const prevBtn = document.querySelector("#previous-btn button");
  const nextBtn = document.querySelector("#next-page button");

  if (prevBtn) prevBtn.addEventListener("click", () => previusPage());
  if (nextBtn) nextBtn.addEventListener("click", () => nextPage());

  const buscador = document.getElementById("searchInput-autorizacion");
  buscador.addEventListener("keyup", () => {
    const texto = buscador.value.toLowerCase();
    const pagingContainer = document.getElementById("paging");

    if (texto === "") {
      desde = 0;
      paginaActiva = 1;
      renderAutorizaciones();
      cargarItemPaginacion();
      pagingContainer.classList.remove("hidden");
      return;
    }

    const filtrados = totalAutorizaciones.filter(a =>
      String(a.codigo_autorizacion).toLowerCase().includes(texto) ||
      (a.paciente_nombre + " " + a.paciente_apellido).toLowerCase().includes(texto) ||
      formatearFecha(a.fecha_autorizacion).toLowerCase().includes(texto) ||
      (a.nota || "").toLowerCase().includes(texto) ||
      a.estado_autorizacion.toLowerCase().includes(texto)
    );

    if (filtrados.length === 0) {
      document.getElementById("autorizaciones-body").innerHTML =
        '<tr><td colspan="6" style="text-align:center; padding:20px; color:#999;">No se encontraron autorizaciones</td></tr>';
      document.getElementById("pages").innerHTML = "";
      return;
    }

    const respaldo = totalAutorizaciones;
    totalAutorizaciones = filtrados;
    desde = 0;
    paginaActiva = 1;
    paginas = Math.ceil(totalAutorizaciones.length / limite);
    renderAutorizaciones();
    cargarItemPaginacion();
    pagingContainer.classList.remove("hidden");
    totalAutorizaciones = respaldo;
  });
});
