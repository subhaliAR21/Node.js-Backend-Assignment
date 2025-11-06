const express = require('express');
const router = express.Router();
const { 
    getAllSubCategories, 
    getSubCategoryById,
    updateSubCategory // <-- IMPORT NEW FUNCTION
} = require('../controllers/subCategoryController'); 
const { 
    getItemsByParentId 
} = require('../controllers/itemController'); 

// --- Nested Routes ---

// Route to get all ITEMS under a specific SUB-CATEGORY
router.route('/:subCategoryId/items')
    .get(getItemsByParentId);       // API to get all items under a sub-category

// --- Base Routes (SubCategory CRUD) ---

// /api/v1/subcategories
router.route('/')
    .get(getAllSubCategories);      // API to get all sub-categories (from all parents)

// /api/v1/subcategories/:id
router.route('/:id')
    .get(getSubCategoryById)       // API to get a sub-category by ID
    .patch(updateSubCategory);     // <-- USE NEW FUNCTION (API to edit sub category attributes)

module.exports = router;