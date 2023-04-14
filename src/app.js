const express = require('express')
const app = express()
app.use(express.json());
//Import all routes
const test = require('./routes/test')
app.use('/api/v1', test)
module.exports = app