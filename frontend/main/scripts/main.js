let imagenActual = 0;

const slider = document.querySelector("#slider");
const btn1 = document.querySelector("#slider-btn1");
const btn2 = document.querySelector("#slider-btn2");
const btn3 = document.querySelector("#slider-btn3");

const topButton = document.querySelector("#backTopbutton");

let estadoTemporizador;

const stop = document.querySelector("#stopButton");
const stopIcon = document.querySelector("#stopIcon");

const start = document.querySelector("#startButton");
const startIcon = document.querySelector("#startIcon");

const imagenCita = document.querySelector("#citaSection");
const tituloSecundario = document.querySelector("#secundaryTitle");
const textoSecundario = document.querySelector("#secundaryText");
const iconosSecundarios = document.querySelectorAll("#iconText1, #iconText2, #iconText3");

const boletinSeccion = document.querySelector("#newsLetterSection");
const tituloBoletin = document.querySelector("#newsLetter");

const fieldId = document.querySelector("#id-usuario");

function clicDerecha() {
  document.querySelector("#btn-right").addEventListener('click', () => {
    imagenActual++;

    if (imagenActual == 1) 
      {btn2.classList.remove("deSelected");
      btn2.classList.add("selected");
      btn1.classList.remove("selected");
      btn1.classList.add("deSelected");
      btn3.classList.remove("selected");
      btn3.classList.add("deSelected");

      slider.style.marginLeft = `-${imagenActual * 101.5}%`;
      slider.style.transition = "all 1s";} 
    else if (imagenActual == 2) {
      btn3.classList.remove("deSelected");
      btn3.classList.add("selected");
      btn2.classList.remove("selected");
      btn2.classList.add("deSelected");
      btn1.classList.remove("selected");
      btn1.classList.add("deSelected");

      slider.style.marginLeft = `-${imagenActual * 101.5}%`;
      slider.style.transition = "all 1s";} 
    else if (imagenActual == 3) 
      {imagenActual = 0;

      slider.style.marginLeft = `-${imagenActual * 101.5}%`;
      slider.style.transition = "all 1s";

      btn1.classList.remove("deSelected");
      btn1.classList.add("selected");
      btn2.classList.remove("selected");
      btn2.classList.add("deSelected");
      btn3.classList.remove("selected");
      btn3.classList.add("deSelected");}
  });
}

function clicIzquierda() {
  document.querySelector("#btn-left").addEventListener("click", () => {
    imagenActual--;

    if (imagenActual == -1) 
    {imagenActual = 2;

      btn3.classList.remove("deSelected");
      btn3.classList.add("selected");
      btn2.classList.remove("selected");
      btn2.classList.add("deSelected");
      btn1.classList.remove("selected");
      btn1.classList.add("deSelected");

      slider.style.marginLeft = `-${imagenActual * 100.5}%`;
      slider.style.transition = "all 1s";}
    
    else if (imagenActual === 1)
      {btn2.classList.remove("deSelected");
      btn2.classList.add("selected");
      btn1.classList.remove("selected");
      btn1.classList.add("deSelected");
      btn3.classList.remove("selected");
      btn3.classList.add("deSelected");

      slider.style.marginLeft = `-${imagenActual * 100.5}%`;
      slider.style.transition = "all 1s";}
    else if (imagenActual === 0)
      {slider.style.marginLeft = `-${imagenActual * 100.5}%`;
      slider.style.transition = "all 1s";

      btn1.classList.remove("deSelected");
      btn1.classList.add("selected");
      btn2.classList.remove("selected");
      btn2.classList.add("deSelected");
      btn3.classList.remove("selected");
      btn3.classList.add("deSelected");}
  });
}

function sliderButton1 () {
      document.querySelector("#slider-btn1").addEventListener("click", () => {
      imagenActual = 0;
        
      {slider.style.marginLeft = `-${imagenActual * 0}%`;
      slider.style.transition = "all 1s";

      btn1.classList.remove("deSelected");
      btn1.classList.add("selected");
      btn2.classList.remove("selected");
      btn2.classList.add("deSelected");
      btn3.classList.remove("selected");
      btn3.classList.add("deSelected");}
    })
}

