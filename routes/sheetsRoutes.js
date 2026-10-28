const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { getPortfolio, getDb } = require('../database/db');
const { exportToGoogleSheets, generatePortfolioWorkbookBuffer, getWebhookUrl } = require('../services/googleSheetsService');

// Export portfolio to Google Sheets
router.post('/export', async (req, res) => {
    try {
        const { webhookUrl } = req.body;
        const portfolio = getPortfolio();
        const result = await exportToGoogleSheets(portfolio, webhookUrl);

        res.json({ success: true, ...result });
    } catch (err) {
        console.error('Error exporting to Google Sheets:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Download multi-tab Excel workbook ready for Google Sheets
router.get('/download-xlsx', (req, res) => {
    try {
        const portfolio = getPortfolio();
        const buffer = generatePortfolioWorkbookBuffer(portfolio);

        const filename = `Portfolio_Database_${(portfolio.personal_info.full_name || 'Export').replace(/\s+/g, '_')}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(buffer);
    } catch (err) {
        console.error('Error generating Excel workbook:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get Apps Script Code.gs content
router.get('/code', (req, res) => {
    try {
        const scriptPath = path.join(__dirname, '../google-apps-script/Code.gs');
        const code = fs.readFileSync(scriptPath, 'utf8');
        res.json({ success: true, code });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get synchronization logs
router.get('/logs', (req, res) => {
    try {
        const db = getDb();
        const logs = db.prepare('SELECT * FROM sync_logs ORDER BY synced_at DESC LIMIT 20').all();
        res.json({ success: true, logs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get stored Google Sheets Webhook URL
router.get('/webhook-url', (req, res) => {
    try {
        const url = getWebhookUrl();
        res.json({ success: true, webhookUrl: url });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Save Google Sheets Webhook URL
router.post('/save-webhook', (req, res) => {
    try {
        const { webhookUrl } = req.body;
        const db = getDb();
        db.prepare(`
            INSERT INTO app_settings (key, value, updated_at)
            VALUES ('google_sheets_webhook_url', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
        `).run(webhookUrl ? webhookUrl.trim() : '');

        res.json({ success: true, message: 'Google Sheets Webhook URL saved successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
