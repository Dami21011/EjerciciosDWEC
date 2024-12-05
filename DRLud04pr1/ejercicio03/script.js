// Datos iniciales
const doctores = ["Dr. Pérez", "Dr. Gómez", "Dr. Fernández"];
const citas = Array(doctores.length).fill().map(() => []); // Array bidimensional para citas

// Referencias a elementos HTML
const seleccionDoctor = document.getElementById("SelecDoctor");
const listaConsultas = document.getElementById("ListaConsultas");
const botonAgregarCita = document.getElementById("agregarcitas");
const inputNombrePaciente = document.getElementById("nombrePaciente");

// Inicializar opciones de doctores en el select
function inicializarOpcionesDoctores() {
    doctores.forEach((doctor, indice) => {
        const opcion = document.createElement("option");
        opcion.value = indice;
        opcion.textContent = doctor;
        seleccionDoctor.appendChild(opcion);
    });
}

// Agregar cita de paciente
function agregarCita() {
    const nombrePaciente = inputNombrePaciente.value.trim();
    const indiceDoctorSeleccionado = seleccionDoctor.value;

    if (nombrePaciente && indiceDoctorSeleccionado !== "") {
        citas[indiceDoctorSeleccionado].push(nombrePaciente); // Añadir a la consulta correspondiente
        inputNombrePaciente.value = ""; // Limpiar el campo de texto
        renderizarConsultas(); // Actualizar la vista
    } else {
        alert("Por favor, ingresa un nombre de paciente y selecciona un doctor.");
    }
}

// Llamar al siguiente paciente de la consulta
function siguientePaciente(indiceDoctor) {
    if (citas[indiceDoctor].length > 0) {
        citas[indiceDoctor].shift(); // Eliminar el primer paciente en la lista
        renderizarConsultas(); // Actualizar la vista
    } else {
        alert(`No hay más pacientes para el ${doctores[indiceDoctor]}.`);
    }
}

// Renderizar la lista de consultas y pacientes
function renderizarConsultas() {
    listaConsultas.innerHTML = ""; // Limpiar la lista antes de renderizar
    doctores.forEach((doctor, indice) => {
        const divConsultas = document.createElement("div");
        divConsultas.classList.add("consulta");

        const nombreDoctor = document.createElement("h3");
        nombreDoctor.textContent = doctor;
        divConsultas.appendChild(nombreDoctor);

        const listaPacientes = document.createElement("ul");
        citas[indice].forEach((paciente) => {
            const itemLista = document.createElement("li");
            itemLista.textContent = paciente;
            listaPacientes.appendChild(itemLista);
        });
        divConsultas.appendChild(listaPacientes);

        const botonProximoPaciente = document.createElement("button");
        botonProximoPaciente.textContent = "Siguiente paciente";
        botonProximoPaciente.classList.add("next-patient");
        botonProximoPaciente.onclick = () => siguientePaciente(indice);
        divConsultas.appendChild(botonProximoPaciente);

        listaConsultas.appendChild(divConsultas);
    });
}

// Inicializar la interfaz
function iniciar() {
    inicializarOpcionesDoctores();
    renderizarConsultas();
}

// Eventos
botonAgregarCita.addEventListener("click", agregarCita);

// Inicializar todo
iniciar();
