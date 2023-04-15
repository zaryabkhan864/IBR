const http = require('http');
const app = require('./app')
const dotenv = require('dotenv');

// Setting up config file
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'src/helpers/config.env' })
// const port = process.env.PORT || 5800;
const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log(`server is started on port ${process.env.PORT}`)
})