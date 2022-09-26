const express = require('express');
const router = express.Router();

const itemController = require('../controllers/item.controller');

// Create item
router.post('/create', itemController.createItem)

// Get all items

// Get a specific item

module.exports = router;