const express = require('express');
const router = express.Router();
const middleWareJwt = require('../../middleware'); 
const {
    getAllUsers,
    registerUser,
    loginUser,
    getPetsUser,
    updateUser,
    deleteUser,
    getUserDetails,
    resetPassword,
    passwordResetVerified,
    searchUsers,
    getUserByPetId
} = require('../controller/user');



// create new user 
router.post('/register', registerUser);
// login
router.post('/login', loginUser);
//delete user
router.delete('/:userId', deleteUser);

//reset password
router.post('/reset-password',resetPassword);

// reset verified password 
router.post('/reset-password/:userId/:token',passwordResetVerified);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// מעכשיו כל ניתוב מחייב לשים טוקן ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.use(middleWareJwt);

//get user's pets 
router.get('/pets/:userId', getPetsUser);

// update user 
router.put('/:userId', updateUser);

// get user details 

router.get('/:userId',getUserDetails);

// search users 

router.post('/search',searchUsers);


// get User by pet id: 

router.get('/get_user/:petId',getUserByPetId);

// get all users 

router.get('/all_users', getAllUsers);

module.exports = router;