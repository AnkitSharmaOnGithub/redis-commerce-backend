const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const authHelper = require("../helpers/auth.helper");

// Create user endpoint
router.post('/create', userController.createUser);

router.post('/login', userController.login);

router.post('/view', authHelper.isLoggedIn, userController.viewUser)

router.get('/test', authHelper.isLoggedIn, userController.test);

module.exports = router;