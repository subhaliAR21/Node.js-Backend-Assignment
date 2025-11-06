const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category', // Reference to the Category model
        required: [true, 'Subcategory must belong to a Category'],
    },
    name: {
        type: String,
        required: [true, 'Subcategory name is required'],
        trim: true,
    },
    image: {
        type: String,
        default: 'no-image.jpg',
    },
    description: {
        type: String,
    },
    // NOTE: tax fields are often set to default to the parent Category's values
    taxApplicability: {
        type: Boolean,
        default: false, 
    },
    tax: {
        type: Number,
        default: 0,
        min: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', SubCategorySchema);