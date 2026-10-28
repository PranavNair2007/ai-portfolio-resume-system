const express = require('express');
const router = express.Router();
const { getDb, getPortfolio, seedDatabase } = require('../database/db');

// GET entire portfolio
router.get('/', (req, res) => {
    try {
        const portfolio = getPortfolio();
        res.json({ success: true, portfolio });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update personal information
router.put('/personal', (req, res) => {
    try {
        const db = getDb();
        const p = req.body;
        db.prepare(`
            UPDATE personal_info
            SET full_name = ?, title = ?, email = ?, phone = ?, location = ?,
                linkedin = ?, github = ?, portfolio_url = ?, summary = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = (SELECT id FROM personal_info ORDER BY id DESC LIMIT 1)
        `).run(
            p.full_name || '',
            p.title || '',
            p.email || '',
            p.phone || '',
            p.location || '',
            p.linkedin || '',
            p.github || '',
            p.portfolio_url || '',
            p.summary || ''
        );

        res.json({ success: true, message: 'Personal information updated successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Generic Add Entity to category table
router.post('/:section', (req, res) => {
    try {
        const { section } = req.params;
        const validTables = ['education', 'experience', 'skills', 'certifications', 'projects', 'achievements', 'publications', 'languages'];
        if (!validTables.includes(section)) {
            return res.status(400).json({ success: false, error: `Invalid portfolio section: ${section}` });
        }

        const db = getDb();
        const data = req.body;

        // Ensure JSON arrays are serialized
        if (data.bullet_points && Array.isArray(data.bullet_points)) data.bullet_points = JSON.stringify(data.bullet_points);
        if (data.technologies && Array.isArray(data.technologies)) data.technologies = JSON.stringify(data.technologies);
        if (data.coursework && Array.isArray(data.coursework)) data.coursework = JSON.stringify(data.coursework);
        if (data.skills_covered && Array.isArray(data.skills_covered)) data.skills_covered = JSON.stringify(data.skills_covered);

        const keys = Object.keys(data).filter(k => k !== 'id');
        const placeholders = keys.map(() => '?').join(', ');
        const values = keys.map(k => data[k]);

        const stmt = db.prepare(`INSERT INTO ${section} (${keys.join(', ')}) VALUES (${placeholders})`);
        const result = stmt.run(...values);

        res.json({ success: true, insertedId: result.lastInsertRowid, message: `Added new entry to ${section}.` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Generic Update Entity in category table
router.put('/:section/:id', (req, res) => {
    try {
        const { section, id } = req.params;
        const validTables = ['education', 'experience', 'skills', 'certifications', 'projects', 'achievements', 'publications', 'languages'];
        if (!validTables.includes(section)) {
            return res.status(400).json({ success: false, error: `Invalid portfolio section: ${section}` });
        }

        const db = getDb();
        const data = req.body;

        if (data.bullet_points && Array.isArray(data.bullet_points)) data.bullet_points = JSON.stringify(data.bullet_points);
        if (data.technologies && Array.isArray(data.technologies)) data.technologies = JSON.stringify(data.technologies);
        if (data.coursework && Array.isArray(data.coursework)) data.coursework = JSON.stringify(data.coursework);
        if (data.skills_covered && Array.isArray(data.skills_covered)) data.skills_covered = JSON.stringify(data.skills_covered);

        const keys = Object.keys(data).filter(k => k !== 'id');
        const setClause = keys.map(k => `${k} = ?`).join(', ');
        const values = [...keys.map(k => data[k]), id];

        const stmt = db.prepare(`UPDATE ${section} SET ${setClause} WHERE id = ?`);
        stmt.run(...values);

        res.json({ success: true, message: `Updated entry ${id} in ${section}.` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Generic Delete Entity
router.delete('/:section/:id', (req, res) => {
    try {
        const { section, id } = req.params;
        const validTables = ['education', 'experience', 'skills', 'certifications', 'projects', 'achievements', 'publications', 'languages'];
        if (!validTables.includes(section)) {
            return res.status(400).json({ success: false, error: `Invalid portfolio section: ${section}` });
        }

        const db = getDb();
        db.prepare(`DELETE FROM ${section} WHERE id = ?`).run(id);

        res.json({ success: true, message: `Deleted entry ${id} from ${section}.` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Reset database to initial seed
router.post('/reset/seed', (req, res) => {
    try {
        seedDatabase();
        res.json({ success: true, message: 'Database reset to comprehensive sample portfolio.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
