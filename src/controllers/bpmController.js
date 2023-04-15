const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')
const tf = require('@tensorflow/tfjs-node');
const XLSX = require('xlsx');
const bodyParser = require('body-parser');
const path = require('path');

const workbook = XLSX.readFile(path.join(__dirname, '../dataset/testing.xlsx'));
const worksheet = workbook.Sheets['Sheet1'];
let data = XLSX.utils.sheet_to_json(worksheet);

// Split the data into training and testing sets
const splitIndex = Math.round(data.length * 0.8);
const trainingData = data.slice(0, splitIndex);
console.log(`traning data`, trainingData)
const testingData = data.slice(splitIndex);

// Define the model architecture
const model = tf.sequential();

model.add(tf.layers.dense({ inputShape: [10], units: 16, activation: 'relu' }));
model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

// Convert the training data to tensors
const trainingInputs = tf.tensor(trainingData.map(d => [d.age, d.sex === 'male' ? 0 : 1, d.cp, d.Weight, d.HR, d.BP, d.Smoker, d.FamilyHistory, d.HeartDisease, d.HeartAttackHistory]));
const trainingLabels = tf.tensor(trainingData.map(d => d.HeartAttack));
console.log(`lable data print`, trainingLabels);

// Train the model

model.fit(trainingInputs, trainingLabels, { epochs: 50 }).then(() => {
    console.log('Model trained');
});

// exports.getPredict = catchAsyncErrors(async (req, res, next) => {
//     const { age, sex, cp, Weight, HR, BP, Smoker, FamilyHistory, HeartDisease, HeartAttackHistory } = req.body;
//     console.log(`what is inside req body`, req.body);
//     const input = tf.tensor([[age, sex === 'male' ? 1 : 0, cp, Weight, HR, BP, Smoker, FamilyHistory, HeartDisease, HeartAttackHistory]]);
//     console.log('the input values are :', input);
//     const prediction = model.predict(input);
//     const output = prediction.arraySync()[0][0];
//     const probability = Math.round(output * 100);
//     console.log(`prediction value`, probability)
//     res.json({ probability });
// })
// exports.getPredict = catchAsyncErrors(async (req, res, next) => {
//     const { age, sex, cp, Weight, HR, BP, Smoker, FamilyHistory, HeartDisease, HeartAttackHistory } = req.body;
//     const input = tf.tensor([[age, sex === 'male' ? 1 : 0, cp, Weight, HR, BP, Smoker, FamilyHistory, HeartDisease, HeartAttackHistory]]);
//     const prediction = model.predict(input).dataSync()[0];
//     res.json({ prediction: `${Math.round(prediction * 100)}%` });
// })
exports.getPredict = catchAsyncErrors(async (req, res, next) => {
    const { age, sex, cp, Weight, HR, BP, Smoker, FamilyHistory, HeartDisease, HeartAttackHistory } = req.body;
    console.log(`what is inside req body`, req.body);
    const input = tf.tensor([[age, sex === 'male' ? 1 : 0, cp, Weight, HR, BP, Smoker, FamilyHistory, HeartDisease, HeartAttackHistory]]);
    console.log('the input values are :', input);
    const prediction = model.predict(input);
    const predictionData = prediction.dataSync()[0];
    const predictionPercentage = Math.round(predictionData * 100);
    res.json({ prediction: predictionPercentage });
})
// exports.getPredict = catchAsyncErrors(async (req, res, next) => {
//     const { age, sex, cp, Weight, HR, BP, Smoker, FamilyHistory, HeartDisease, HeartAttackHistory } = req.body;
//     console.log(`what is inside req body`, req.body);
//     const input = tf.tensor([[age, sex === 'male' ? 1 : 0, cp, Weight, HR, BP, Smoker, FamilyHistory, HeartDisease, HeartAttackHistory]]);
//     console.log('the input values are :', input);
//     const prediction = model.predict(input);
//     const output = prediction.arraySync()[0][0] * 100;
//     console.log(`prediction value in percentage`, output);
//     res.json({ prediction: output });
// })


