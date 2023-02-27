import { React } from "./dep.ts";

const App = () => {
    return (
        <div>
            <h1 style={{"margin": "50px 0px"}}> App Component con Deno y React</h1>
            <div className="container">
                <form action="/" method="post">
                    <div className="form-outline" style={{"marginBottom": "30px"}}>
                        <input type="text" id="id_color" name="color" className="form-control" />
                        <label className="form-label" htmlFor="id_color">
                            Ingrese un color
                        </label>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mb-4">Enviar</button>
                </form>
            </div>
        </div>
    );
};

export default App;