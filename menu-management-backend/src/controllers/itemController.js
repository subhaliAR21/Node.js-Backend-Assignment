const Item = require('../models/Item');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');

// @desc    Create a new Item
// @route   POST /api/v1/items
// @access  Public
const createItem = async (req, res) => {
    const { category, subCategory } = req.body; 

    try {
        // 1. Basic validation: ensure the parent category exists
        const parentCategory = await Category.findById(category);
        if (!parentCategory) {
            return res.status(404).json({
                success: false,
                error: `Parent Category not found with ID: ${category}`,
            });
        }
        
        // 2. Optional validation: if subCategory is provided, ensure it exists
        if (subCategory) {
             const parentSubCategory = await SubCategory.findById(subCategory);
            if (!parentSubCategory) {
                return res.status(404).json({
                    success: false,
                    error: `Parent SubCategory not found with ID: ${subCategory}`,
                });
            }
        }

        // 3. Item creation: totalAmount calculation is handled by Mongoose pre('save') middleware
        const item = await Item.create(req.body);

        res.status(201).json({
            success: true,
            data: item,
            message: 'Item created successfully',
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
         if (error.name === 'CastError') {
             return res.status(400).json({ success: false, error: 'Invalid ID format in request body' });
        }
        res.status(500).json({ success: false, error: 'Server Error during item creation' });
    }
};

// @desc    Get all Items
// @route   GET /api/v1/items
// @access  Public
const getAllItems = async (req, res) => {
    try {
        const items = await Item.find().populate('category subCategory');
        
        res.status(200).json({
            success: true,
            count: items.length,
            data: items,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error when fetching items' });
    }
};

// @desc    Get a single Item by ID
// @route   GET /api/v1/items/:id
// @access  Public
const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('category subCategory');

        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        res.status(200).json({
            success: true,
            data: item,
        });
    } catch (error) {
        if (error.name === 'CastError') {
             return res.status(400).json({ success: false, error: 'Invalid Item ID format' });
        }
        res.status(500).json({ success: false, error: 'Server Error when fetching item' });
    }
};


// @desc    Get Items by Parent ID (Category or Subcategory)
// @route   GET /api/v1/categories/:categoryId/items or /api/v1/subcategories/:subCategoryId/items
// @access  Public
const getItemsByParentId = async (req, res) => {
    let filter = {};

    if (req.params.categoryId) {
        filter = { category: req.params.categoryId };
    } 
    else if (req.params.subCategoryId) {
        filter = { subCategory: req.params.subCategoryId };
    } else {
        return res.status(400).json({ success: false, error: 'Missing parent ID for filtering items' });
    }

    try {
        const items = await Item.find(filter).populate('category subCategory');

        res.status(200).json({
            success: true,
            count: items.length,
            data: items,
        });
    } catch (error) {
         if (error.name === 'CastError') {
             return res.status(400).json({ success: false, error: 'Invalid Parent ID format for filtering' });
        }
        res.status(500).json({ success: false, error: 'Server Error when fetching items by parent' });
    }
};


// @desc    Update Item attributes
// @route   PATCH /api/v1/items/:id
// @access  Public
const updateItem = async (req, res) => {
    const { category, subCategory } = req.body;
    
    try {
        // 1. Validation for parent IDs if they are being updated
        if (category) {
            const parentCategory = await Category.findById(category);
            if (!parentCategory) {
                return res.status(404).json({
                    success: false,
                    error: `New parent Category not found with ID: ${category}`,
                });
            }
        }
        if (subCategory) {
            const parentSubCategory = await SubCategory.findById(subCategory);
            if (!parentSubCategory) {
                return res.status(404).json({
                    success: false,
                    error: `New parent SubCategory not found with ID: ${subCategory}`,
                });
            }
        }
        
        // 2. Perform the update
        const item = await Item.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            {
                new: true, 
                runValidators: true,
            }
        );
        // Note: The pre('save') middleware runs on findByIdAndUpdate implicitly here, 
        // ensuring totalAmount is recalculated if baseAmount or discount changes.

        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found for update' });
        }

        res.status(200).json({
            success: true,
            data: item,
            message: 'Item updated successfully',
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'CastError') {
             return res.status(400).json({ success: false, error: 'Invalid ID format' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        res.status(500).json({ success: false, error: 'Server Error during item update' });
    }
};


// @desc    Search Items by Name
// @route   GET /api/v1/items/search?name=keyword
// @access  Public
const searchItems = async (req, res) => {
    const keyword = req.query.name;
    
    if (!keyword) {
        return res.status(400).json({ success: false, error: 'Search keyword is required (e.g., ?name=pizza)' });
    }

    try {
        // Use MongoDB $regex for partial, case-insensitive search on the name field
        const items = await Item.find({
            name: { $regex: keyword, $options: 'i' }
        }).populate('category subCategory'); // Populate for detailed results

        res.status(200).json({
            success: true,
            count: items.length,
            query: keyword,
            data: items,
        });

    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error during item search' });
    }
};

module.exports = {
    createItem,
    getAllItems,
    getItemById,
    getItemsByParentId,
    updateItem, // <-- NEW EXPORT
    searchItems, // <-- NEW EXPORT
};