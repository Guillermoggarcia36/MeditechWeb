const API_MEDICAMENTOS = "http://localhost:9000/inventario/medicamentos";
const API_INSUMOS = "http://localhost:9000/inventario/insumos";

const construccionContenedor = document.getElementById("construccion");

function mostrarConstruccion() {
  construccionContenedor.style.display = "block";
}

function ocultarConstruccion() {
  construccionContenedor.style.display = "none";
}

window.addEventListener("DOMContentLoaded", () => {
  cargarTodo();

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

// Buscador de inventario
const buscadorInventario = document.getElementById("searchInput-inventario");

buscadorInventario.addEventListener("keyup", () => {
  const texto = buscadorInventario.value.toLowerCase();
  const pagingContainer = document.getElementById("paging");

  if (texto === "") {
    desde = 0;
    paginaActiva = 1;
    renderPagina();
    cargarItemPaginacion();
    pagingContainer.classList.remove("hidden");
    return;
  }

  const respaldo = totalItems;

  let filtrados;
  if (tipoActual === "medicamentos") {
    filtrados = todosLosMedicamentos.filter(item =>
      item.nombre_medicamento.toLowerCase().includes(texto) ||
      String(item.id_medicamento).includes(texto) ||
      item.categoria_medicamento.toLowerCase().includes(texto) ||
      item.descripcion_medicamento.toLowerCase().includes(texto)
    );
  } else if (tipoActual === "insumos") {
    filtrados = todosLosInsumos.filter(item =>
      item.nombre_insumo.toLowerCase().includes(texto) ||
      String(item.id_insumo).includes(texto) ||
      item.categoria_insumo.toLowerCase().includes(texto) ||
      item.descripcion_insumo.toLowerCase().includes(texto)
    );
  } else {
    filtrados = respaldo.filter(item => {
      if (item._tipo === "medicamento") {
        return (
          item.nombre_medicamento.toLowerCase().includes(texto) ||
          String(item.id_medicamento).includes(texto) ||
          item.categoria_medicamento.toLowerCase().includes(texto) ||
          item.descripcion_medicamento.toLowerCase().includes(texto)
        );
      } else {
        return (
          item.nombre_insumo.toLowerCase().includes(texto) ||
          String(item.id_insumo).includes(texto) ||
          item.categoria_insumo.toLowerCase().includes(texto) ||
          item.descripcion_insumo.toLowerCase().includes(texto)
        );
      }
    });
  }

  if (filtrados.length === 0) {
    inventarioBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:#999;">No se encontraron items</td></tr>';
    document.getElementById("pages").innerHTML = "";
    return;
  }

  totalItems = filtrados;
  desde = 0;
  paginaActiva = 1;
  paginas = Math.ceil(totalItems.length / limite);
  renderPagina();
  cargarItemPaginacion();
  pagingContainer.classList.remove("hidden");

  totalItems = respaldo;
});

const overlay = document.getElementById("overlay");
const addItemContainer = document.getElementById("additem-container");

const cancelBtnForms = document.querySelectorAll(".cancelBtn");
cancelBtnForms.forEach((btn) => {
  btn.addEventListener("click", () => {
    closeForm();
  });
});

function openForm() {
  overlay.classList.add("active");
  addItemContainer.style.display = "block";
}

function closeForm() {
  overlay.classList.remove("active");
  addItemContainer.style.display = "none";

  guardarBtn.style.display = "block";
  guardarCambiosBtn.style.display = "none";

  const addForms = document.querySelectorAll(".addForms");
  addForms.forEach((form) => form.reset());

    // Reiniciar validación
    campos = {
        id_medicamento: false,
        nombre_medicamento: false,
        categoria_medicamento: false,
        descripcion_medicamento: false,
        fecha_vencimiento: false,
        estado_item: false,
        stock_disponible: false,
        id_insumo: false,
        nombre_insumo: false,
        categoria_insumo: false,
        descripcion_insumo: false,
    };

    const inputs = document.querySelectorAll(".addForms select, .addForms input, .addForms textarea");
    inputs.forEach(input => {
        input.disabled = false;
        input.style.cursor = "auto";
    });


}

const nuevoItemBtn = document.getElementById("nuevo-itemBtn");
nuevoItemBtn.addEventListener("click", () => {
  guardarCambiosBtn.style.display = "none";
  openForm();
});

ocultarConstruccion();

const inventarioBody = document.getElementById("inventario-body");
const medicamentoBtn = document.getElementById("medicamentoBtn");
const insumosBtn = document.getElementById("insumosBtn");

let todosLosMedicamentos = [];
let todosLosInsumos = [];

// Variables de paginación
let totalItems = [];
let tipoActual = "todo"; // "todo" | "medicamentos" | "insumos"
let limite = 10;
let desde = 0;
let paginas = 1;
let paginaActiva = 1;

const expresiones = {
    tipo_item: /^(medicamento|insumo)$/,
    id: /^\d{4,6}$/,
    nombre_item: /^[\s\S]{6,50}$/,    
    stock: /^\d{1,5}$/,
    fechas: /^\d{4}-\d{2}-\d{2}$/,
    categorias: /^[\s\S]{10,200}$/,
    textareas: /^[\s\S]{6,80}$/,
    estado: /^(Activo|Inactivo)$/,
};

let campos = {
  id_medicamento: false, // Para medicamentos
  nombre_medicamento: false,
  categoria_medicamento: false,
  descripcion_medicamento: false, // Para medicamentos

  fecha_vencimiento: false, // Para ambos tipos de items
  estado_item: false, // Para ambos tipos de items
  stock_disponible: false, // Para ambos tipos de items

  id_insumo: false, // Para insumos
  nombre_insumo: false,
  categoria_insumo: false,
  descripcion_insumo: false, // Para insumos
};

function formatearFecha(fecha) {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-CO");
}

function renderMedicamentos(medicamentos) {
  inventarioBody.innerHTML = "";

  if (!medicamentos.length) {
    inventarioBody.innerHTML =
      "<tr><td colspan='7' style='text-align:center; padding:20px;'>No hay medicamentos registrados</td></tr>";
    return;
  }

  medicamentos.forEach((item) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
            <td data-label="ID">${item.id_medicamento}</td>
            <td data-label="Stock">${item.stock_disponible}</td>
            <td data-label="Nombre">${item.nombre_medicamento}</td>
            <td data-label="Categoría">${item.categoria_medicamento}</td>
            <td class="td-descripcion" data-label="Descripción">${item.descripcion_medicamento}</td>
            <td data-label="Vencimiento" data-fecha="${item.fecha_vencimiento || ''}">${formatearFecha(item.fecha_vencimiento)}</td>
            <td data-label="Estado">${item.estado_item}</td>
            <td data-label="Acciones">
                <button class="ver-medicamento" style="border:none; background-color:transparent;">
                    <img src="../assets/icons/ver2.png" alt="Ver" style="width:26px; height:26px;">
                </button>
                <button class="editar-medicamento" style="border:none; background-color:transparent;">
                    <img src="../assets/icons/editar.png" alt="Editar" style="width:26px; height:26px;">
                </button>
                <button class="inactivar-medicamento" style="border:none; background-color:transparent;">
                    <img src="../assets/icons/borrar.png" alt="Inactivar" style="width:26px; height:26px;">
                </button>
            </td>
        `;
    fila.querySelector(".ver-medicamento").dataset.item = JSON.stringify(item);
    fila.querySelector(".inactivar-medicamento").dataset.item = JSON.stringify(item);
    inventarioBody.appendChild(fila);
  });
}

function renderInsumos(insumos) {
  inventarioBody.innerHTML = "";

  if (!insumos.length) {
    inventarioBody.innerHTML =
      "<tr><td colspan='7' style='text-align:center; padding:20px;'>No hay insumos registrados</td></tr>";
    return;
  }

  insumos.forEach((item) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
            <td data-label="ID">${item.id_insumo}</td>
            <td data-label="Stock">${item.stock_disponible}</td>
            <td data-label="Nombre">${item.nombre_insumo}</td>
            <td data-label="Categoría">${item.categoria_insumo}</td>
            <td class="td-descripcion" data-label="Descripción">${item.descripcion_insumo}</td>
            <td data-label="Vencimiento" data-fecha="${item.fecha_vencimiento || ''}">${formatearFecha(item.fecha_vencimiento)}</td>
            <td data-label="Estado">${item.estado_item}</td>
            <td data-label="Acciones">
                <button class="ver-insumo" style="border:none; background-color:transparent;">
                    <img src="../assets/icons/ver2.png" alt="Ver" style="width:26px; height:26px;">
                </button>
                <button class="editar-insumo" style="border:none; background-color:transparent;">
                    <img src="../assets/icons/editar.png" alt="Editar" style="width:26px; height:26px;">
                </button>
                <button class="inactivar-insumo" style="border:none; background-color:transparent;">
                    <img src="../assets/icons/borrar.png" alt="Inactivar" style="width:26px; height:26px;">
                </button>
            </td>
        `;
    fila.querySelector(".ver-insumo").dataset.item = JSON.stringify(item);
    fila.querySelector(".inactivar-insumo").dataset.item = JSON.stringify(item);
    inventarioBody.appendChild(fila);
  });
}

// Renderiza items combinados (medicamentos + insumos) para la vista "todo"
function renderCombinado(items) {
  inventarioBody.innerHTML = "";

  if (!items.length) {
    inventarioBody.innerHTML =
      "<tr><td colspan='7' style='text-align:center; padding:20px;'>No hay items registrados</td></tr>";
    return;
  }

  items.forEach((item) => {
    const fila = document.createElement("tr");
    if (item._tipo === "medicamento") {
      fila.innerHTML = `
        <td data-label="ID">${item.id_medicamento}</td>
        <td data-label="Stock">${item.stock_disponible}</td>
        <td data-label="Nombre">${item.nombre_medicamento}</td>
        <td data-label="Categoría">${item.categoria_medicamento}</td>
        <td class="td-descripcion" data-label="Descripción">${item.descripcion_medicamento}</td>
        <td data-label="Vencimiento" data-fecha="${item.fecha_vencimiento || ''}">${formatearFecha(item.fecha_vencimiento)}</td>
        <td data-label="Estado">${item.estado_item}</td>
        <td data-label="Acciones">
          <button class="ver-medicamento" style="border:none; background-color:transparent;">
            <img src="../assets/icons/ver2.png" alt="Ver" style="width:26px; height:26px;">
          </button>
          <button class="editar-medicamento" style="border:none; background-color:transparent;">
            <img src="../assets/icons/editar.png" alt="Editar" style="width:26px; height:26px;">
          </button>
          <button class="inactivar-medicamento" style="border:none; background-color:transparent;">
            <img src="../assets/icons/borrar.png" alt="Inactivar" style="width:26px; height:26px;">
          </button>
        </td>
      `;
      fila.querySelector(".ver-medicamento").dataset.item = JSON.stringify(item);
      fila.querySelector(".inactivar-medicamento").dataset.item = JSON.stringify(item);
    } else {
      fila.innerHTML = `
        <td data-label="ID">${item.id_insumo}</td>
        <td data-label="Stock">${item.stock_disponible}</td>
        <td data-label="Nombre">${item.nombre_insumo}</td>
        <td data-label="Categoría">${item.categoria_insumo}</td>
        <td class="td-descripcion" data-label="Descripción">${item.descripcion_insumo}</td>
        <td data-label="Vencimiento" data-fecha="${item.fecha_vencimiento || ''}">${formatearFecha(item.fecha_vencimiento)}</td>
        <td data-label="Estado">${item.estado_item}</td>
        <td data-label="Acciones">
          <button class="ver-insumo" style="border:none; background-color:transparent;">
            <img src="../assets/icons/ver2.png" alt="Ver" style="width:26px; height:26px;">
          </button>
          <button class="editar-insumo" style="border:none; background-color:transparent;">
            <img src="../assets/icons/editar.png" alt="Editar" style="width:26px; height:26px;">
          </button>
          <button class="inactivar-insumo" style="border:none; background-color:transparent;">
            <img src="../assets/icons/borrar.png" alt="Inactivar" style="width:26px; height:26px;">
          </button>
        </td>
      `;
      fila.querySelector(".ver-insumo").dataset.item = JSON.stringify(item);
      fila.querySelector(".inactivar-insumo").dataset.item = JSON.stringify(item);
    }
    inventarioBody.appendChild(fila);
  });
}

// Renderiza la página activa según el tipo de vista actual
function renderPagina() {
  const slice = totalItems.slice(desde, desde + limite);

  if (tipoActual === "medicamentos") {
    renderMedicamentos(slice);
  } else if (tipoActual === "insumos") {
    renderInsumos(slice);
  } else {
    renderCombinado(slice);
  }
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
  renderPagina();
  cargarItemPaginacion();
};

window.nextPage = () => {
  if (paginaActiva < paginas) {
    paginaActiva++;
    desde += limite;
    renderPagina();
    cargarItemPaginacion();
  }
};

window.previusPage = () => {
  if (paginaActiva > 1) {
    paginaActiva--;
    desde -= limite;
    renderPagina();
    cargarItemPaginacion();
  }
};

async function cargarTodo() {
  try {
    const [medicamentos, insumos] = await Promise.all([
      fetch(API_MEDICAMENTOS).then((r) => r.json()),
      fetch(API_INSUMOS).then((r) => r.json()),
    ]);

    todosLosMedicamentos = medicamentos;
    todosLosInsumos = insumos;

    const medicamentosTagged = medicamentos.map(i => ({ ...i, _tipo: "medicamento" }));
    const insumosTagged = insumos.map(i => ({ ...i, _tipo: "insumo" }));

    tipoActual = "todo";
    totalItems = [...medicamentosTagged, ...insumosTagged];
    paginas = Math.ceil(totalItems.length / limite);
    desde = 0;
    paginaActiva = 1;

    renderPagina();
    cargarItemPaginacion();
  } catch (error) {
    console.error("Error cargando inventario:", error);
  }
}

medicamentoBtn.addEventListener("click", () => {
  if (medicamentoBtn.classList.contains("active")) {
    medicamentoBtn.classList.remove("active");
    tipoActual = "todo";
    totalItems = [
      ...todosLosMedicamentos.map(i => ({ ...i, _tipo: "medicamento" })),
      ...todosLosInsumos.map(i => ({ ...i, _tipo: "insumo" }))
    ];
    paginas = Math.ceil(totalItems.length / limite);
    desde = 0;
    paginaActiva = 1;
    renderPagina();
    cargarItemPaginacion();
  } else {
    medicamentoBtn.classList.add("active");
    insumosBtn.classList.remove("active");
    tipoActual = "medicamentos";
    totalItems = todosLosMedicamentos;
    paginas = Math.ceil(totalItems.length / limite);
    desde = 0;
    paginaActiva = 1;
    renderPagina();
    cargarItemPaginacion();
  }
});

insumosBtn.addEventListener("click", () => {
  if (insumosBtn.classList.contains("active")) {
    insumosBtn.classList.remove("active");
    tipoActual = "todo";
    totalItems = [
      ...todosLosMedicamentos.map(i => ({ ...i, _tipo: "medicamento" })),
      ...todosLosInsumos.map(i => ({ ...i, _tipo: "insumo" }))
    ];
    paginas = Math.ceil(totalItems.length / limite);
    desde = 0;
    paginaActiva = 1;
    renderPagina();
    cargarItemPaginacion();
  } else {
    insumosBtn.classList.add("active");
    medicamentoBtn.classList.remove("active");
    tipoActual = "insumos";
    totalItems = todosLosInsumos;
    paginas = Math.ceil(totalItems.length / limite);
    desde = 0;
    paginaActiva = 1;
    renderPagina();
    cargarItemPaginacion();
  }
});

const guardarBtn = document.getElementById("submit");
const guardarCambiosBtn = document.getElementById("save-changes");

inventarioBody.addEventListener("click", (e) => {
  const btnMed = e.target.closest(".ver-medicamento");
  if (btnMed) {
    const item = JSON.parse(btnMed.dataset.item);
    Swal.fire({
      title: item.nombre_medicamento,
      html: `
                <div style="text-align:left; line-height:1.8;">
                    <p><strong>ID:</strong><br> ${item.id_medicamento}</br></p>
                    <p><strong>Stock:</strong><br> ${item.stock_disponible}</br></p>
                    <p><strong>Categoría:</strong><br> ${item.categoria_medicamento}</br></p>
                    <p><strong>Descripción:</strong><br> ${item.descripcion_medicamento}</br></p>
                    <p><strong>Vencimiento:</strong><br> ${formatearFecha(item.fecha_vencimiento)}</br></p>
                    <p><strong>Estado:</strong><br> ${item.estado_item}</br></p>
                </div>
            `,
      confirmButtonText: "<b>Cerrar</b>",
      confirmButtonColor: "#498EC9",
    });
    return;
  }

  // Ver detalles de insumo
  const btnIns = e.target.closest(".ver-insumo");
  if (btnIns) {
    const item = JSON.parse(btnIns.dataset.item);
    Swal.fire({
      title: item.nombre_insumo,
      html: `
                <div style="text-align:left; line-height:1.8;">
                    <p><strong>ID:</strong><br> ${item.id_insumo}</br></p>
                    <p><strong>Stock:</strong><br> ${item.stock_disponible}</br></p>
                    <p><strong>Categoría:</strong><br> ${item.categoria_insumo}</br></p>
                    <p><strong>Descripción:</strong><br> ${item.descripcion_insumo}</br></p>
                    <p><strong>Vencimiento:</strong><br> ${formatearFecha(item.fecha_vencimiento)}</br></p>
                    <p><strong>Estado:</strong><br> ${item.estado_item}</br></p>
                </div>
            `,
      confirmButtonText: "<b>Cerrar</b>",
      confirmButtonColor: "#498EC9",
    });
    return;
  }

  // Inactivar medicamento
  const btnInactivarMed = e.target.closest(".inactivar-medicamento");
  if (btnInactivarMed) {
    const item = JSON.parse(btnInactivarMed.dataset.item);

    if (item.estado_item === "Inactivo") {
      Swal.fire({
        title: "El medicamento ya se encuentra inactivo",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: "inactivationPopup" },
      });
      return;
    }

    Swal.fire({
      icon: "question",
      title: "¿Desea inactivar<br>medicamento?",
      showDenyButton: true,
      confirmButtonText: "Sí",
      customClass: { popup: "inactivationPopup" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Inactivación exitosa!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: "inactivationPopup" },
        });

        try {
          const response = await fetch(API_MEDICAMENTOS, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_medicamento: item.id_medicamento, estado_item: "Inactivo" }),
          });
          if (response.ok) cargarTodo();
        } catch (error) {
          console.error("Error inactivando medicamento:", error);
        }

      } else if (result.isDenied) {
        Swal.fire({
          title: "¡Operación cancelada!",
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: "inactivationPopup" },
        });
      }
    });
    return;
  }

  // Inactivar insumo
  const btnInactivarIns = e.target.closest(".inactivar-insumo");
  if (btnInactivarIns) {
    const item = JSON.parse(btnInactivarIns.dataset.item);

    if (item.estado_item === "Inactivo") {
      Swal.fire({
        title: "El insumo ya se encuentra inactivo",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: "inactivationPopup" },
      });
      return;
    }

    Swal.fire({
      icon: "question",
      title: "¿Desea inactivar<br>insumo?",
      showDenyButton: true,
      confirmButtonText: "Sí",
      customClass: { popup: "inactivationPopup" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Inactivación exitosa!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: "inactivationPopup" },
        });

        try {
          const response = await fetch(API_INSUMOS, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_insumo: item.id_insumo, estado_item: "Inactivo" }),
          });
          if (response.ok) cargarTodo();
        } catch (error) {
          console.error("Error inactivando insumo:", error);
        }

      } else if (result.isDenied) {
        Swal.fire({
          title: "¡Operación cancelada!",
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: "inactivationPopup" },
        });
      }
    });
  }

  // Editar medicamento o insumo
  const btnEditarMed = e.target.closest(".editar-medicamento");
  const btnEditarIns = e.target.closest(".editar-insumo");
  const btnEditar = btnEditarMed || btnEditarIns;
  if (btnEditar) {
    const esMedicamento = !!btnEditarMed;

    guardarBtn.style.display = "none";

    guardarCambiosBtn.style.display = "none";

    openForm();

    const fila = e.target.closest("tr");
    const celdas = fila.querySelectorAll("td");

    const itemInfo = {
      id: celdas[0].textContent,
      stock_disponible: celdas[1].textContent,
      nombre: celdas[2].textContent,
      categoria: celdas[3].textContent,
      descripcion: celdas[4].textContent,
      fecha_vencimiento: celdas[5].dataset.fecha || "",
      estado_item: celdas[6].textContent,
    };

    console.log("itemInfo:", itemInfo);

    const tipoItemInput = document.getElementById("tipoItem");
    tipoItemInput.value = esMedicamento ? "medicamento" : "insumo";
    tipoItemInput.disabled = true;
    tipoItemInput.style.cursor = "not-allowed";

    const idItemInput = document.getElementById("idItem");
    idItemInput.value = itemInfo.id;
    idItemInput.disabled = true;
    idItemInput.style.cursor = "not-allowed";

    const nombreItemInput = document.getElementById("nombreItem");
    nombreItemInput.value = itemInfo.nombre;

    const stockItemInput = document.getElementById("stockItem");
    stockItemInput.value = itemInfo.stock_disponible;
    stockItemInput.disabled = false;

    const categoriaItemInput = document.getElementById("categoriaItem");
    categoriaItemInput.value = itemInfo.categoria;
    categoriaItemInput.disabled = true;
    categoriaItemInput.style.cursor = "not-allowed";

    const descripcionItemInput = document.getElementById("descripcionItem");
    descripcionItemInput.value = itemInfo.descripcion
    descripcionItemInput.disabled = true;
    descripcionItemInput.style.cursor = "not-allowed";

    const fechaVencimientoInput = document.getElementById("fechaVencimiento");
    fechaVencimientoInput.value = itemInfo.fecha_vencimiento ? itemInfo.fecha_vencimiento.split("T")[0] : "";
    fechaVencimientoInput.disabled = true;
    fechaVencimientoInput.style.cursor = "not-allowed";

    const estadoItemInput = document.getElementById("estadoItem");
    estadoItemInput.value = itemInfo.estado_item;


    const addItemForm = document.getElementById("additem-form");
    addItemForm.addEventListener("input", () => {
      guardarCambiosBtn.style.display = "block";
    }, { once: true });

    return;
  }
});

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
    case "tipo_item":
      if (expresiones.tipo_item.test(e.target.value)) {
        campos.tipo_item = true;
        } else {
        campos.tipo_item = false;
      }
        console.log("Tipo de item:", campos.tipo_item);
    break;

    case "id_item":
        if (expresiones.id.test(e.target.value)) {
        campos.id_item = true;
        } else {
        campos.id_item = false;
        }
        console.log("ID del item:", campos.id_item);
    break;

    case "nombre_item":
        if (expresiones.nombre_item.test(e.target.value)) {
        campos.nombre_item = true;
        } else {
        campos.nombre_item = false;
        }
        console.log("Nombre del item:", campos.nombre_item);
    break;

    case "stock_item":
        if (expresiones.stock.test(e.target.value)) {
        campos.stock_disponible = true;
        } else {
        campos.stock_disponible = false;
        }
        console.log("Stock disponible:", campos.stock_disponible);
    break;

    case "descripcion_item":
        if (expresiones.textareas.test(e.target.value)) {
        campos.descripcion_item = true;
        } else {
        campos.descripcion_item = false;
        }
        console.log("Descripción del item:", campos.descripcion_item);
    break;

    case "categoria_item":
        if (expresiones.categorias.test(e.target.value)) {
        campos.categoria_item = true;
        } else {
        campos.categoria_item = false;
        }
        console.log("Categoría del item:", campos.categoria_item);
    break;

    case "fecha_vencimiento":
      if (expresiones.fechas.test(e.target.value)) {
        campos.fecha_vencimiento = true;
      } else {
        campos.fecha_vencimiento = false;
      }
      console.log("Fecha de vencimiento:", campos.fecha_vencimiento);
    break;

    case "estado_item":
      if (expresiones.estado.test(e.target.value)) {
        campos.estado_item = true;
      } else {
        campos.estado_item = false;
      }
      console.log("Estado del item:", campos.estado_item);
    break;
  }
};

