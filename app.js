// Declarar el array para almacenar los nombres de los amigos
let amigos = [];
let amigosSorteados = []; // Lista

// Función para mostrar notificaciones con sonido
function mostrarNotificacion(mensaje, tipo = "info") {
    const contenedor = document.getElementById("notificaciones");
    const notificacion = document.createElement("div");
    notificacion.classList.add("notificacion");

    // Seleccionar el sonido según el tipo
    //const sonidoExito = document.getElementById("sonidoExito");
    //const sonidoError = document.getElementById("sonidoError");

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

// Función agregar nombres
function agregarAmigo() {
    const inputAmigo = document.getElementById("amigo");
    const nombreAmigo = inputAmigo.value.trim();

    if (nombreAmigo === "") {
        mostrarNotificacion("Inserte un nombre.", "error");
        return;
    }

    const regexSoloTexto = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regexSoloTexto.test(nombreAmigo)) {
        mostrarNotificacion("El nombre solo puede contener letras y caracteres válidos.", "error");
        return;
    }

    if (amigos.includes(nombreAmigo)) {
        mostrarNotificacion("Este nombre ya ha sido adicionado.", "error");
        return;
    }

    amigos.push(nombreAmigo);
    inputAmigo.value = "";
    actualizarListaAmigos();
    mostrarNotificacion("Amigo adicionado correctamente.", "success");
}

// Función actualizar lista de nombres
function actualizarListaAmigos() {
    const listaAmigos = document.getElementById("listaAmigos");
    listaAmigos.innerHTML = "";

    amigos.forEach((amigo) => {
        const li = document.createElement("li");
        li.textContent = amigo;

        // Sorteo realizado, deshabilitación
        if (amigosSorteados.includes(amigo)) {
            li.style.textDecoration = "line-through";
            li.style.color = "#C4C4C4";
        }

        listaAmigos.appendChild(li);
    });
}

function sortearAmigo() {
    if (amigos.length === 0) {
        mostrarNotificacion("No hay nombres de amigos para sortear.", "error");
        return;
    }

    // Reproducir el sonido de ganador
    //const sonidoGanador = document.getElementById("sonidoGanador");
    //sonidoGanador.play();

    // Filtrar nombres no sorteados
    const amigosDisponibles = amigos.filter((amigo) => !amigosSorteados.includes(amigo));

    if (amigosDisponibles.length === 0) {
        mostrarNotificacion("Todos los nombres de tus amigos han sido sorteados. El juego se ha terminado.", "success");

        // Cambiar botón a "Nuevo Sorteo"
        cambiarBotonANuevoSorteo();
        return;
    }

    const resultado = document.getElementById("resultado");

    // Deshabilitar campo de entrada y boton añadir
    document.getElementById("amigo").disabled = true;
    document.querySelector(".button-add").disabled = true;

    // Generar índice por defecto
    const indiceFinal = Math.floor(Math.random() * amigosDisponibles.length);
    const amigoSorteado = amigosDisponibles[indiceFinal];

    let indiceActual = 0;
    const velocidad = 100; 
    const ciclos = 3; 
    let totalPasos = ciclos * amigosDisponibles.length + indiceFinal;

    // Obtener elementos disponibles
    const listaAmigos = Array.from(document.getElementById("listaAmigos").children).filter(
        (li) => !amigosSorteados.includes(li.textContent)
    );

    // Desplazamiento
    const intervalo = setInterval(() => {
        // Restablecer color
        if (indiceActual > 0) {
            listaAmigos[(indiceActual - 1) % amigosDisponibles.length].classList.remove("amigo-seleccionado");
        }

        // Cambiar color actual
        listaAmigos[indiceActual % amigosDisponibles.length].classList.add("amigo-seleccionado");

        // Incrementar indice
        indiceActual++;

        // Detener animacion
        if (indiceActual > totalPasos) {
            clearInterval(intervalo);

            // Agregar nombre a lista
            amigosSorteados.push(amigoSorteado);

            // Mostrar resultado
            resultado.innerHTML = `🎉 El amigo secreto es: <strong>${amigoSorteado}</strong> 🎉`;
            mostrarNotificacion(`El amigo secreto es: ${amigoSorteado}`, "success");

            // Actualizar lista
            actualizarListaAmigos();

            // Verificar
            if (amigosSorteados.length === amigos.length) {
                mostrarNotificacion("Todos los amigos han sido sorteados. El juego ha terminado.", "success");
                cambiarBotonANuevoSorteo();
            }
        }
    }, velocidad);
}

// Funcion cambiar a "Nuevo Sorteo"
function cambiarBotonANuevoSorteo() {
    const botonSortear = document.querySelector(".button-draw");
    botonSortear.textContent = "Nuevo Sorteo";
    botonSortear.onclick = reiniciarJuego;

    // Mantener diseño original
    const icono = document.createElement("img");
    icono.src = "assets/reiniciar.png";
    icono.alt = "Ícono para reiniciar";
    botonSortear.prepend(icono);
}

// Funcion reinicio
function reiniciarJuego() {
    amigos = [];
    amigosSorteados = [];
    document.getElementById("amigo").disabled = false;
    document.querySelector(".button-add").disabled = false;
    document.getElementById("amigo").value = "";
    document.getElementById("listaAmigos").innerHTML = "";
    document.getElementById("resultado").innerHTML = "";

    // Cambiar botón a "Sortear amigo"
    const botonSortear = document.querySelector(".button-draw");
    botonSortear.textContent = "Sortear amigo";
    botonSortear.onclick = sortearAmigo;

    const icono = document.createElement("img");
    icono.src = "assets/play_circle_outline.png";
    icono.alt = "Ícono para sortear";
    botonSortear.prepend(icono);

    mostrarNotificacion("El juego ha sido reiniciado.", "success");
}
