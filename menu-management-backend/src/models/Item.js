const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Item must belong to a Category'],
    },
    subCategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
        required: false, // Sub-category is optional
    },
    name: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true,
    },
    image: {
        type: String,
        default: 'no-item-image.jpg',
    },
    description: {
        type: String,
    },
    taxApplicability: {
        type: Boolean,
        required: true,
        default: false,
    },
    tax: {
        type: Number,
        default: 0,
        min: 0,
    },
    baseAmount: {
        type: Number,
        required: [true, 'Base amount is required'],
        min: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
    },
    // Total Amount will be calculated by the controller/pre-save middleware
    totalAmount: {
        type: Number,
        default: 0,
        min: 0,
    },
}, { timestamps: true });

// Pre-save middleware to calculate totalAmount
ItemSchema.pre('save', function (next) {
    this.totalAmount = this.baseAmount - this.discount;
    next();
});

module.exports = mongoose.model('Item', ItemSchema);