const inputs = document.querySelectorAll(".addForms input");

inputs.forEach((input) => {
  input.addEventListener("keyup", validarFormulario);
  input.addEventListener("blur", validarFormulario);
});

// Rueda del mouse sobre input numérico enfocado, sin importar dónde esté el cursor
window.addEventListener("wheel", (e) => {
  const active = document.activeElement;
  if (active && active.type === "number") {
    e.preventDefault();
    const step = Number(active.step) || 1;
    active.value = Number(active.value) + (e.deltaY < 0 ? step : -step);
    active.dispatchEvent(new Event("keyup", { bubbles: true }));
    active.dispatchEvent(new Event("input", { bubbles: true }));
  }
}, { passive: false });

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

const addItemForm = document.getElementById("additem-form");

// Un único submit listener para crear items (POST)
addItemForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const tipo = document.getElementById("tipoItem").value;
  let url, data;

  if (tipo === "medicamento") {
    url = API_MEDICAMENTOS;
    data = {
        id_medicamento: document.getElementById("idItem").value,
        nombre_medicamento: document.getElementById("nombreItem").value,
        categoria_medicamento: document.getElementById("categoriaItem").value,
        descripcion_medicamento: document.getElementById("descripcionItem").value,
        stock_disponible: document.getElementById("stockItem").value,
        fecha_vencimiento: document.getElementById("fechaVencimiento").value,
        estado_item: document.getElementById("estadoItem").value,
    };
  } else if (tipo === "insumo") {
    url = API_INSUMOS;
    data = {
        id_insumo: document.getElementById("idItem").value,
        nombre_insumo: document.getElementById("nombreItem").value,
        categoria_insumo: document.getElementById("categoriaItem").value,
        descripcion_insumo: document.getElementById("descripcionItem").value,
        stock_disponible: document.getElementById("stockItem").value,
        fecha_vencimiento: document.getElementById("fechaVencimiento").value,
        estado_item: document.getElementById("estadoItem").value,
    };
  }

  console.log("Datos a enviar:", data);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    console.log("Respuesta del servidor:", response);
    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Item creado correctamente",
        text: "El item se ha creado correctamente",
        timer: 2000,
        showConfirmButton: false,
      });
      closeForm();
      addItemForm.reset();
      cargarTodo();
    } else {
      throw new Error(`Error HTTP ${response.status}`);
    }
  } catch (error) {
    console.error("Error al crear item:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo registrar el item",
    });
  }
});

