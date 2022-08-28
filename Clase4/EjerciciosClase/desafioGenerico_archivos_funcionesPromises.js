const fs = require("fs");
const { json } = require("stream/consumers");

fs.promises
    .readFile("./package.json")
    .then(data => {
        let dataJson = JSON.parse(data);
        console.log(dataJson);
        dataJson.author = "Coderhouse";
        return dataJson;
    })
    .then(dataJson => {
        fs.promises.writeFile("package.json.coder", JSON.stringify(dataJson,null,2))
            .then(error => {
                console.log(error);
            });
    })