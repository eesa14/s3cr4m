
async function cargarPreguntas() {
    try {
        const response = await fetch("preguntas_con_imagenes.json");
        const todas = await response.json();
        return todas.sort(() => Math.random() - 0.5).slice(0, 75);
    } catch (error) {
        console.error("Error al cargar las preguntas:", error);
        return [];
    }
}

async function iniciarCuestionario() {
    const preguntas = await cargarPreguntas();
    if (preguntas.length === 0) {
        document.getElementById("contenedor-preguntas").innerHTML = "<p>Error al cargar las preguntas.</p>";
        return;
    }

    let indice = 0;
    const contenedor = document.getElementById("contenedor-preguntas");
    const anteriorBtn = document.getElementById("anterior");
    const siguienteBtn = document.getElementById("siguiente");
    const paginaInfo = document.getElementById("pagina-info");

    function mostrarPregunta() {
        contenedor.innerHTML = "";
        const pregunta = preguntas[indice];

        const div = document.createElement("div");
        div.className = "pregunta";
        div.innerHTML = `<p>${pregunta.pregunta}</p>`;

        if (pregunta.imagenes && pregunta.imagenes.length > 0) {
            pregunta.imagenes.forEach(img => {
                const imagen = document.createElement("img");
                imagen.src = img.url;
                imagen.style.maxWidth = "100%";
                imagen.style.margin = "10px 0";
                div.appendChild(imagen);
            });
        }

        const opcionesDiv = document.createElement("div");
        opcionesDiv.className = "opciones";

        let seleccion = new Set();
        pregunta.opciones.forEach((opcionTexto, idx) => {
            const opcionDiv = document.createElement("div");
            opcionDiv.className = "opcion";
            opcionDiv.textContent = opcionTexto;

            if (pregunta.imagenes_respuesta) {
                const imagenObj = pregunta.imagenes_respuesta.find(i => opcionTexto.startsWith(i.opcion));
                if (imagenObj) {
                    const imagen = document.createElement("img");
                    imagen.src = imagenObj.url;
                    imagen.style.maxWidth = "100%";
                    imagen.style.marginLeft = "10px";
                    opcionDiv.appendChild(imagen);
                }
            }

            opcionDiv.addEventListener("click", () => {
                if (opcionDiv.classList.contains("correcta") || opcionDiv.classList.contains("incorrecta")) return;

                const letra = opcionTexto.trim().charAt(0);
                const esCorrecta = pregunta.respuestas_correctas.includes(letra);

                if (pregunta.respuestas_correctas.length > 1) {
                    if (seleccion.has(letra)) {
                        seleccion.delete(letra);
                        opcionDiv.classList.remove("seleccionada");
                    } else {
                        seleccion.add(letra);
                        opcionDiv.classList.add("seleccionada");
                    }

                    if (seleccion.size === pregunta.respuestas_correctas.length) {
                        opcionesDiv.querySelectorAll(".opcion").forEach(opt => {
                            const letraOpt = opt.textContent.trim().charAt(0);
                            if (pregunta.respuestas_correctas.includes(letraOpt)) {
                                opt.classList.add("correcta");
                            } else if (seleccion.has(letraOpt)) {
                                opt.classList.add("incorrecta");
                            }
                        });
                    }
                } else {
                    if (esCorrecta) {
                        opcionDiv.classList.add("correcta");
                    } else {
                        opcionDiv.classList.add("incorrecta");
                        const correcta = [...opcionesDiv.children].find(opt =>
                            pregunta.respuestas_correctas.includes(opt.textContent.trim().charAt(0)));
                        if (correcta) correcta.classList.add("correcta");
                    }
                }
            });

            opcionesDiv.appendChild(opcionDiv);
        });

        div.appendChild(opcionesDiv);
        contenedor.appendChild(div);

        paginaInfo.textContent = `${indice + 1} / ${preguntas.length}`;
        anteriorBtn.disabled = indice === 0;
        siguienteBtn.disabled = indice === preguntas.length - 1;
    }

    anteriorBtn.onclick = () => {
        if (indice > 0) {
            indice--;
            mostrarPregunta();
        }
    };

    siguienteBtn.onclick = () => {
        if (indice < preguntas.length - 1) {
            indice++;
            mostrarPregunta();
        }
    };

    mostrarPregunta();
}

window.onload = iniciarCuestionario;
