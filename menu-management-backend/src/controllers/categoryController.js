const Category = require('../models/Category');

// @desc    Create a new Category
// @route   POST /api/v1/categories
// @access  Public
const createCategory = async (req, res) => {
    try {
        // Create the category using the data sent in the request body
        const category = await Category.create(req.body);

        // Respond with the newly created category
        res.status(201).json({
            success: true,
            data: category,
            message: 'Category created successfully',
        });
    } catch (error) {
        console.error(error);
        
        // Handle validation errors (e.g., missing required fields) and unique errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        if (error.code === 11000) { // MongoDB duplicate key error (for unique 'name')
            return res.status(400).json({ success: false, error: 'Category with this name already exists' });
        }

        res.status(500).json({ 
            success: false, 
            error: 'Server Error during category creation' 
        });
    }
};

// @desc    Get all Categories
// @route   GET /api/v1/categories
// @access  Public
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error when fetching categories' });
    }
};

// @desc    Get a single Category by ID
// @route   GET /api/v1/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, error: 'Category not found' });
        }

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        // Handle case where ID format is invalid (Mongoose CastError)
        if (error.name === 'CastError') {
             return res.status(400).json({ success: false, error: 'Invalid Category ID format' });
        }
        res.status(500).json({ success: false, error: 'Server Error when fetching category' });
    }
};

// @desc    Update Category attributes
// @route   PATCH /api/v1/categories/:id
// @access  Public
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            {
                new: true, // Return the updated document
                runValidators: true, // Re-run Mongoose validators (e.g., for 'name' uniqueness)
            }
        );

        if (!category) {
            return res.status(404).json({ success: false, error: 'Category not found for update' });
        }

        res.status(200).json({
            success: true,
            data: category,
            message: 'Category updated successfully',
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'CastError') {
             return res.status(400).json({ success: false, error: 'Invalid Category ID format' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
         if (error.code === 11000) { // MongoDB duplicate key error (for unique 'name')
            return res.status(400).json({ success: false, error: 'Category with this name already exists' });
        }
        res.status(500).json({ success: false, error: 'Server Error during category update' });
    }
};


module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory, // <-- NEW EXPORT
};