const http = require('http');
const app = require('./app')

const port = process.env.PORT || 5800;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`server is started on port ${port}`)
})