comandos utilizados:

- pm2 start server.js --name="cluster" --watch -i 0 -- --p=8081
- pm2 start server.js --name="fork1" --watch -- --p=8082
- pm2 start server.js --name="fork2" --watch -- --p=8083
- pm2 start server.js --name="fork3" --watch -- --p=8084
- pm2 start server.js --name="fork4" --watch -- --p=8085

modificar la ip de su maquina en el archivo docker-compose.yml
extra_hosts: - "localNode:IP LOCAL"

luego hacer

- docker-compose up