function sliderButton2 () {
      document.querySelector("#slider-btn2").addEventListener("click", () => {
      imagenActual = 1;
        
      {slider.style.marginLeft = `-${imagenActual * 100.5}%`;
      slider.style.transition = "all 1s";

      btn2.classList.remove("deSelected");
      btn2.classList.add("selected");
      btn1.classList.remove("selected");
      btn1.classList.add("deSelected");
      btn3.classList.remove("selected");
      btn3.classList.add("deSelected");}
    })
}

function sliderButton3 () {
      document.querySelector("#slider-btn3").addEventListener("click", () => {
      imagenActual = 2;
        
      {slider.style.marginLeft = `-${imagenActual * 100.5}%`;
      slider.style.transition = "all 1s";
        
      btn3.classList.remove("deSelected");
      btn3.classList.add("selected");
      btn2.classList.remove("selected");
      btn2.classList.add("deSelected");
      btn1.classList.remove("selected");
      btn1.classList.add("deSelected");}
    })
}

function inicarTemporizador () {
  document.querySelector("#startButton").addEventListener("click", () => {
    document.querySelector("#buttonRight").click();

    const start = document.querySelector("#startButton");
      start.style.opacity = "0%"
      start.style.pointerEvents = "none";
      
    const startIcon = document.querySelector("#startIcon");
      startIcon.style.opacity = "0%";
      startIcon.style.pointerEvents = "none";

    const stop = document.querySelector("#stopButton");
      stop.style.opacity = "75%";
      stop.style.pointerEvents = "all";
      
    const stopIcon = document.querySelector("#stopIcon");
      stopIcon.style.opacity = "75%";
      stopIcon.style.pointerEvents = "all";

    estadoTemporizador = setInterval(() => {
      document.querySelector("#buttonRight").click();
    }, 6000);
  });
}

estadoTemporizador = setInterval(() => {
      document.querySelector("#buttonRight").click();
    }, 6000);

function detenerTemporizador () {
  document.querySelector("#stopButton").addEventListener("click", () => {
    clearInterval(estadoTemporizador);
    
    {const stop = document.querySelector("#stopButton");
      stop.style.opacity = "0%"
      stop.style.pointerEvents = "none";
      
    const stopIcon = document.querySelector("#stopIcon");
      stopIcon.style.opacity = "0%";
      stopIcon.style.pointerEvents = "none";
  
    const start = document.querySelector("#startButton");
      start.style.opacity = "75%";
      start.style.pointerEvents = "all";
      
    const startIcon = document.querySelector("#startIcon");
      startIcon.style.opacity = "75%";
      startIcon.style.pointerEvents = "all";
    }
})
}

function scrollAnimationmain() {
  window.addEventListener("scroll", () => {
    const imagenCita = document.querySelector("#citaSection");
    const tituloSecundario = document.querySelector("#secundaryTitle");
    const textoSecundario = document.querySelector("#secundaryText");
    const botonCita = document.querySelector("#buttonCita");

    if (window.scrollY > 780) 
      {imagenCita.style.animation = "fade-down 1s ease-out forwards";
        imagenCita.style.opacity = "100%";
        
        tituloSecundario.style.animation = "fade-down 1s ease-out forwards";
        tituloSecundario.opacity = "100%";

        textoSecundario.style.animation = "fade-down 1s ease-out forwards";
        textoSecundario.opacity = "100%";

        botonCita.style.animation = "fade-down 1s ease-out forwards";
        botonCita.opacity = "100%";

        iconosSecundarios.forEach(icono => {
        icono.style.animation = "fade-down 1s ease-out forwards";
        icono.style.opacity = "100%";
        });
      }
    
    const tituloBoletin = document.querySelector("#newsLetter"); 
      
    if (window.scrollY > 1700)
      {tituloBoletin.style.animation = "fade-down 1s ease-out forwards";
      tituloBoletin.opacity = "80%";}

    const boletinSeccion = document.querySelector("#newsLetterSection");  
    
    if (window.scrollY > 2140)
      {boletinSeccion.style.animation = "fade-down 1s ease-out forwards";
      boletinSeccion.style.opacity = "100%";} 
  })
}

clicDerecha();
clicIzquierda();
sliderButton1();
sliderButton2();
sliderButton3();
detenerTemporizador();
inicarTemporizador();
scrollAnimationmain();