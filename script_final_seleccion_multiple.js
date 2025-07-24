
let preguntas = [];
let indice = 0;
let respuestasCorrectas = 0;
let respuestasMarcadas = [];

async function cargarPreguntas() {
    const response = await fetch("preguntas_con_imagenes.json");
    const todas = await response.json();
    const seleccionadas = [];
    const usados = new Set();
    while (seleccionadas.length < 75 && usados.size < todas.length) {
        const idx = Math.floor(Math.random() * todas.length);
        if (!usados.has(idx)) {
            usados.add(idx);
            seleccionadas.push(todas[idx]);
        }
    }
    return seleccionadas;
}

function crearBotonOpcion(texto, letra, correcta, imagenURL) {
    const btn = document.createElement("button");
    btn.className = "opcion";
    btn.textContent = texto;
    btn.dataset.opcion = letra;
    btn.style.color = "#000"; // texto negro por defecto
    btn.dataset.seleccionada = "false";

    if (imagenURL) {
        const img = document.createElement("img");
        img.src = imagenURL;
        img.alt = "Imagen";
        img.style.display = "block";
        img.style.maxHeight = "100px";
        img.style.marginTop = "10px";
        btn.appendChild(img);
    }

    btn.addEventListener("click", () => {
        const seleccionada = btn.dataset.seleccionada === "true";
        btn.dataset.seleccionada = (!seleccionada).toString();
        btn.style.backgroundColor = seleccionada ? "#f2f2f2" : "#cce5ff";
        btn.style.color = "#000";
    });

    return btn;
}

function mostrarPregunta() {
    const contenedor = document.getElementById("contenedor-preguntas");
    contenedor.innerHTML = "";

    const pregunta = preguntas[indice];
    const divPregunta = document.createElement("div");
    divPregunta.className = "pregunta";
    divPregunta.innerHTML = pregunta.pregunta;

    if (pregunta.imagenes && pregunta.imagenes.length > 0) {
        pregunta.imagenes.forEach(img => {
            const imagen = document.createElement("img");
            imagen.src = img.url;
            imagen.alt = "Imagen pregunta";
            imagen.style.maxWidth = "100%";
            imagen.style.marginTop = "10px";
            divPregunta.appendChild(document.createElement("br"));
            divPregunta.appendChild(imagen);
        });
    }

    const divOpciones = document.createElement("div");
    divOpciones.className = "opciones";

    pregunta.opciones.forEach(opcionTexto => {
        const letra = opcionTexto.trim().charAt(0).toUpperCase();
        const imagenResp = (pregunta.imagenes_respuesta || []).find(img => img.opcion === letra);
        const boton = crearBotonOpcion(opcionTexto, letra, pregunta.respuestas_correctas.includes(letra), imagenResp?.url);
        divOpciones.appendChild(boton);
    });

    contenedor.appendChild(divPregunta);
    contenedor.appendChild(divOpciones);

    document.getElementById("anterior").disabled = indice === 0;
    document.getElementById("siguiente").textContent = indice === preguntas.length - 1 ? "Finalizar" : "Siguiente";
    document.getElementById("pagina-info").textContent = `Pregunta ${indice + 1} de ${preguntas.length}`;
}

function validarRespuestasActuales() {
    const botones = document.querySelectorAll(".opcion");
    const seleccionadas = Array.from(botones).filter(b => b.dataset.seleccionada === "true").map(b => b.dataset.opcion);
    const correctas = preguntas[indice].respuestas_correctas;

    let todasCorrectas = true;

    botones.forEach(b => {
        const letra = b.dataset.opcion;
        const esCorrecta = correctas.includes(letra);
        const fueSeleccionada = seleccionadas.includes(letra);

        if (esCorrecta && fueSeleccionada) {
            b.style.backgroundColor = "green";
            b.style.color = "white";
        } else if (!esCorrecta && fueSeleccionada) {
            b.style.backgroundColor = "red";
            b.style.color = "white";
            todasCorrectas = false;
        } else if (esCorrecta && !fueSeleccionada) {
            b.style.backgroundColor = "orange"; // correctas no marcadas
        }

        b.disabled = true;
    });

    if (todasCorrectas && respuestasMarcadas[indice] !== true) {
        respuestasCorrectas++;
        respuestasMarcadas[indice] = true;
    } else {
        respuestasMarcadas[indice] = false;
    }
}

async function iniciarCuestionario() {
    preguntas = await cargarPreguntas();
    mostrarPregunta();

    document.getElementById("anterior").onclick = () => {
        if (indice > 0) {
            indice--;
            mostrarPregunta();
        }
    };

    document.getElementById("siguiente").onclick = () => {
        validarRespuestasActuales();
        setTimeout(() => {
            if (indice < preguntas.length - 1) {
                indice++;
                mostrarPregunta();
            } else {
                mostrarResultadoFinal();
            }
        }, 800);
    };
}

function mostrarResultadoFinal() {
    document.getElementById("contenedor-preguntas").style.display = "none";
    document.querySelector(".pagina-control").style.display = "none";
    const resultado = document.getElementById("resultado-final");
    const texto = document.getElementById("texto-resultado");
    resultado.style.display = "block";

    const total = respuestasMarcadas.length;
    const porcentaje = ((respuestasCorrectas / total) * 100).toFixed(2);
    texto.innerHTML = `Respondiste correctamente <strong>${respuestasCorrectas}</strong> de <strong>${total}</strong> preguntas.<br>Tu puntaje es <strong>${porcentaje}%</strong>`;
}

window.onload = iniciarCuestionario;
