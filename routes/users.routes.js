const express = require('express');
const checkAuth = require('../middleware/checkAuth.middleware');
const formCheck = require('../middleware/checkForm.middleware');
const userControllers = require('../controllers/users.controller');
const router = express.Router();

router.post('/register', 
    formCheck.addForm, 
    checkAuth, 
    userControllers.registerUser);

// router.post('/update', 
//     formCheck.updateForm, 
//     checkAuth, 
//     userControllers.updateUser)

// router.get('/pass-on', 
//     checkAuth, 
//     userControllers.provideInfo);

module.exports = router