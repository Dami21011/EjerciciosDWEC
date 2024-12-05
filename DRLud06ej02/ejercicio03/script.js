document.addEventListener("DOMContentLoaded", () => {
    const paleta = document.getElementById("paleta");
    const zonadibujo = document.getElementById("zonadibujo");
    const mensaje = document.getElementById("mensaje");
    let colorSeleccionado = "";
    let pincelActivado = false;

    // Crear el tablero
    for (let i = 0; i < 900; i++) { // 30 x 30 = 900 celdas
        const celda = document.createElement("div");
        celda.classList.add("celda");
        celda.addEventListener("mouseover", (event) => {
            if (pincelActivado && colorSeleccionado) {
                event.target.style.backgroundColor = colorSeleccionado;
            }
        });
        zonadibujo.appendChild(celda);
    }

    // Eventos de la paleta de colores
    paleta.querySelectorAll(".color").forEach(colorDiv => {
        colorDiv.addEventListener("click", () => {
            // Limpiar selección de color anterior
            paleta.querySelectorAll(".color").forEach(c => c.classList.remove("seleccionado"));
            colorSeleccionado = getComputedStyle(colorDiv).backgroundColor;
            colorDiv.classList.add("seleccionado");
            pincelActivado = true;
            mensaje.textContent = "PINCEL ACTIVADO";
        });
    });

    // Evento para el click en celdas
    zonadibujo.addEventListener("click", (event) => {
        if (event.target.classList.contains("celda")) {
            if (pincelActivado) {
                // Detener el pincel
                pincelActivado = false;
                mensaje.textContent = "PINCEL DESACTIVADO";
            } else {
                pincelActivado = true;
                mensaje.textContent = "PINCEL ACTIVADO";
            }
        }
    });
});
