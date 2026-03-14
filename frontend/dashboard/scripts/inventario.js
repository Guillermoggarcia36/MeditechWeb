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
});

const overlay = document.getElementById("overlay");
const addItemContainer = document.getElementById("additem-container");

const cancelBtnForms = document.querySelectorAll(".cancelBtn");
cancelBtnForms.forEach((btn) => {
  btn.addEventListener("click", () => closeForm());
});

function openForm() {
  overlay.classList.add("active");
  addItemContainer.style.display = "block";
}

function closeForm() {
  overlay.classList.remove("active");
  addItemContainer.style.display = "none";

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
}

const nuevoItemBtn = document.getElementById("nuevo-itemBtn");
nuevoItemBtn.addEventListener("click", () => openForm());

ocultarConstruccion();

const inventarioBody = document.getElementById("inventario-body");
const medicamentoBtn = document.getElementById("medicamentoBtn");
const insumosBtn = document.getElementById("insumosBtn");

let todosLosMedicamentos = [];
let todosLosInsumos = [];

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
            <td>${item.id_medicamento}</td>
            <td>${item.stock_disponible}</td>
            <td>${item.nombre_medicamento}</td>
            <td>${item.categoria_medicamento}</td>
            <td class="td-descripcion">${item.descripcion_medicamento}</td>
            <td>${formatearFecha(item.fecha_vencimiento)}</td>
            <td>
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
            <td>${item.id_insumo}</td>
            <td>${item.stock_disponible}</td>
            <td>${item.nombre_insumo}</td>
            <td>${item.categoria_insumo}</td>
            <td class="td-descripcion">${item.descripcion_insumo}</td>
            <td>${formatearFecha(item.fecha_vencimiento)}</td>
            <td>
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

async function cargarTodo() {
  try {
    const [medicamentos, insumos] = await Promise.all([
      fetch(API_MEDICAMENTOS).then((r) => r.json()),
      fetch(API_INSUMOS).then((r) => r.json()),
    ]);

    todosLosMedicamentos = medicamentos;
    todosLosInsumos = insumos;

    inventarioBody.innerHTML = "";

    todosLosMedicamentos.forEach((item) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
                <td>${item.id_medicamento}</td>
                <td>${item.stock_disponible}</td>
                <td>${item.nombre_medicamento}</td>
                <td>${item.categoria_medicamento}</td>
                <td class="td-descripcion">${item.descripcion_medicamento}</td>
                <td>${formatearFecha(item.fecha_vencimiento)}</td>
                <td>
                    <button class="ver-medicamento" data-id="${item.id_medicamento}" data-tipo="medicamento" style=" border: none; background-color: transparent;">
                        <img src="../assets/icons/ver2.png" alt="Ver" style="width:26px; height:26px;">
                    </button>
                    <button class="editar-medicamento" data-id="${item.id_medicamento}" data-tipo="medicamento" style=" border: none; background-color: transparent;">
                        <img src="../assets/icons/editar.png" alt="Editar" style="width:26px; height:26px;">
                    </button>
                    <button class="inactivar-medicamento" data-id="${item.id_medicamento}" data-tipo="medicamento" style=" border: none; background-color: transparent;">
                        <img src="../assets/icons/borrar.png" alt="Inactivar" style="width:26px; height:26px;">
                    </button>
                </td>
            `;
      fila.querySelector(".ver-medicamento").dataset.item = JSON.stringify(item);
      fila.querySelector(".inactivar-medicamento").dataset.item = JSON.stringify(item);
      inventarioBody.appendChild(fila);
    });

    todosLosInsumos.forEach((item) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
                <td>${item.id_insumo}</td>
                <td>${item.stock_disponible}</td>
                <td>${item.nombre_insumo}</td>
                <td>${item.categoria_insumo}</td>
                <td class="td-descripcion">${item.descripcion_insumo}</td>
                <td>${formatearFecha(item.fecha_vencimiento)}</td>
                <td>
                    <button class="ver-insumo" data-id="${item.id_insumo}" data-tipo="insumo" style=" border: none; background-color: transparent;">
                        <img src="../assets/icons/ver2.png" alt="Ver" style="width:26px; height:26px;">
                    </button>
                    <button class="editar-insumo" data-id="${item.id_insumo}" data-tipo="insumo" style=" border: none; background-color: transparent;">
                        <img src="../assets/icons/editar.png" alt="Editar" style="width:26px; height:26px;">
                    </button>
                    <button class="inactivar-insumo" data-id="${item.id_insumo}" data-tipo="insumo" style=" border: none; background-color: transparent;">
                        <img src="../assets/icons/borrar.png" alt="Inactivar" style="width:26px; height:26px;">
                    </button>
                </td>
            `;
      fila.querySelector(".ver-insumo").dataset.item = JSON.stringify(item);
      fila.querySelector(".inactivar-insumo").dataset.item = JSON.stringify(item);
      inventarioBody.appendChild(fila);
    });
  } catch (error) {
    console.error("Error cargando inventario:", error);
  }
}

medicamentoBtn.addEventListener("click", () => {
  if (medicamentoBtn.classList.contains("active")) {
    medicamentoBtn.classList.remove("active");
    cargarTodo();
  } else {
    medicamentoBtn.classList.add("active");
    insumosBtn.classList.remove("active");
    renderMedicamentos(todosLosMedicamentos);
  }
});

insumosBtn.addEventListener("click", () => {
  if (insumosBtn.classList.contains("active")) {
    insumosBtn.classList.remove("active");
    cargarTodo();
  } else {
    insumosBtn.classList.add("active");
    medicamentoBtn.classList.remove("active");
    renderInsumos(todosLosInsumos);
  }
});

inventarioBody.addEventListener("click", (e) => {
  const btnMed = e.target.closest(".ver-medicamento");
  if (btnMed) {
    const item = JSON.parse(btnMed.dataset.item);
    Swal.fire({
      title: item.nombre_medicamento,
      html: `
                <div style="text-align:left; line-height:1.8;">
                    <p><strong>ID:</strong> ${item.id_medicamento}</p>
                    <p><strong>Stock:</strong> ${item.stock_disponible}</p>
                    <p><strong>Categoría:</strong> ${item.categoria_medicamento}</p>
                    <p><strong>Descripción:</strong> ${item.descripcion_medicamento}</p>
                    <p><strong>Vencimiento:</strong> ${formatearFecha(item.fecha_vencimiento)}</p>
                    <p><strong>Estado:</strong> ${item.estado_item}</p>
                </div>
            `,
      confirmButtonText: "<b>Cerrar</b>",
      confirmButtonColor: "#498EC9",
    });
    return;
  }

  const btnIns = e.target.closest(".ver-insumo");
  if (btnIns) {
    const item = JSON.parse(btnIns.dataset.item);
    Swal.fire({
      title: item.nombre_insumo,
      html: `
                <div style="text-align:left; line-height:1.8;">
                    <p><strong>ID:</strong> ${item.id_insumo}</p>
                    <p><strong>Stock:</strong> ${item.stock_disponible}</p>
                    <p><strong>Categoría:</strong> ${item.categoria_insumo}</p>
                    <p><strong>Descripción:</strong> ${item.descripcion_insumo}</p>
                    <p><strong>Vencimiento:</strong> ${formatearFecha(item.fecha_vencimiento)}</p>
                    <p><strong>Estado:</strong> ${item.estado_item}</p>
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
    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Item registrado",
        text: "El item se ha registrado correctamente",
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