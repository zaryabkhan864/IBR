const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')
const tf = require('@tensorflow/tfjs-node');
const bodyParser = require('body-parser');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');

//importing excel file
const workbook = xlsx.readFile(path.join(__dirname, '../dataset/data.xlsx'));
const sheet_name_list = workbook.SheetNames;
const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
const data = xlData.map((item) => {
    return [
        item.age,
        item.sex,
        item.Weight,
        item.HR
    ]
})
const labels = xlData.map((item) => {
    return [
        item.heartAttackRisk
    ]
})
const trainingData = tf.tensor2d(data);
const outputData = tf.tensor2d(labels);
const model = tf.sequential();
model.add(tf.layers.dense({
    inputShape: [4],
    activation: 'sigmoid',
    units: 5
}));
model.add(tf.layers.dense({
    activation: 'sigmoid',
    units: 1
}));
model.compile({
    loss: 'meanSquaredError',
    optimizer: tf.train.adam(0.06)
});
async function trainModel() {
    return await model.fit(trainingData, outputData, {
        epochs: 10,
        shuffle: true,
        callbacks: tf.node.tensorBoard(path.join(__dirname, '../logs'))
    });
}

exports.getPredict = catchAsyncErrors(async (req, res, next) => {
    const { age, sex, Weight, HR, Smoker, FamilyHistory, HeartDisease, HeartAttackHistory } = req.body;
    console.log(`what is inside req body`, req.body);
    const input = tf.tensor([[age, sex, Weight, HR]]);
    console.log('the input values are :', input);
    const prediction = model.predict(input);
    const predictionData = prediction.dataSync()[0];
    console.log('the prediction is :', predictionData);
    const percentage = predictionData * 100;
     let _smoker = 0;
     let _FamilyHistory = 0;
     let _HeartDisease = 0;
     let _HeartAttackHistory = 0;

    if (Smoker == 1) {
        _smoker = percentage * 0.25;
        console.log('the smoker is :', _smoker);
    }
    if (FamilyHistory == 1) {
        _FamilyHistory = percentage * 0.13;
    }
    if (HeartDisease == 1) {
        _HeartDisease = percentage * 0.07;
    }
    if (HeartAttackHistory == 1) {
        _HeartAttackHistory = percentage * 0.05;
    }
    let result = percentage + _smoker + _FamilyHistory + _HeartDisease + _HeartAttackHistory;
    console.log('the percentage is :', result);
    res.json({ prediction: result });
})
