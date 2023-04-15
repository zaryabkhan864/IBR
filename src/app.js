const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const errorMiddleware = require('./middlewares/erros')
app.use(express.json());
app.use(bodyParser.json());
// const app = express()
// app.use(express.json());
//Import all routes
const predict = require('./routes/bpmRoute')
const test = require('./routes/test')
const patient = require('./routes/patientRoute')
const doctor = require('./routes/doctorRoute');

app.use('/api/v1', patient)
app.use('/api/v1', doctor)
app.use('/api/v1', predict);
app.use('/api/v1', test)

//Middle to handle error
app.use(errorMiddleware);
module.exports = app