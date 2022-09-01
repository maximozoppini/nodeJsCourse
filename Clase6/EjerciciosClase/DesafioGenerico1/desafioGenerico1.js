const http = require("http");

//crea el server con la configuracion del mismo con sus respecctivos endpoints.
const server = http.createServer((peticion, respuesta) => {
    let horaActual = new Date();
    let hora = horaActual.getHours();

    if(hora >= 6 && hora <= 12){
        respuesta.end("buenos días");
    } else if(hora >= 13 && hora <= 19){
        respuesta.end("buenas tardes");
    }
    else{
        respuesta.end("buenas noches");
    }
});


//establece el puerto al cual el servidor va a estar escuchando
const connectedServer = server.listen(8081, () => {
    console.log("el servidor esta escuchando en el puerto",connectedServer.address().port);
})