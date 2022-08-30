const moment = require("moment");

let hoy = moment('2022-08-29');
let nacimiento = moment('1989-05-09');

console.log(hoy.diff(nacimiento,'years'));