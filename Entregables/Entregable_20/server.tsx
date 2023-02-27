// frontend/ssr/server.tsx
import { Application, Router } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { ReactDOMServer, React } from "./dep.ts";
import bodyParser from "./body-parse.ts";
import htmlContent from "./html-content.ts";
import App from "./App.tsx";

const app = new Application();
const port: number = 8000;

const router = new Router();
const colors = [];

router.get("/", (ctx) => {
  const temp = colors.sort(() => Math.random() - 0.5);
  const list = temp.map((color) => {
    let element: string;
    if(color === "black"){
      element = `<li class="list-group-item" style="color: ${color};background-color:white;border-color: black;">${color}</li>`
    }else{
      element = `<li class="list-group-item" style="color: ${color};background-color:black;border-color: white;">${color}</li>`
    }
    return element
  }).join("");
  ctx.response.body = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        ${htmlContent.head}
      </head>
      <body style="text-align:center;">
        <div id="root">${ReactDOMServer.renderToString(<App />)}</div>
        <div class="container" style="margin-top: 50px;">
          <h2 style="margin-bottom: 40px">Colores ingresados</h2>
          <ul class="list-group">${list}</ul>
        </div>
        ${htmlContent.script}
      </body>
    </html>
  `;
});

router.post("/", async (ctx) => {
  try{
    colors.push((await bodyParser(ctx)).color);
    console.log(colors);
    return ctx.response.redirect("/")
  }catch(err){
    console.log(err);
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port });
console.log(`server is running on port: ${port}`);

export default { colors };