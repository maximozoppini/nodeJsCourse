export default {
  head: `<meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet">
        <!-- Font Awesome -->
        <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        rel="stylesheet"
        />
        <!-- Google Fonts -->
        <link
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        rel="stylesheet"
        />
        <!-- MDB -->
        <link
        href="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/6.1.0/mdb.min.css"
        rel="stylesheet"
        />
        <title>React Render with Deno</title>`,
  script: `
        <script
            type="text/javascript"
            src="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/6.1.0/mdb.min.js"
        ></script>
        <script>
            const form = document.querySelector("form");
            form.addEventListener("submit", (e) => {
            e.preventDefault();
            e.target[0].value = (e.target[0].value).toLowerCase();
            if(isColor(e.target[0].value)){
                form.submit();
            }else{
                alert("El color ingresado no es valido");
            }
            });
            function isColor(strColor){
            var s = new Option().style;
            s.color = strColor;
            return s.color == strColor;
            }
        </script>`,
};
