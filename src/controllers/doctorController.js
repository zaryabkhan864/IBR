const Doctor = require('../models/doctor');

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