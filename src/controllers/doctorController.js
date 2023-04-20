const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

const crypto = require('crypto');
const cloudinary = require('cloudinary');

// Register a Patient   => /api/v1/patient/register
exports.registerDoctor = catchAsyncErrors(async (req, res, next) => {

    // const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //     folder: 'Inam',
    //     width: 150,
    //     crop: "scale"
    // })

    const {
        name,
        email,
        password,
        sex,
        age,
        address,
        personalNumber,
        workNumber,
        hospitalName,
        hospitalAddress
    } = req.body;

    const doctor = await Doctor.create({
        name,
        email,
        password,
        sex,
        age,
        address,
        personalNumber,
        workNumber,
        hospitalName,
        hospitalAddress,
        // avatar: {
        //     public_id: result.public_id,
        //     url: result.secure_url
        // }
    })

    sendToken(doctor, 200, res)

})
// Get all users   =>   /api/v1/admin/doctors
exports.allDoctors = catchAsyncErrors(async (req, res, next) => {
    const doctors = await Doctor.find();

    res.status(200).json({
        success: true,
        doctors
    })
})
// Login patient  =>  /api/v1/login
exports.loginDoctor = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // Finding user in database
    const doctor = await Doctor.findOne({ email }).select('+password')

    if (!doctor) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await doctor.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(doctor, 200, res)
})
// Login addPatient  =>  /api/v1/addPatient
exports.addPatient = catchAsyncErrors(async (req, res, next) => {

    let patient = await Patient.findOne({ email: req.body.email });
    if (!patient) return res.status(400).send('Invalid patient email.');
    console.log(`req.user._id`, req.user)
    // write update logic here
    patient = await Patient.updateOne({ email: req.body.email }, {
        $set: { doctor: req.user._id }
    })

    res.status(200).json({
        success: true,
        message: 'Patient added successfully',
        patient
    })
})