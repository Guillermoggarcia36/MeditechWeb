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

