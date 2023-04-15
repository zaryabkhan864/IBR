const Patient = require('../models/patient');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

const crypto = require('crypto');
const cloudinary = require('cloudinary');

// Register a Patient   => /api/v1/patient/register
exports.registerPatient = catchAsyncErrors(async (req, res, next) => {

    // const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //     folder: 'Inam',
    //     width: 150,
    //     crop: "scale"
    // })

    const {
        name,
        age,
        weight,
        personalNumber,
        emergencyNumber,
        smoker,
        familyHistory,
        heartDisease,
        email,
        password
    } = req.body;

    const patient = await Patient.create({
        name,
        age,
        weight,
        personalNumber,
        emergencyNumber,
        smoker,
        familyHistory,
        heartDisease,
        email,
        password,
        // avatar: {
        //     public_id: result.public_id,
        //     url: result.secure_url
        // }
    })

    sendToken(patient, 200, res)

})
// Login patient  =>  /api/v1/login
exports.loginPatient = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // Finding user in database
    const patient = await Patient.findOne({ email }).select('+password')

    if (!patient) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await patient.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(patient, 200, res)
})

// Update user profile   =>   /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newPatientData = {
        name: req.body.name,
        email: req.body.email
    }

    // Update avatar
    if (req.body.avatar !== '') {
        const patient = await Patient.findById(req.user.id)

        // const image_id = user.avatar.public_id;
        // const res = await cloudinary.v2.uploader.destroy(image_id);

        // const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        //     folder: 'avatars',
        //     width: 150,
        //     crop: "scale"
        // })

        // newUserData.avatar = {
        //     public_id: result.public_id,
        //     url: result.secure_url
        // }
    }

    const patient = await Patient.findByIdAndUpdate(req.patient.id, newPatientData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})
// Get all users   =>   /api/v1/admin/patients
exports.allPatients = catchAsyncErrors(async (req, res, next) => {
    const patients = await Patient.find();

    res.status(200).json({
        success: true,
        patients
    })
})