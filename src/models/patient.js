const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
// ,family history,heart disease
const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [false, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters']
    },
    age: {
        type: Number,
        required: [false, 'Please enter your age']
    },
    weight: {
        type: Number,
        required: [false, 'Please enter your Weight']
    },
    sex: {
        type: Number,
        required: [false, 'Please enter your Sex']
    },
    familyHistory: {
        type: Number,
        required: [false, 'Please enter your Family History']
    },
    heartAttackHistory: {
        type: Number,
        required: [false, 'Please enter your heart attack history']
    },
    personalNumber: {
        type: String,
        required: false,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[0-9]{11}$/.test(v);
            }, message: 'Kindly Provide valid Personal Phone Number'
        }
    },
    emergencyNumber: {
        type: String,
        required: false,
        unique: false,
        validate: {
            validator: function (v) {
                return /^[0-9]{11}$/.test(v);
            }, message: 'Kindly Provide valid Personal Phone Number'
        }
    },
    smoker: {
        type: Number,
        required: [false, 'Please enter your smoker status'],
        validate: {
            validator: function (v) {
                return v === 0 || v === 1;
            },
            message: 'Gender must be either 0 or 1'
        }
    },

    heartDisease: {
        type: Number,
        required: [false, 'Please provide data that do you have disease'],
        validate: {
            validator: function (v) {
                return v === 0 || v === 1;
            },
            message: 'Gender must be either 0 or 1'
        }
    },
    email: {
        type: String,
        required: [false, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [false, 'Please enter your password'],
        minlength: [6, 'Your password must be longer than 6 characters'],
        select: false
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
        required: false
    },
    avatar: {
        public_id: {
            type: String,
            required: false
        },
        url: {
            type: String,
            required: false
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

})

// Encrypting password before saving user
patientSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

// Compare user password
patientSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Return JWT token
patientSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

// Generate password reset token
patientSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // Set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

    return resetToken

}

module.exports = mongoose.model('Patient', patientSchema);