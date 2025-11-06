// Load environment variables first
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db.config');

// --- 1. Import Routes ---
const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const itemRoutes = require('./routes/itemRoutes');
// -------------------------

const app = express();
app.use(express.json());
connectDB();

// Define a basic route for testing (keep this for health check)
app.get('/', (req, res) => {
    res.send('Menu Management API is running!');
});

// --- 2. Mount Routes ---
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/subcategories', subCategoryRoutes);
app.use('/api/v1/items', itemRoutes);
// -------------------------


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});