// Evento para guardar cambios de medicamento o insumo (PUT directo, sin submit)
guardarCambiosBtn.addEventListener("click", async () => {
  const tipo = document.getElementById("tipoItem").value;
  const id = document.getElementById("idItem").value;
  const stock_disponible = document.getElementById("stockItem").value;
  const estado_item = document.getElementById("estadoItem").value;

  let url, data;

  if (tipo === "medicamento") {
    url = API_MEDICAMENTOS;
    data = {
      id_medicamento: id,
      nombre_medicamento: document.getElementById("nombreItem").value,
      categoria_medicamento: document.getElementById("categoriaItem").value,
      descripcion_medicamento: document.getElementById("descripcionItem").value,
      stock_disponible,
      fecha_vencimiento: document.getElementById("fechaVencimiento").value,
      estado_item,
    };
  } else if (tipo === "insumo") {
    url = API_INSUMOS;
    data = {
      id_insumo: id,
      nombre_insumo: document.getElementById("nombreItem").value,
      categoria_insumo: document.getElementById("categoriaItem").value,
      descripcion_insumo: document.getElementById("descripcionItem").value,
      stock_disponible,
      fecha_vencimiento: document.getElementById("fechaVencimiento").value,
      estado_item,
    };
  }

  console.log("Datos a actualizar:", data);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      Swal.fire({
        title: "Cambios guardados correctamente",
        icon: "success",
        color: "#000000ff",
        confirmButtonColor: "#498EC9",
        timer: 3000,
        customClass: { popup: "inactivationPopup" },
      });
      closeForm();
      cargarTodo();
    } else {
      const errorText = await response.text();
      console.error("Error en la actualización:", errorText);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el item",
      });
    }
  } catch (err) {
    console.error("Error al conectar con el servidor:", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo conectar con el servidor",
    });
  }
});