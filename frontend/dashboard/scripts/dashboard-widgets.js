document.addEventListener("DOMContentLoaded", () => {
  const rol = parseInt(localStorage.getItem("rolUser"));
  const widgetsContainer = document.getElementById("dashboard-widgets");
  if (!widgetsContainer) return;

  if (rol === 1) {
    // Administrativo
    widgetsContainer.innerHTML = `
            <div class="widget-row">
                <div class="widget-card">
                    <h3>Citas por mes</h3>
                    <canvas id="chart-citas" width="320" height="180"></canvas>
                </div>
            </div>
        `;
    fetchCitasPorMes();
  }
});

function fetchCitasPorMes() {
  fetch("http://localhost:9000/citas/estadisticas", {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Datos de citas:", data);
      renderCitasChart(data);
    })
    .catch((err) => {
      console.error("Error al traer estadísticas:", err);
    });
}

function renderCitasChart(data) {
  const ctx = document.getElementById("chart-citas").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.meses, // Ej: ["Enero", "Febrero", ...]
      datasets: [
        {
          label: "Citas",
          data: data.cantidades, // Ej: [12, 18, ...]
          backgroundColor: "#498EC9",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
    },
  });
}