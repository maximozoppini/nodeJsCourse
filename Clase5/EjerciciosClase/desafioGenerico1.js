let numeros = [];
let objetoNumeros = [];

const generarNumeros = () => {
  for (let index = 0; index < 30; index++) {
    numeros.push(parseInt((Math.random() * 20) / 1));
  }
  console.log(numeros);
  verificar(numeros);
};
const verificar = (numeros) => {
  let contador = 0;
  for (let index = 1; index <= 20; ) {
    let existe = numeros.indexOf(index);
    if (existe != -1) {
      contador++;
      numeros.splice(existe, 1);
    } else {
      objetoNumeros.push({ [index]: contador });
      contador = 0;
      index++;
    }
  }
  console.log(objetoNumeros);
};

generarNumeros();

a = [1, 2, 3, 4];
result = {};

result[a[1]] = 0;
++result[a[1]];
console.log(result);

const names = ["Alice", "Bob", "Tiff", "Bruce", "Alice"];

const countedNames = names.reduce((allNames, name) => {
  allNames[name] ??= 0;
  ++allNames[name];
  // Remember to return the object, or the next iteration
  // will receive undefined
  return allNames;
}, []);

console.log(countedNames);
