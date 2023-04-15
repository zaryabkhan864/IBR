const express = require('express')
const app = express()
app.use(express.json());
//Import all routes
const test = require('./routes/test')
const patient = require('./routes/patientRoute')

app.use('/api/v1', patient)
app.use('/api/v1', test)
module.exports = app