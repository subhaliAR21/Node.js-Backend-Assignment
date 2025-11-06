const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category'); 

// @desc    Create a new SubCategory under a Category
// @route   POST /api/v1/categories/:categoryId/subcategories
// @access  Public
const createSubCategory = async (req, res) => {
    const { category, name, image, description, taxApplicability, tax } = req.body;

    try {
        // 1. Validate Category Existence
        const parentCategory = await Category.findById(category);

        if (!parentCategory) {
            return res.status(404).json({
                success: false,
                error: `Category not found with ID of ${category}`,
            });
        }
        
        // 2. Apply Default Tax Logic
        const subCategoryData = {
            category,
            name,
            image,
            description,
            // If tax fields are not provided in the request, default to the parent category's tax
            taxApplicability: taxApplicability !== undefined ? taxApplicability : parentCategory.taxApplicability,
            tax: tax !== undefined ? tax : parentCategory.tax,
        };

        // 3. Create the SubCategory
        const subCategory = await SubCategory.create(subCategoryData);

        res.status(201).json({
            success: true,
            data: subCategory,
            message: 'SubCategory created successfully',
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        if (error.name === 'CastError') {
             return res.status(400).json({ success: false, error: 'Invalid Category ID format in request body' });
        }
        res.status(500).json({ success: false, error: 'Server Error during subcategory creation' });
    }
};

// @desc    Get all SubCategories
// @route   GET /api/v1/subcategories
// @access  Public
const getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find().populate({
            path: 'category', // Populate the parent Category details
            select: 'name tax taxApplicability'
        });
        
        res.status(200).json({
            success: true,
            count: subCategories.length,
            data: subCategories,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error when fetching subcategories' });
    }
};

// @desc    Get a single SubCategory by ID
// @route   GET /api/v1/subcategories/:id
// @access  Public
const getSubCategoryById = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id).populate('category');

        if (!subCategory) {
            return res.status(404).json({ success: false, error: 'SubCategory not found' });
        }

        res.status(200).json({
            success: true,
            data: subCategory,
        });
    } catch (error) {
        if (error.name === 'CastError') {
             return res.status(400).json({ success: false, error: 'Invalid SubCategory ID format' });
        }
        res.status(500).json({ success: false, error: 'Server Error when fetching subcategory' });
    }
};

// @desc    Get all SubCategories under a specific Category
// @route   GET /api/v1/categories/:categoryId/subcategories
// @access  Public
const getSubCategoriesByCategory = async (req, res) => {
    try {
        const subCategories = await SubCategory.find({ category: req.params.categoryId });

        res.status(200).json({
            success: true,
            count: subCategories.length,
            data: subCategories,
        });
    } catch (error) {
        if (error.name === 'CastError') {
             return res.status(400).json({ success: false, error: 'Invalid Category ID format for filtering' });
        }
        res.status(500).json({ success: false, error: 'Server Error when fetching subcategories by category' });
    }
};

// @desc    Update SubCategory attributes
// @route   PATCH /api/v1/subcategories/:id
// @access  Public
const updateSubCategory = async (req, res) => {
    const { category } = req.body;
    
    try {
        // 1. If 'category' is being updated, validate the new parent ID
        if (category) {
            const parentCategory = await Category.findById(category);
            if (!parentCategory) {
                return res.status(404).json({
                    success: false,
                    error: `New parent Category not found with ID: ${category}`,
                });
            }
        }
        
        // 2. Perform the update
        const subCategory = await SubCategory.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            {
                new: true, 
                runValidators: true,
            }
        );

        if (!subCategory) {
            return res.status(404).json({ success: false, error: 'SubCategory not found for update' });
        }

        res.status(200).json({
            success: true,
            data: subCategory,
            message: 'SubCategory updated successfully',
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
        res.status(500).json({ success: false, error: 'Server Error during subcategory update' });
    }
};

module.exports = {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    getSubCategoriesByCategory,
    updateSubCategory, // <-- NEW EXPORT
};