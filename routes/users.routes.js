const express = require('express');
const checkAuth = require('../middleware/checkAuth.middleware');
const formCheck = require('../middleware/checkForm.middleware');
const userControllers = require('../controllers/users.controller');
const router = express.Router();

router.post('/register', 
    formCheck.addForm, 
    checkAuth, 
    userControllers.registerUser);

router.get('/pass-on', 
    checkAuth, 
    userControllers.getUser);


    // router.post('/update', 
//     formCheck.updateForm, 
//     checkAuth, 
//     userControllers.updateUser)


module.exports = router