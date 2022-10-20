const express = require('express');
const router = express.Router();

const itemController = require('../controllers/item.controller');
const authHelper = require("../helpers/auth.helper");

// Create item
router.post('/create', authHelper.isLoggedIn, itemController.createItem);

// Get all items

// Get a specific item
router.post('/get/:item_id', authHelper.isLoggedIn, itemController.getItem);

module.exports = router;