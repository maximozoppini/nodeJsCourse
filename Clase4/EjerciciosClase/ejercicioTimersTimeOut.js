let cadenaPrueba = "maximo";

function mostrarLetras(cadena, time, funcionAux){
    
    let indice = 0;
    //se asigna a una constante o a un let para poder luego cerrarlo con el ClearInterval(intervalo)
    const intervalo = setInterval(()=> {
            if(cadena[indice]){
                console.log(cadena[indice]);
                indice++;
            }
            else{
                funcionAux();
                clearInterval(intervalo);
            }
        },time);        
}

const fin = () => {console.log("termine")};

mostrarLetras(cadenaPrueba, 500,fin);
