const express = require('express');
const router = express.Router();
const { getPortfolio, getDb } = require('../database/db');
const {
    parseUnstructuredPortfolio,
    analyzeJobDescription,
    matchPortfolioWithJD,
    tailorResumeContent
} = require('../services/geminiService');
const { SAMPLE_JOB_DESCRIPTIONS } = require('../services/resumeService');

// Get sample JDs
router.get('/sample-jds', (req, res) => {
    res.json({ success: true, sampleJds: SAMPLE_JOB_DESCRIPTIONS });
});

// Parse unstructured raw text / bio
router.post('/parse-unstructured', async (req, res) => {
    try {
        const { rawText, apiKey, autoSave } = req.body;
        if (!rawText || !rawText.trim()) {
            return res.status(400).json({ success: false, error: 'Raw text content is required.' });
        }

        const structuredData = await parseUnstructuredPortfolio(rawText, apiKey);

        // Optionally auto-merge into database
        if (autoSave && structuredData) {
            const db = getDb();
            // Update personal info if provided
            if (structuredData.personal_info) {
                const p = structuredData.personal_info;
                db.prepare(`
                    UPDATE personal_info
                    SET full_name = COALESCE(NULLIF(?, ''), full_name),
                        title = COALESCE(NULLIF(?, ''), title),
                        email = COALESCE(NULLIF(?, ''), email),
                        phone = COALESCE(NULLIF(?, ''), phone),
                        location = COALESCE(NULLIF(?, ''), location),
                        summary = COALESCE(NULLIF(?, ''), summary),
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = (SELECT id FROM personal_info ORDER BY id DESC LIMIT 1)
                `).run(p.full_name || '', p.title || '', p.email || '', p.phone || '', p.location || '', p.summary || '');
            }

            // Insert new skills
            if (structuredData.skills && Array.isArray(structuredData.skills)) {
                const insertSkill = db.prepare(`
                    INSERT OR IGNORE INTO skills (name, category, proficiency_level, years_of_experience)
                    VALUES (?, ?, ?, ?)
                `);
                for (const s of structuredData.skills) {
                    if (s.name) insertSkill.run(s.name, s.category || 'Technical Skills', s.proficiency_level || 'Advanced', s.years_of_experience || 2);
                }
            }
        }

        res.json({ success: true, data: structuredData });
    } catch (err) {
        console.error('Error in parse-unstructured:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Analyze Job Description
router.post('/analyze-jd', async (req, res) => {
    try {
        const { jdText, apiKey } = req.body;
        if (!jdText || !jdText.trim()) {
            return res.status(400).json({ success: false, error: 'Job description text is required.' });
        }

        const analysis = await analyzeJobDescription(jdText, apiKey);

        // Cache JD in database
        const db = getDb();
        const result = db.prepare(`
            INSERT INTO job_descriptions (title, company, raw_text, extracted_data)
            VALUES (?, ?, ?, ?)
        `).run(analysis.role_title || 'Target Role', analysis.company_name || 'Target Company', jdText, JSON.stringify(analysis));

        res.json({ success: true, jdId: result.lastInsertRowid, analysis });
    } catch (err) {
        console.error('Error in analyze-jd:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Match Portfolio with JD
router.post('/match-portfolio', async (req, res) => {
    try {
        const { jdAnalysis, apiKey } = req.body;
        if (!jdAnalysis) {
            return res.status(400).json({ success: false, error: 'Job description analysis is required.' });
        }

        const portfolio = getPortfolio();
        const matchResult = await matchPortfolioWithJD(portfolio, jdAnalysis, apiKey);

        res.json({ success: true, matchResult });
    } catch (err) {
        console.error('Error in match-portfolio:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Tailor Resume Content (Professional Summary & Bullets)
router.post('/tailor-resume', async (req, res) => {
    try {
        const { jdAnalysis, selectedItemIds, apiKey } = req.body;
        if (!jdAnalysis) {
            return res.status(400).json({ success: false, error: 'Job description analysis is required.' });
        }

        const portfolio = getPortfolio();
        const tailoredContent = await tailorResumeContent(portfolio, jdAnalysis, selectedItemIds, apiKey);

        res.json({ success: true, tailoredContent });
    } catch (err) {
        console.error('Error in tailor-resume:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
