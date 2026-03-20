const API_AUTORIZACIONES = "http://localhost:9000/autorizaciones";
const API_AUTORIZACIONES_MEDICAMENTOS =
  "http://localhost:9000/autorizaciones/medicamentos";

const construccionContenedor = document.getElementById("construccion");

function mostrarConstruccion() {
  construccionContenedor.style.display = "block";
}

function ocultarConstruccion() {
  construccionContenedor.style.display = "none";
}

ocultarConstruccion();

document.getElementById("autorizaciones-body").innerHTML = `
  <tr>
    <td colspan="6" style="text-align:center; padding: 1.5rem; color: #888;">
      No hay autorizaciones registradas.
    </td>
  </tr>
`;

function formatearFecha(fecha) {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-CO");
}

let idHistorialActual;

async function cargarAutorizaciones() {
  try {
    const response = await fetch(API_AUTORIZACIONES);
    const autorizaciones = await response.json();

    const tbody = document.getElementById("autorizaciones-body");
    tbody.innerHTML = "";

    if (autorizaciones.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 1.5rem; color: #888;">
            No hay autorizaciones registradas.
          </td>
        </tr>
      `;
      return;
    } else {
      autorizaciones.forEach((autorizacion) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${autorizacion.codigo_autorizacion}</td>
          <td>${autorizacion.paciente_nombre + " " + autorizacion.paciente_apellido}</td>
          <td>${formatearFecha(autorizacion.fecha_autorizacion)}</td>
          <td>${autorizacion.nota}</td>
          <td>${autorizacion.estado_autorizacion}</td>
          <td>
            <button class="btn-verDetalles" data-id="${autorizacion.id_autorizacion}">Ver detalles</button>
          </td>
        `;
        tbody.appendChild(fila);
      });
    }
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
    } catch (error) {
      console.error("Error al cargar detalles de medicamentos:", error);
    }
  }
});

window.addEventListener("load", cargarAutorizaciones);
