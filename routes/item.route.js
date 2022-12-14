const express = require('express');
const router = express.Router();

const itemController = require('../controllers/item.controller');
const authHelper = require("../helpers/auth.helper");

// Create item
router.post('/create', authHelper.isLoggedIn, itemController.createItem);

// Get all items

// Get a specific item
router.get('/get/:itemId', authHelper.isLoggedIn, itemController.getItem);

// Like an item
router.post('/like', authHelper.isLoggedIn, itemController.likeItem);

// Unlike an item
router.post('/unlike', authHelper.isLoggedIn, itemController.unlikeItem);

module.exports = router;