const express = require('express')
const router = express.Router();
const { getPredict } = require('../controllers/bpmController')
router.route('/predict/bp').post(getPredict);

module.exports = router
