const { createTransport } = require("nodemailer");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const transporter = createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.MAIL_ADMIN_USER,
    pass: process.env.MAIL_ADMIN_PASS,
  },
});

async function sendRegEmailToUser(user) {
  try {
    await transporter.sendMail({
      from: `Registros CoderHouse <${user.username}>`,
      to: user.username,
      subject: "Bienvenido",
      text: "Te doy la bienvenida",
      html: `
            <div id="email___content">
            <h2>Hola ${user.name}</h2>
            <p>Felicidades!!</p>
            <p>Te has registrado al proyecto final de CoderHouse</p>
            </div>`,
    });
  } catch (error) {
    console.log("Algo salio mal ", error);
  }
}
async function sendRegEmailToAdmin(user) {
  try {
    await transporter.sendMail({
      from: "Servidor Node.js",
      to: process.env.MAIL_ADMIN_USER,
      subject: "Nuevo Registro",
      html: `
        <h1 style="color: blue; align-text: center">Nuevo usuario registrado</h1>
        <p>Nombre: ${user.name}</p><p>Email: ${user.username}</p>
        </p><p>Dirección: ${user.direction}</p>
        <p>Edad: ${user.age}</p><p>Avatar: ${user.avatar}</p>
        `,
    });
  } catch (error) {
    console.log("Algo salio mal ", error);
  }
}

async function sendPurchaseMsgToAdmin(user) {
  try {
    await transporter.sendMail({
      from: "Servidor Node.js",
      to: process.env.MAIL_ADMIN_USER,
      subject: `Nuevo pedido del usuario ${user.name}`,
      html: `<h1 style="color: blue; align-text: center">Nuevo Compra de Usuario</h1>
        <p>Nombre: ${user.name}</p><p>Email: ${user.username}</p>
        <p>Dirección: ${user.direction}</p>`,
    });
  } catch (error) {
    console.log("Algo salio mal ", error);
  }
}
async function sendPurchaseMsgToUser(user) {
  try {
    await transporter.sendMail({
      from: "Felicitaciones por tu compra",
      to: user.username,
      subject: `Nuevo pedido`,
      html: `<h1 style="color: blue; align-text: center">Has comprado en la tienda</h1>`,
    });
  } catch (error) {
    console.log("Algo salio mal ", error);
  }
}

module.exports = {
  sendRegEmailToUser,
  sendRegEmailToAdmin,
  sendPurchaseMsgToAdmin,
  sendPurchaseMsgToUser,
};
