// Configuración de los diferentes niveles de dificultad del juego
const configuracion = {
    sencillo: { filas: [10, 20], columnas: [10, 20], minas: 25 }, // Nivel sencillo
    normal: { filas: [20, 40], columnas: [20, 40], minas: 60 },   // Nivel normal
    avanzado: { filas: [40, 80], columnas: [40, 80], minas: 100 }, // Nivel avanzado
    experto: { filas: [80, 100], columnas: [80, 100], minas: 140 }, // Nivel experto
};

let tablero, filas, columnas, minas, minasRestantes, temporizador;
let juegoTerminado = false;
let tiempoTranscurrido = 0;

// Función que inicia el juego seleccionando la dificultad y configurando el tablero
function iniciarJuego() {
    const nivel = document.getElementById("dificultad").value; // Obtener nivel seleccionado
    const config = configuracion[nivel]; // Obtener configuración según nivel

    // Determina el número de filas y columnas aleatorias dentro del rango definido para ese nivel
    filas = Math.floor(Math.random() * (config.filas[1] - config.filas[0] + 1)) + config.filas[0];
    columnas = Math.floor(Math.random() * (config.columnas[1] - config.columnas[0] + 1)) + config.columnas[0];
    minas = config.minas;
    minasRestantes = minas;
    tiempoTranscurrido = 0;
    juegoTerminado = false;

    // Actualiza el contador de minas y el temporizador en la UI
    document.getElementById("contador-minas").textContent = `Minas restantes: ${minasRestantes}`;
    document.getElementById("temporizador").textContent = `Tiempo: ${tiempoTranscurrido}s`;

    // Crea el tablero, coloca las minas y actualiza los números alrededor de las minas
    crearTablero();
    colocarMinas();
    actualizarNumeros();
    iniciarTemporizador();
}

// Función para reiniciar el juego
function reiniciarJuego() {
    juegoTerminado = false;
    tiempoTranscurrido = 0;
    // Actualiza los contadores
    document.getElementById("contador-minas").textContent = `Minas restantes: ${minasRestantes}`;
    document.getElementById("temporizador").textContent = `Tiempo: ${tiempoTranscurrido}s`;
    tablero = [];
    // Vuelve a crear el tablero y las minas
    crearTablero();
    colocarMinas();
    actualizarNumeros();
    iniciarTemporizador();

    // Elimina el mensaje de "Has perdido"
    document.getElementById("perdido").style.display = "none";

    // Reinicia las minas restantes
    minasRestantes = minas;
}

// Función que crea el tablero en la interfaz
function crearTablero() {
    tablero = Array.from({ length: filas }, () =>
        Array.from({ length: columnas }, () => ({ mina: false, revelada: false, marcado: false, interrogacion: false, numero: 0 }))
    );
    const contenedor = document.getElementById("tablero");
    contenedor.innerHTML = ""; // Limpia el contenido previo del tablero
    contenedor.style.gridTemplateColumns = `repeat(${columnas}, 30px)`; // Define el número de columnas y el tamaño de las celdas

    // Crea cada celda del tablero y agrega los eventos para interactuar con ellas
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const celda = document.createElement("div");
            celda.classList.add("celda");
            celda.dataset.fila = i;
            celda.dataset.columna = j;
            celda.addEventListener("click", () => revelarCelda(i, j)); // Revelar celda al hacer clic
            celda.addEventListener("contextmenu", (e) => marcarCelda(e, i, j)); // Marcar celda al hacer clic derecho
            contenedor.appendChild(celda);
        }
    }
}

// Función que coloca minas de manera aleatoria en el tablero
function colocarMinas() {
    let minasColocadas = 0;
    while (minasColocadas < minas) {
        const fila = Math.floor(Math.random() * filas);
        const columna = Math.floor(Math.random() * columnas);
        if (!tablero[fila][columna].mina) {
            tablero[fila][columna].mina = true;
            minasColocadas++;
        }
    }
}

// Actualiza los números en el tablero, indicando cuántas minas hay alrededor de cada celda
function actualizarNumeros() {
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            if (!tablero[i][j].mina) {
                tablero[i][j].numero = contarMinasVecinas(i, j); // Cuenta minas vecinas para las celdas sin mina
            }
        }
    }
}

