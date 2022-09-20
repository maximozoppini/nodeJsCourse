const socket = io.connect();

const input = document
    .getElementById("btnEnviar")
    .addEventListener("click", () => {
        console.log("click");
        socket.emit("mensaje", document.getElementById("inputName").value);
    });

socket.on("mensajes", (data) => {
    let mensajes = data
        .map((x) => `socketId: ${x.socketId} - mensaje: ${x.mensaje}`)
        .join("<br>");
    document.getElementById("textArea").value = mensajes;
});
