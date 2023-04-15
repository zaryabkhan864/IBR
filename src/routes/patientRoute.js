const express = require('express');
const router = express.Router();

const {
    registerPatient,
    loginPatient,
    // forgotPassword,
    // resetPassword,
    // getUserProfile,
    // updatePassword,
    // updateProfile,
    // logout,
    allPatients,
    // getUserDetails,
    // updateUser,
    // deleteUser

} = require('../controllers/patientController');


const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')
router.route('/admin/patients').get(allPatients)
router.route('/patient/register').post(registerPatient);
// router.route('/test').get((req, res) => {
//     res.send(200, 'api is working')
// })
router.route('/login/patient').post(loginPatient);

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