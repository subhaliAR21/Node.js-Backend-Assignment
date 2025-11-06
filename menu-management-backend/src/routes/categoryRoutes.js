const express = require('express');
const router = express.Router();
const { 
    createCategory, 
    getAllCategories, 
    getCategoryById,
    updateCategory // <-- IMPORT NEW FUNCTION
} = require('../controllers/categoryController'); 
const { 
    createSubCategory, 
    getSubCategoriesByCategory 
} = require('../controllers/subCategoryController'); 
const { 
    getItemsByParentId 
} = require('../controllers/itemController'); 

// --- Nested Routes ---

// Route to handle Sub-Category creation AND GET under a specific CATEGORY
router.route('/:categoryId/subcategories')
    .post(createSubCategory)        // API to create a sub-category under a category
    .get(getSubCategoriesByCategory);  // API to get all sub categories under a category

// Route to get all ITEMS under a specific CATEGORY
router.route('/:categoryId/items')
    .get(getItemsByParentId);       // API to get all items under a category

// --- Base Routes (Category CRUD) ---

// /api/v1/categories
router.route('/')
    .post(createCategory)        // API to create a category
    .get(getAllCategories);       // API to get all categories

// /api/v1/categories/:id
router.route('/:id')
    .get(getCategoryById)        // API to get a category by ID
    .patch(updateCategory);      // <-- USE NEW FUNCTION (API to edit category attributes)

module.exports = router;