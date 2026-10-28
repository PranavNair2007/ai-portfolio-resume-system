const express = require('express');
const router = express.Router();
const { getPortfolio, getDb } = require('../database/db');
const { assembleResume } = require('../services/resumeService');
const { generateDocxResume } = require('../services/docxService');

// Generate and download DOCX resume
router.post('/docx', async (req, res) => {
    try {
        const resumePayload = req.body;
        const portfolio = getPortfolio();
        const assembled = assembleResume(portfolio, resumePayload);

        const docxBuffer = await generateDocxResume(assembled);

        const candidateName = (portfolio.personal_info.full_name || 'Candidate').replace(/\s+/g, '_');
        const role = (resumePayload.target_role || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${candidateName}_${role}.docx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(docxBuffer);
    } catch (err) {
        console.error('Error generating DOCX resume:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Download JSON representation of resume
router.post('/json', (req, res) => {
    try {
        const resumePayload = req.body;
        const portfolio = getPortfolio();
        const assembled = assembleResume(portfolio, resumePayload);

        const candidateName = (portfolio.personal_info.full_name || 'Candidate').replace(/\s+/g, '_');
        const filename = `${candidateName}_Resume_Data.json`;

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(JSON.stringify(assembled, null, 2));
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Save a customized resume configuration
router.post('/save-config', (req, res) => {
    try {
        const db = getDb();
        const {
            name,
            jd_id,
            target_role,
            template_name,
            accent_color,
            tailored_summary,
            selected_skills,
            selected_experiences,
            selected_projects,
            selected_certifications,
            selected_achievements,
            selected_publications,
            custom_bullet_overrides
        } = req.body;

        const stmt = db.prepare(`
            INSERT INTO resume_configurations (
                name, jd_id, target_role, template_name, accent_color,
                tailored_summary, selected_skills, selected_experiences,
                selected_projects, selected_certifications, selected_achievements,
                selected_publications, custom_bullet_overrides, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `);

        const result = stmt.run(
            name || 'Custom Resume Configuration',
            jd_id || null,
            target_role || 'Target Role',
            template_name || 'modern',
            accent_color || '#4f46e5',
            tailored_summary || '',
            JSON.stringify(selected_skills || []),
            JSON.stringify(selected_experiences || []),
            JSON.stringify(selected_projects || []),
            JSON.stringify(selected_certifications || []),
            JSON.stringify(selected_achievements || []),
            JSON.stringify(selected_publications || []),
            JSON.stringify(custom_bullet_overrides || {})
        );

        res.json({ success: true, configId: result.lastInsertRowid, message: 'Configuration saved successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// List saved resume configurations
router.get('/configs', (req, res) => {
    try {
        const db = getDb();
        const configs = db.prepare('SELECT * FROM resume_configurations ORDER BY updated_at DESC').all();
        res.json({ success: true, configs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Settings: Get Gemini key and configurations
router.get('/settings', (req, res) => {
    try {
        const db = getDb();
        const geminiKeySetting = db.prepare("SELECT value FROM app_settings WHERE key = 'gemini_api_key'").get();
        const webhookSetting = db.prepare("SELECT value FROM app_settings WHERE key = 'google_sheets_webhook_url'").get();

        const key = geminiKeySetting?.value || process.env.GEMINI_API_KEY || '';
        const maskedKey = key ? (key.length > 8 ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}` : '••••••••') : '';

        res.json({
            success: true,
            hasGeminiKey: Boolean(key),
            maskedGeminiKey: maskedKey,
            googleSheetsWebhookUrl: webhookSetting?.value || process.env.GOOGLE_SHEETS_WEBHOOK_URL || ''
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Settings: Save Gemini key and configurations
router.post('/settings', (req, res) => {
    try {
        const db = getDb();
        const { geminiApiKey, googleSheetsWebhookUrl } = req.body;

        if (geminiApiKey !== undefined) {
            db.prepare(`
                INSERT INTO app_settings (key, value, updated_at)
                VALUES ('gemini_api_key', ?, CURRENT_TIMESTAMP)
                ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
            `).run(geminiApiKey ? geminiApiKey.trim() : '');
        }

        if (googleSheetsWebhookUrl !== undefined) {
            db.prepare(`
                INSERT INTO app_settings (key, value, updated_at)
                VALUES ('google_sheets_webhook_url', ?, CURRENT_TIMESTAMP)
                ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
            `).run(googleSheetsWebhookUrl ? googleSheetsWebhookUrl.trim() : '');
        }

        res.json({ success: true, message: 'Settings saved successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
