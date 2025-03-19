// Declarar el array para almacenar los nombres de los amigos
let amigos = [];
let amigosSorteados = []; // Lista para almacenar los amigos ya sorteados

// Función para mostrar notificaciones con sonido
function mostrarNotificacion(mensaje, tipo = "info") {
    const contenedor = document.getElementById("notificaciones");
    const notificacion = document.createElement("div");
    notificacion.classList.add("notificacion");

    // Seleccionar el sonido según el tipo
    const sonidoExito = document.getElementById("sonidoExito");
    const sonidoError = document.getElementById("sonidoError");

    if (tipo === "error") {
        notificacion.style.backgroundColor = "#FFCCCC";
        notificacion.style.color = "#D8000C";
        sonidoError.play(); // Reproducir sonido de error
    } else if (tipo === "success") {
        notificacion.style.backgroundColor = "#DFF2BF";
        notificacion.style.color = "#4F8A10";
        sonidoExito.play(); // Reproducir sonido de éxito
    }

    notificacion.innerHTML = `
        <span>${mensaje}</span>
        <button class="cerrar-notificacion" onclick="this.parentElement.remove()">✖</button>
    `;

    contenedor.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Función para agregar amigos
function agregarAmigo() {
    const inputAmigo = document.getElementById("amigo");
    const nombreAmigo = inputAmigo.value.trim();

    if (nombreAmigo === "") {
        mostrarNotificacion("Por favor, inserte un nombre.", "error");
        return;
    }

    const regexSoloTexto = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regexSoloTexto.test(nombreAmigo)) {
        mostrarNotificacion("El nombre solo debe contener letras y caracteres válidos.", "error");
        return;
    }

    if (amigos.includes(nombreAmigo)) {
        mostrarNotificacion("Este nombre ya ha sido agregado.", "error");
        return;
    }

    amigos.push(nombreAmigo);
    inputAmigo.value = "";
    actualizarListaAmigos();
    mostrarNotificacion("Amigo agregado correctamente.", "success");
}

// Función para actualizar la lista de amigos
function actualizarListaAmigos() {
    const listaAmigos = document.getElementById("listaAmigos");
    listaAmigos.innerHTML = "";

    amigos.forEach((amigo) => {
        const li = document.createElement("li");
        li.textContent = amigo;

        // Si el amigo ya fue sorteado, se deshabilita visualmente
        if (amigosSorteados.includes(amigo)) {
            li.style.textDecoration = "line-through";
            li.style.color = "#C4C4C4";
        }

        listaAmigos.appendChild(li);
    });
}

function sortearAmigo() {
    if (amigos.length === 0) {
        mostrarNotificacion("No hay amigos en la lista para sortear.", "error");
        return;
    }

    // Reproducir el sonido de ganador
    const sonidoGanador = document.getElementById("sonidoGanador");
    sonidoGanador.play();

    // Filtrar amigos que no han sido sorteados
    const amigosDisponibles = amigos.filter((amigo) => !amigosSorteados.includes(amigo));

    if (amigosDisponibles.length === 0) {
        mostrarNotificacion("Todos los amigos han sido sorteados. El juego ha terminado.", "success");

        // Cambiar el botón a "Nuevo Sorteo"
        cambiarBotonANuevoSorteo();
        return;
    }

    const resultado = document.getElementById("resultado");

    // Deshabilitar el campo de entrada y el botón de añadir
    document.getElementById("amigo").disabled = true;
    document.querySelector(".button-add").disabled = true;

    // Generar un índice aleatorio
    const indiceFinal = Math.floor(Math.random() * amigosDisponibles.length);
    const amigoSorteado = amigosDisponibles[indiceFinal];

    let indiceActual = 0;
    const velocidad = 100; // Velocidad de cambio de color (en milisegundos)
    const ciclos = 3; // Número de ciclos completos antes de detenerse
    let totalPasos = ciclos * amigosDisponibles.length + indiceFinal;

    // Obtener los elementos de la lista de amigos disponibles
    const listaAmigos = Array.from(document.getElementById("listaAmigos").children).filter(
        (li) => !amigosSorteados.includes(li.textContent)
    );

    // Animación de desplazamiento
    const intervalo = setInterval(() => {
        // Restablecer el color del amigo anterior
        if (indiceActual > 0) {
            listaAmigos[(indiceActual - 1) % amigosDisponibles.length].classList.remove("amigo-seleccionado");
        }

        // Cambiar el color del amigo actual
        listaAmigos[indiceActual % amigosDisponibles.length].classList.add("amigo-seleccionado");

        // Incrementar el índice actual
        indiceActual++;

        // Detener la animación cuando se alcance el amigo seleccionado
        if (indiceActual > totalPasos) {
            clearInterval(intervalo);

            // Agregar el amigo sorteado a la lista de sorteados
            amigosSorteados.push(amigoSorteado);

            // Mostrar el resultado
            resultado.innerHTML = `🎉 El amigo secreto es: <strong>${amigoSorteado}</strong> 🎉`;
            mostrarNotificacion(`El amigo secreto es: ${amigoSorteado}`, "success");

            // Actualizar la lista de amigos
            actualizarListaAmigos();

            // Verificar si todos los amigos han sido sorteados
            if (amigosSorteados.length === amigos.length) {
                mostrarNotificacion("Todos los amigos han sido sorteados. El juego ha terminado.", "success");
                cambiarBotonANuevoSorteo();
            }
        }
    }, velocidad);
}

// Función para cambiar el botón a "Nuevo Sorteo"
function cambiarBotonANuevoSorteo() {
    const botonSortear = document.querySelector(".button-draw");
    botonSortear.textContent = "Nuevo Sorteo";
    botonSortear.onclick = reiniciarJuego;

    // Mantener el diseño original del botón
    const icono = document.createElement("img");
    icono.src = "assets/reiniciar.png";
    icono.alt = "Ícono para reiniciar";
    botonSortear.prepend(icono);
}

// Función para reiniciar el juego
function reiniciarJuego() {
    amigos = [];
    amigosSorteados = [];
    document.getElementById("amigo").disabled = false;
    document.querySelector(".button-add").disabled = false;
    document.getElementById("amigo").value = "";
    document.getElementById("listaAmigos").innerHTML = "";
    document.getElementById("resultado").innerHTML = "";

    // Cambiar el botón de nuevo a "Sortear amigo"
    const botonSortear = document.querySelector(".button-draw");
    botonSortear.textContent = "Sortear amigo";
    botonSortear.onclick = sortearAmigo;

    const icono = document.createElement("img");
    icono.src = "assets/play_circle_outline.png";
    icono.alt = "Ícono para sortear";
    botonSortear.prepend(icono);

    mostrarNotificacion("El juego ha sido reiniciado.", "success");
}
