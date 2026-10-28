const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { getDb } = require('../database/db');

// Retrieve stored Google Sheets Webhook URL
function getWebhookUrl(providedUrl = null) {
    if (providedUrl && providedUrl.trim().length > 0) {
        return providedUrl.trim();
    }
    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL && process.env.GOOGLE_SHEETS_WEBHOOK_URL.trim().length > 0) {
        return process.env.GOOGLE_SHEETS_WEBHOOK_URL.trim();
    }
    const db = getDb();
    const setting = db.prepare("SELECT value FROM app_settings WHERE key = 'google_sheets_webhook_url'").get();
    return setting && setting.value ? setting.value.trim() : null;
}

/**
 * Export portfolio to Google Sheets via Google Apps Script Webhook
 */
async function exportToGoogleSheets(portfolio, webhookUrl = null) {
    const url = getWebhookUrl(webhookUrl);
    const db = getDb();

    // Prepare payload
    const payload = {
        personal_info: portfolio.personal_info,
        education: portfolio.education,
        experience: portfolio.experience,
        skills: portfolio.skills,
        certifications: portfolio.certifications,
        projects: portfolio.projects,
        achievements: portfolio.achievements,
        publications: portfolio.publications,
        languages: portfolio.languages,
        exported_at: new Date().toISOString()
    };

    const recordCounts = {
        personal_info: 1,
        education: portfolio.education.length,
        experience: portfolio.experience.length,
        skills: portfolio.skills.length,
        certifications: portfolio.certifications.length,
        projects: portfolio.projects.length,
        achievements: portfolio.achievements.length,
        publications: portfolio.publications.length,
        languages: portfolio.languages.length
    };

    // If a webhook URL is configured, push directly to Google Sheets
    if (url) {
        try {
            console.log(`[Google Sheets] Dispatching export payload to ${url}...`);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                redirect: 'follow' // Follow Google Apps Script 302 redirect
            });

            const resultText = await response.text();
            let resultJson;
            try {
                resultJson = JSON.parse(resultText);
            } catch (e) {
                resultJson = { raw: resultText };
            }

            // Log successful sync
            db.prepare(`
                INSERT INTO sync_logs (sync_type, target_url, status, details, record_counts)
                VALUES (?, ?, ?, ?, ?)
            `).run('export', url, 'success', JSON.stringify(resultJson), JSON.stringify(recordCounts));

            return {
                success: true,
                mode: 'live_google_sheet',
                sheetUrl: resultJson.sheetUrl || url,
                recordCounts,
                message: 'Successfully synchronized portfolio with live Google Sheet!'
            };
        } catch (err) {
            console.error('[Google Sheets] Webhook error:', err);
            db.prepare(`
                INSERT INTO sync_logs (sync_type, target_url, status, details, record_counts)
                VALUES (?, ?, ?, ?, ?)
            `).run('export', url, 'failed', err.message, JSON.stringify(recordCounts));
            
            throw new Error(`Google Sheets Webhook connection failed: ${err.message}`);
        }
    } else {
        // Generate multi-tab workbook file as local Google Sheet ready artifact
        const excelBuffer = generatePortfolioWorkbookBuffer(portfolio);
        const exportDir = path.join(__dirname, '../public/exports');
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }
        const exportPath = path.join(exportDir, 'portfolio_database_export.xlsx');
        fs.writeFileSync(exportPath, excelBuffer);

        db.prepare(`
            INSERT INTO sync_logs (sync_type, target_url, status, details, record_counts)
            VALUES (?, ?, ?, ?, ?)
        `).run('export', 'local_multi_tab_workbook', 'success', 'Exported to multi-tab XLSX ready for Google Sheets import', JSON.stringify(recordCounts));

        return {
            success: true,
            mode: 'workbook_download',
            downloadUrl: '/api/sheets/download-xlsx',
            recordCounts,
            message: 'Exported portfolio to multi-tab spreadsheet. Connect your Google Apps Script URL for instant live cloud sync!'
        };
    }
}

/**
 * Generate a multi-tab workbook in memory using XLSX
 */
