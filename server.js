require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDb } = require('./database/db');

const portfolioRoutes = require('./routes/portfolioRoutes');
const aiRoutes = require('./routes/aiRoutes');
const sheetsRoutes = require('./routes/sheetsRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/sheets', sheetsRoutes);
app.use('/api/export', exportRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        system: 'AI-Powered Portfolio & Resume Generator',
        database: 'SQLite (WAL mode)',
        geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
        timestamp: new Date().toISOString()
    });
});

// Single Page Application fallback
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize database schema and seed on boot
getDb();

// Start server
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 AI Portfolio Management & Resume Generator Running`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📁 Database: SQLite (database/portfolio.db)`);
    console.log(`=======================================================`);
});
