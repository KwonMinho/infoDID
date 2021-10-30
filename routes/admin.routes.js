const express = require('express');
const adminControllers = require('../controllers/admin.controller');
const router = express.Router();


router.get('/users', 
    adminControllers.getAllUser);

module.exports = router