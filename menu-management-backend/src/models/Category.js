const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
    },
    image: {
        type: String,
        default: 'no-image.jpg', // Placeholder image URL
    },
    description: {
        type: String,
        required: true,
    },
    taxApplicability: {
        type: Boolean,
        default: false,
    },
    tax: {
        type: Number,
        default: 0,
        min: 0,
    },
    taxType: {
        type: String, // e.g., 'GST', 'VAT'
        default: 'GST',
    },
    // We don't embed subcategories/items here; we reference them.
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);