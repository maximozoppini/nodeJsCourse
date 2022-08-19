class Libro{
    constructor(libro){
        this.nombre = libro.nombre;
        this.autor = libro.autor;
    }
}
class Mascota{
    constructor(mascota){
        this.nombre = mascota.nombre;
    }
}
class Usuario{
    constructor(usuario){
        this.nombre = usuario.nombre;
        this.apellido = usuario.apellido;
        this.libros = [];
        this.mascotas = [];
        if(usuario.libro){
            this.libros = [...usuario.libro];
        }
        if(usuario.mascota){
            this.mascotas = [...usuario.mascota];
        }
    }

    getFullName(){
        return `${this.nombre} ${this.apellido}`;
    }

    addMascota(nuevaMascota){
        this.mascotas.push(new Mascota({nombre: nuevaMascota}));
    }

    countMascota(){
        return this.mascotas.length;
    }

    addBook(nombre, autor){
        this.libros.push(new Libro({nombre, autor}));
    }

    getBookNames(){
        return this.libros.map(x => x.nombre);
    }
}

//creo un usuario con datos basicos
const maximo = new Usuario({
    nombre:"maximo",
    apellido: "zoppini",
    libro: [new Libro({
        nombre: "harry potter",
        autor: "jkr"
    })],
    mascota: [new Mascota({
        nombre: "laica"
    })]
});

//agrego 3 libros
maximo.addBook("señor de los anillos", "tolkien");
maximo.addBook("El extranjero", "albert camus");
maximo.addBook("Sapiens", "Yuval noah");

//agrego 2 mascotas
maximo.addMascota("chimuelo");
maximo.addMascota("olaf");

//valido que getBookNames tenga como retorno un arreglo
console.log(maximo.getBookNames());

//ejecuto el countMascotas para el usuario creado
console.log(`La cantidad de mascotas que tiene el usuario ${maximo.getFullName()} son: ${maximo.countMascota()}`);
//ejecuto el getBookNames para el usuairo creado
console.log(`Los libros que tiene el usuario ${maximo.getFullName()} son ${maximo.getBookNames()}`);
//log del objeto completo 
console.log(maximo);