function generatePortfolioWorkbookBuffer(portfolio) {
    const wb = XLSX.utils.book_new();

    // 1. Personal Info
    const p = portfolio.personal_info || {};
    const pRows = [
        ['Field', 'Value'],
        ['Full Name', p.full_name || ''],
        ['Title', p.title || ''],
        ['Email', p.email || ''],
        ['Phone', p.phone || ''],
        ['Location', p.location || ''],
        ['LinkedIn', p.linkedin || ''],
        ['GitHub', p.github || ''],
        ['Portfolio URL', p.portfolio_url || ''],
        ['Summary', p.summary || ''],
        ['Exported At', new Date().toISOString()]
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(pRows), 'Personal_Info');

    // 2. Education
    const eduRows = [
        ['ID', 'Institution', 'Degree', 'Field of Study', 'Start Date', 'End Date', 'GPA', 'Honors', 'Location']
    ];
    for (const e of portfolio.education || []) {
        eduRows.push([e.id, e.institution, e.degree, e.field_of_study, e.start_date, e.end_date, e.gpa, e.honors, e.location]);
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(eduRows), 'Education');

    // 3. Experience
    const expRows = [
        ['ID', 'Company', 'Role', 'Type', 'Location', 'Start Date', 'End Date', 'Bullet Points', 'Technologies']
    ];
    for (const exp of portfolio.experience || []) {
        const bullets = Array.isArray(exp.bullet_points) ? exp.bullet_points.join(' | ') : exp.bullet_points;
        const techs = Array.isArray(exp.technologies) ? exp.technologies.join(', ') : exp.technologies;
        expRows.push([exp.id, exp.company, exp.role, exp.experience_type, exp.location, exp.start_date, exp.is_current ? 'Present' : exp.end_date, bullets, techs]);
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(expRows), 'Experience');

    // 4. Skills
    const skillRows = [
        ['ID', 'Skill Name', 'Category', 'Proficiency Level', 'Years Experience', 'Is Featured']
    ];
    for (const s of portfolio.skills || []) {
        skillRows.push([s.id, s.name, s.category, s.proficiency_level, s.years_of_experience, s.is_featured ? 'Yes' : 'No']);
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(skillRows), 'Skills');

    // 5. Projects
    const projRows = [
        ['ID', 'Project Title', 'Role', 'Start Date', 'End Date', 'URL', 'GitHub', 'Description', 'Bullets', 'Technologies']
    ];
    for (const pr of portfolio.projects || []) {
        const bullets = Array.isArray(pr.bullet_points) ? pr.bullet_points.join(' | ') : pr.bullet_points;
        const techs = Array.isArray(pr.technologies) ? pr.technologies.join(', ') : pr.technologies;
        projRows.push([pr.id, pr.title, pr.role, pr.start_date, pr.end_date, pr.url, pr.github_url, pr.description, bullets, techs]);
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(projRows), 'Projects');

    // 6. Certifications
    const certRows = [
        ['ID', 'Certification Name', 'Issuing Organization', 'Issue Date', 'Expiration Date', 'Credential ID', 'Verification URL']
    ];
    for (const c of portfolio.certifications || []) {
        certRows.push([c.id, c.name, c.issuing_organization, c.issue_date, c.expiration_date, c.credential_id, c.credential_url]);
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(certRows), 'Certifications');

    // 7. Achievements
    const achRows = [
        ['ID', 'Title', 'Category', 'Issuer', 'Date', 'Description']
    ];
    for (const a of portfolio.achievements || []) {
        achRows.push([a.id, a.title, a.category, a.issuer, a.date, a.description]);
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(achRows), 'Achievements');

    // 8. Publications
    const pubRows = [
        ['ID', 'Paper Title', 'Venue', 'Publication Date', 'Authors', 'DOI / URL', 'Description']
    ];
    for (const pub of portfolio.publications || []) {
        pubRows.push([pub.id, pub.title, pub.venue, pub.publication_date, pub.authors, pub.doi || pub.url, pub.description]);
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(pubRows), 'Publications');

    // 9. Languages
    const langRows = [
        ['ID', 'Language', 'Proficiency']
    ];
    for (const l of portfolio.languages || []) {
        langRows.push([l.id, l.language, l.proficiency]);
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(langRows), 'Languages');

    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

module.exports = {
    getWebhookUrl,
    exportToGoogleSheets,
    generatePortfolioWorkbookBuffer
};
