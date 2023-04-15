const express = require('express');
const router = express.Router();

const {
    registerDoctor,
    // loginUser,
    // forgotPassword,
    // resetPassword,
    // getUserProfile,
    // updatePassword,
    // updateProfile,
    // logout,
    allDoctors,
    // getUserDetails,
    // updateUser,
    // deleteUser

} = require('../controllers/doctorController');


const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')
router.route('/admin/doctors').get(allDoctors)
router.route('/doctor/register').post(registerDoctor);

// router.route('/login').post(loginUser);

// router.route('/password/forgot').post(forgotPassword)
// router.route('/password/reset/:token').put(resetPassword)

// router.route('/logout').get(logout);

// router.route('/me').get(isAuthenticatedUser, getUserProfile)
// router.route('/password/update').put(isAuthenticatedUser, updatePassword)
// router.route('/me/update').put(isAuthenticatedUser, updateProfile)


// router.route('/admin/user/:id')
//     .get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
//     .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
//     .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)

module.exports = router;