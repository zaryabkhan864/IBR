const http = require('http');
const app = require('./app')
const connectDatabase = require('./helpers/database')
const cloudinary = require('cloudinary')
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1)
})
// Setting up config file
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'src/helpers/config.env' })

//connecting to database
connectDatabase();


// Setting up cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


// const port = process.env.PORT || 5800;
const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log(`server is started on port ${process.env.PORT}`)
})

// Handle Unhandled Promise rejections
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down the server due to Unhandled Promise rejection');
    server.close(() => {
        process.exit(1)
    })
})