// Cuenta las minas vecinas de una celda
function contarMinasVecinas(fila, columna) {
    let contador = 0;
    // Recorre las celdas vecinas (8 direcciones alrededor)
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const nuevaFila = fila + i;
            const nuevaColumna = columna + j;
            // Verifica si la celda vecina está dentro del tablero y es una mina
            if (nuevaFila >= 0 && nuevaFila < filas && nuevaColumna >= 0 && nuevaColumna < columnas && tablero[nuevaFila][nuevaColumna].mina) {
                contador++;
            }
        }
    }
    return contador;
}

// Función que revela una celda, mostrando el número o la mina
function revelarCelda(fila, columna) {
    if (juegoTerminado || tablero[fila][columna].revelada || tablero[fila][columna].marcado) return; // Evita acciones si el juego terminó o la celda ya fue revelada o marcada

    const celda = document.querySelector(`[data-fila='${fila}'][data-columna='${columna}']`);
    tablero[fila][columna].revelada = true;
    celda.classList.add("revelada");

    if (tablero[fila][columna].mina) {
        celda.classList.add("mina");
        celda.innerHTML = "B"; // Muestra "B" para bomba
        // Muestra mensaje de pérdida
        const mensajePerdido = document.getElementById("perdido");
        mensajePerdido.style.fontWeight = "bold";
        mensajePerdido.style.fontSize = "24px";
        mensajePerdido.style.color = "red";
        mensajePerdido.textContent = "Has perdido!!";

        // Muestra todas las bombas
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                if (tablero[i][j].mina) {
                    const celda = document.querySelector(`[data-fila='${i}'][data-columna='${j}']`);
                    celda.classList.add("mina");
                    celda.innerHTML = "B";
                    celda.style.backgroundColor = "red";
                }
            }
        }
        juegoTerminado = true;
        clearInterval(temporizador);
        return;
    }

    // Si la celda tiene un número, lo muestra. Si no, revela las celdas vecinas
    if (tablero[fila][columna].numero > 0) {
        celda.textContent = tablero[fila][columna].numero;
    } else {
        revelarVecinas(fila, columna); // Revela las celdas vecinas si no hay minas cercanas
    }
}

// Función para revelar las celdas vecinas (recursiva)
function revelarVecinas(fila, columna) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const nuevaFila = fila + i;
            const nuevaColumna = columna + j;
            if (nuevaFila >= 0 && nuevaFila < filas && nuevaColumna >= 0 && nuevaColumna < columnas) {
                revelarCelda(nuevaFila, nuevaColumna);
            }
        }
    }
}

// Función para marcar o desmarcar celdas con el botón derecho del ratón
function marcarCelda(event, fila, columna) {
    event.preventDefault(); // Evita el menú contextual predeterminado
    if (juegoTerminado || tablero[fila][columna].revelada) return;

    const celda = document.querySelector(`[data-fila='${fila}'][data-columna='${columna}']`);
    if (!tablero[fila][columna].marcado && !tablero[fila][columna].interrogacion) {
        tablero[fila][columna].marcado = true;
        celda.classList.add("marcada");
        minasRestantes--;

        // Si todas las minas han sido marcadas correctamente, el jugador gana
        if (minasRestantes === 0) {
            for (let i = 0; i < filas; i++) {
                for (let j = 0; j < columnas; j++) {
                    if (tablero[i][j].mina && !tablero[i][j].marcado) {
                        const mensajePerdido = document.getElementById("perdido");
                        mensajePerdido.style.fontWeight = "bold";
                        mensajePerdido.style.fontSize = "24px";
                        mensajePerdido.style.color = "green";
                        mensajePerdido.textContent = "Has ganado!!";
                        juegoTerminado = true;
                        clearInterval(temporizador);
                    }
                }
            }

        } else {
            tablero[fila][columna].marcado = false;
            tablero[fila][columna].interrogacion = true;
            celda.classList.remove("marcada");
            celda.classList.add("interrogacion");
            minasRestantes++;
        }
    }
    // Actualiza el contador de minas restantes en la interfaz
    document.getElementById("contador-minas").textContent = `Minas restantes: ${minasRestantes}`;
}

// Función para iniciar el temporizador del juego
function iniciarTemporizador() {
    clearInterval(temporizador); // Elimina cualquier temporizador previo
    temporizador = setInterval(() => {
        tiempoTranscurrido++; // Incrementa el tiempo transcurrido
        document.getElementById("temporizador").textContent = `Tiempo: ${tiempoTranscurrido}s`; // Actualiza el temporizador en la interfaz
    }, 1000); // Incrementa cada segundo
}

