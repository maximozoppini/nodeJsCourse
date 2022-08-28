const { throws } = require("assert");
const { count } = require("console");
const fs = require("fs");

class Contenedor{

    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo;
        fs.promises.writeFile(this.nombreArchivo,JSON.stringify([],null,2));
    }

    async save(objetoAGuardar) {
        try {
            //leo el archivo
            let datosAlmacenados = await this.getAll();
            let datosJson = Array.from(datosAlmacenados);

            if(!datosJson){
                throw new Error("el archivo no tiene el formato valido");
            }

            if(datosJson.length > 0){
                objetoAGuardar.id = datosJson.length + 1;  
            }
            else{
                objetoAGuardar.id = 1;
            }

            datosJson = [...datosJson,objetoAGuardar];

            //guardo en el archivo el arreglo de elementos.
            await fs.promises.writeFile(this.nombreArchivo,JSON.stringify(datosJson,null,2));

            return objetoAGuardar.id;

        } catch (error) {
            throw new Error(error);
        }      
    }

    async getById(id){
        try {
            let datosAlmacenados = await this.getAll();

            let datosJson = Array.from(datosAlmacenados);
            return datosJson.find(objeto => objeto.id === id);
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAll(){
        try {
            let datosAlmacenados = await fs.promises.readFile(this.nombreArchivo);
            if(!datosAlmacenados){
                return null;
            }
            return JSON.parse(datosAlmacenados);
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteById(id){
        try {
            let datosAlmacenados = await this.getAll();

            let datosJson = Array.from(datosAlmacenados);
            //guardo la cantidad previamente a la potencial eliminacion para saber si debo recalcular los IDs
            const cantidad = datosJson.length;

            //si encuentro el objeto lo elimino
            datosJson = [...datosJson.filter(dato => dato.id !== id)];

            //si la cantida difiere, un elemento se elimino y debo recalcular los ids
            if(cantidad != datosJson.length)
            {
                datosJson.forEach((objeto,index) =>{
                    objeto.id = index + 1;
                });
            }

            await fs.promises.writeFile(this.nombreArchivo,JSON.stringify(datosJson,null,2));

        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteAll(){
        try {
            await fs.promises.writeFile(this.nombreArchivo,JSON.stringify([],null,2));
        } catch (error) {
            throw new Error(error);
        }
    }

}


async function test(){
    try {
        const contenedorProducto = new Contenedor("productos.txt");

        let primerProducto = await contenedorProducto.save({
            title: "teclado",
            price: 23,
            thumbnail: "http://google.com"
            });
        let segundoProducto = await contenedorProducto.save({
            title: "mouse",
            price: 50,
            thumbnail: "http://google.com"
            });
        let tercerproducto = await contenedorProducto.save({
            title: "monitor",
            price: 1500,
            thumbnail: "http://google.com"
            }); 
        
        console.log("los ids creados son: ",[primerProducto, segundoProducto, tercerproducto]);

        let busquedaMouse = await contenedorProducto.getById(2);
        console.log(`Se intento buscar el producto Mouse:`,busquedaMouse);

        let busquedaProductoInexistente = await contenedorProducto.getById(10);
        console.log(`Se intento buscar el producto que no existe:`,busquedaProductoInexistente);

        let buscarTodos = await contenedorProducto.getAll();
        console.log(`todos los productos:`, buscarTodos);
        
        await contenedorProducto.deleteById(1);
        console.log("se elimino el producto teclado: ",await contenedorProducto.getAll());

        await contenedorProducto.deleteAll();
        console.log("se eliminaron todos los productos", await contenedorProducto.getAll());

    } catch (error) {
        console.log(error);
    }   
}
test();
