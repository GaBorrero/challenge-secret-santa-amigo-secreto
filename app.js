// Array
let amigos = [];
let amigosSorteados = [];

// Notificaciones
function mostrarNotificacion(mensaje, tipo = "info") {
    const contenedor = document.getElementById("notificaciones");
    const notificacion = document.createElement("div");
    notificacion.classList.add("notificacion");

    if (tipo === "error") {
        notificacion.style.backgroundColor = "#FFCCCC";
        notificacion.style.color = "#D8000C";
    } else if (tipo === "success") {
        notificacion.style.backgroundColor = "#DFF2BF";
        notificacion.style.color = "#4F8A10";
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

function agregarAmigo() {
    const inputAmigo = document.getElementById("amigo");
    const nombreAmigo = inputAmigo.value.trim();

    if (nombreAmigo === "") {
        mostrarNotificacion("Escriba un nombre:", "error");
        return;
    }

    const regexSoloTexto = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regexSoloTexto.test(nombreAmigo)) {
        mostrarNotificacion("El nombre solo puede contener letras.", "error");
        return;
    }

    if (amigos.includes(nombreAmigo)) {
        mostrarNotificacion("Este nombre ya se encuentra en la lista.", "error");
        return;
    }

    amigos.push(nombreAmigo);
    inputAmigo.value = "";
    actualizarListaAmigos();
    mostrarNotificacion("Nombre agregado correctamente.", "success");
}

function actualizarListaAmigos() {
    const listaAmigos = document.getElementById("listaAmigos");
    listaAmigos.innerHTML = "";

    amigos.forEach((amigo) => {
        const li = document.createElement("li");
        li.textContent = amigo;

        // Nombre sorteado
        if (amigosSorteados.includes(amigo)) {
            li.style.textDecoration = "line-through";
            li.style.color = "#C4C4C4";
        }

        listaAmigos.appendChild(li);
    });
}

function sortearAmigo() {
    if (amigos.length === 0) {
        mostrarNotificacion("No hay nombres en la lista para sortear.", "error");
        return;
    }

    // Filtrar disponibles
    const amigosDisponibles = amigos.filter((amigo) => !amigosSorteados.includes(amigo));

    if (amigosDisponibles.length === 0) {
        mostrarNotificacion("Todos los amigos han sido sorteados. El juego ha terminado.", "success");

        cambiarBotonANuevoSorteo();
        return;
    }

    const resultado = document.getElementById("resultado");

    // Deshabilitar campo y botón
    document.getElementById("amigo").disabled = true;
    document.querySelector(".button-add").disabled = true;

    // Indice
    const indiceFinal = Math.floor(Math.random() * amigosDisponibles.length);
    const amigoSorteado = amigosDisponibles[indiceFinal];

    let indiceActual = 0;
    const velocidad = 100;
    const ciclos = 3;
    let totalPasos = ciclos * amigosDisponibles.length + indiceFinal;

    // Elementos de lista
    const listaAmigos = Array.from(document.getElementById("listaAmigos").children).filter(
        (li) => !amigosSorteados.includes(li.textContent)
    );

    const intervalo = setInterval(() => {
        
        if (indiceActual > 0) {
            listaAmigos[(indiceActual - 1) % amigosDisponibles.length].classList.remove("amigo-seleccionado");
        }

        // Cambiar el color
        listaAmigos[indiceActual % amigosDisponibles.length].classList.add("amigo-seleccionado");

        indiceActual++;

        if (indiceActual > totalPasos) {
            clearInterval(intervalo);

            amigosSorteados.push(amigoSorteado);

            resultado.innerHTML = `🎉 El amigo secreto es: <strong>${amigoSorteado}</strong> 🎉`;
            mostrarNotificacion(`El amigo secreto es: ${amigoSorteado}`, "success");

            actualizarListaAmigos();

            if (amigosSorteados.length === amigos.length) {
                mostrarNotificacion("Todos los nombres han sido sorteados. El juego se ha terminado.", "success");
                cambiarBotonANuevoSorteo();
            }
        }
    }, velocidad);
}

function cambiarBotonANuevoSorteo() {
    const botonSortear = document.querySelector(".button-draw");
    botonSortear.textContent = "Nuevo Sorteo";
    botonSortear.onclick = reiniciarJuego;

    const icono = document.createElement("img");
    icono.src = "assets/reiniciar.png";
    icono.alt = "Ícono para reiniciar";
    botonSortear.prepend(icono);
}

function reiniciarJuego() {
    amigos = [];
    amigosSorteados = [];
    document.getElementById("amigo").disabled = false;
    document.querySelector(".button-add").disabled = false;
    document.getElementById("amigo").value = "";
    document.getElementById("listaAmigos").innerHTML = "";
    document.getElementById("resultado").innerHTML = "";

    const botonSortear = document.querySelector(".button-draw");
    botonSortear.textContent = "Sortear amigo";
    botonSortear.onclick = sortearAmigo;

    const icono = document.createElement("img");
    icono.src = "assets/play_circle_outline.png";
    icono.alt = "Ícono para sortear";
    botonSortear.prepend(icono);

    mostrarNotificacion("El juego se ha reiniciado.", "success");
}
