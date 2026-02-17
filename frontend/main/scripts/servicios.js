const maps = document.querySelector("#sedes-container iframe");
const gestionSeccion = document.querySelector("#gestion-container");

const imagenServicio = document.querySelector("#img-container img");
if (imagenServicio) {
  window.addEventListener("scroll", () => {
    const desplazamiento = window.scrollY * 0.3;
    imagenServicio.style.transform = `translateY(-${desplazamiento}px)`;
  });
}

window.addEventListener("scroll", () => {
    if (window.scrollY > 850) {
        gestionSeccion.style.animation = "fadeIn 1s ease-out forwards";
        gestionSeccion.style.visibility = "visible";
    }
    if (window.scrollY > 1600) {
        maps.style.animation = "fadeIn 1.50s ease-out";
        maps.style.opacity = "100%";
        maps.style.visibility = "visible";
    }
});


const botonMedicos = document.querySelector("#btn-medicos");
const medicosSeccion = document.querySelector("#medicos-container");

const botonGestion = document.querySelector("#btn-gestion");
function selectorServicios() { 
    botonMedicos.addEventListener("click", () => {

    gestionSeccion.style.display = "none";
    gestionSeccion.style.pointerEvents = "none";
    botonGestion.style.borderRight = "none";
    botonGestion.style.backgroundColor = "white";
    botonGestion.style.boxShadow = "none";
    
    medicosSeccion.style.display = "grid";
    medicosSeccion.style.pointerEvents = "all";
    botonMedicos.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
    botonMedicos.style.borderRight = "5px solid #498EC9";
    botonMedicos.style.backgroundColor = "#92969946";
});
   
    botonGestion.addEventListener("click", () => {
    
    medicosSeccion.style.display = "none";
    medicosSeccion.style.pointerEvents = "none";
    botonMedicos.style.boxShadow = "none";
    botonMedicos.style.borderRight = "none";
    botonMedicos.style.backgroundColor = "white";
    
    gestionSeccion.style.display = "grid";
    gestionSeccion.style.pointerEvents = "all";
    botonGestion.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
    botonGestion.style.borderRight = "5px solid #498EC9";
    botonGestion.style.backgroundColor = "#92969946";
});
}  

selectorServicios();