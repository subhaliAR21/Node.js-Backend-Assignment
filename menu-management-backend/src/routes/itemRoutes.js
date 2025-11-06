const express = require('express');
const router = express.Router();
const { 
    createItem, 
    getAllItems, 
    getItemById, 
    updateItem, // <-- IMPORT NEW FUNCTION
    searchItems // <-- IMPORT NEW FUNCTION
} = require('../controllers/itemController'); 

// --- Special Routes ---

// API to search the item by its name
router.route('/search')
    .get(searchItems); // <-- USE NEW FUNCTION

// --- Base Routes (Item CRUD) ---

// /api/v1/items
router.route('/')
    .post(createItem)            // API to create items
    .get(getAllItems);           // API to get all items

// /api/v1/items/:id
router.route('/:id')
    .get(getItemById)            // API to get an item by ID
    .patch(updateItem);          // <-- USE NEW FUNCTION (API to edit item attributes)

module.exports = router;