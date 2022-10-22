const mongoose = require("mongoose");
const estudiantesModel = require("./models/estudiantes.model");

const listaEstudiantes = [
  {
    nombre: "Pedro",
    apellido: "Mei",
    edad: 21,
    dni: "31155898",
    curso: "1A",
    nota: 7,
  },
  {
    nombre: "Ana",
    apellido: "Gonzalez",
    edad: 32,
    dni: "27651878",
    curso: "1A",
    nota: 8,
  },
  {
    nombre: "José",
    apellido: "Picos",
    edad: 29,
    dni: "34554398",
    curso: "2A",
    nota: 6,
  },
  {
    nombre: "Lucas",
    apellido: "Blanco",
    edad: 22,
    dni: "30355874",
    curso: "3A",
    nota: 10,
  },
  {
    nombre: "María",
    apellido: "García",
    edad: 36,
    dni: "29575148",
    curso: "1A",
    nota: 9,
  },
  {
    nombre: "Federico",
    apellido: "Perez",
    edad: 41,
    dni: "320118321",
    curso: "2A",
    nota: 5,
  },
  {
    nombre: "Tomas",
    apellido: "Sierra",
    edad: 19,
    dni: "38654790",
    curso: "2B",
    nota: 4,
  },
  {
    nombre: "Carlos",
    apellido: "Fernández",
    edad: 33,
    dni: "26935670",
    curso: "3B",
    nota: 2,
  },
  {
    nombre: "Fabio",
    apellido: "Pieres",
    edad: 39,
    dni: "4315388",
    curso: "1B",
    nota: 9,
  },
  {
    nombre: "Daniel",
    apellido: "Gallo",
    edad: 25,
    dni: "37923460",
    curso: "3B",
    nota: 2,
  },
];

// mongoose.connect("mongodb://localhost:27017/colegio").then(async () => {
//   listaEstudiantes.forEach(async (estudiante) => {
//     await new estudiantesModel(estudiante).save();
//   });
// });

mongoose.connect("mongodb://localhost:27017/colegio").then(async () => {
  try {
    //mostramos todos los alumnos ordenados por nombre
    estudiantesModel
      .find()
      .sort({ nombre: 1 })
      .then((result) => {
        console.log(result);
        console.log("-------------------------------");
      });
    //mostrar el estudiante mas joven
    estudiantesModel
      .find()
      .sort({ edad: 1 })
      .limit(1)
      .then((result) => {
        console.log("-------------------------------");
        console.log(result);
      });

    //mostrar solos los de un curso
    estudiantesModel
      .find({ curso: "2A" })
      .sort({ edad: 1 })
      .then((result) => {
        console.log("-------------------------------");
        console.log(result);
      });
    //lo mismo pero con proyeccion
    estudiantesModel
      .find({ curso: "2A" }, { nombre: 1, apellido: 1 })
      .sort({ edad: 1 })
      .then((result) => {
        console.log("-------------------------------");
        console.log(result);
      });

    //actualizar documento
    estudiantesModel
      .updateOne({ nombre: "Lucas" }, { dni: "234234" })
      .then((result) => console.log(result));
  } catch (error) {}
});
