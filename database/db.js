const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const seedData = require('./seedData');

const DB_PATH = path.join(__dirname, 'portfolio.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let dbInstance = null;

function getDb() {
    if (!dbInstance) {
        dbInstance = new Database(DB_PATH);
        dbInstance.pragma('journal_mode = WAL');
        dbInstance.pragma('foreign_keys = ON');
        initSchema();
    }
    return dbInstance;
}

function initSchema() {
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
    dbInstance.exec(schemaSql);

    // Check if database needs initial seeding
    const personal = dbInstance.prepare('SELECT count(*) as count FROM personal_info').get();
    if (personal.count === 0) {
        console.log('[Database] Empty database detected. Seeding with sample portfolio data...');
        seedDatabase();
    }
}

function seedDatabase() {
    const db = dbInstance || getDb();
    const transaction = db.transaction(() => {
        // Clear all tables
        db.prepare('DELETE FROM personal_info').run();
        db.prepare('DELETE FROM education').run();
        db.prepare('DELETE FROM experience').run();
        db.prepare('DELETE FROM skills').run();
        db.prepare('DELETE FROM certifications').run();
        db.prepare('DELETE FROM projects').run();
        db.prepare('DELETE FROM achievements').run();
        db.prepare('DELETE FROM publications').run();
        db.prepare('DELETE FROM languages').run();

        // 1. Personal info
        const p = seedData.personal_info;
        db.prepare(`
            INSERT INTO personal_info (full_name, title, email, phone, location, linkedin, github, portfolio_url, summary)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(p.full_name, p.title, p.email, p.phone, p.location, p.linkedin, p.github, p.portfolio_url, p.summary);

        // 2. Education
        const insertEdu = db.prepare(`
            INSERT INTO education (institution, degree, field_of_study, start_date, end_date, gpa, honors, coursework, location, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const e of seedData.education) {
            insertEdu.run(e.institution, e.degree, e.field_of_study, e.start_date, e.end_date, e.gpa, e.honors, e.coursework, e.location, e.sort_order);
        }

        // 3. Experience
        const insertExp = db.prepare(`
            INSERT INTO experience (company, role, experience_type, location, start_date, end_date, is_current, description, bullet_points, technologies, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const exp of seedData.experience) {
            insertExp.run(exp.company, exp.role, exp.experience_type, exp.location, exp.start_date, exp.end_date, exp.is_current, exp.description, exp.bullet_points, exp.technologies, exp.sort_order);
        }

        // 4. Skills
        const insertSkill = db.prepare(`
            INSERT INTO skills (name, category, proficiency_level, years_of_experience, is_featured, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        for (const s of seedData.skills) {
            insertSkill.run(s.name, s.category, s.proficiency_level, s.years_of_experience, s.is_featured, s.sort_order);
        }

        // 5. Certifications
        const insertCert = db.prepare(`
            INSERT INTO certifications (name, issuing_organization, issue_date, expiration_date, credential_id, credential_url, skills_covered, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const c of seedData.certifications) {
            insertCert.run(c.name, c.issuing_organization, c.issue_date, c.expiration_date, c.credential_id, c.credential_url, c.skills_covered, c.sort_order);
        }

        // 6. Projects
        const insertProj = db.prepare(`
            INSERT INTO projects (title, role, start_date, end_date, url, github_url, description, bullet_points, technologies, featured, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const pr of seedData.projects) {
            insertProj.run(pr.title, pr.role, pr.start_date, pr.end_date, pr.url, pr.github_url, pr.description, pr.bullet_points, pr.technologies, pr.featured, pr.sort_order);
        }

        // 7. Achievements
        const insertAch = db.prepare(`
            INSERT INTO achievements (title, category, issuer, date, description, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        for (const a of seedData.achievements) {
            insertAch.run(a.title, a.category, a.issuer, a.date, a.description, a.sort_order);
        }

        // 8. Publications
        const insertPub = db.prepare(`
            INSERT INTO publications (title, venue, publication_date, authors, url, doi, description, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const pub of seedData.publications) {
            insertPub.run(pub.title, pub.venue, pub.publication_date, pub.authors, pub.url, pub.doi, pub.description, pub.sort_order);
        }

        // 9. Languages
        const insertLang = db.prepare(`
            INSERT INTO languages (language, proficiency, sort_order)
            VALUES (?, ?, ?)
        `);
        for (const l of seedData.languages) {
            insertLang.run(l.language, l.proficiency, l.sort_order);
        }
    });

    transaction();
    console.log('[Database] Seeded successfully with all 9 professional categories.');
}

function getPortfolio() {
    const db = getDb();
    const personal = db.prepare('SELECT * FROM personal_info ORDER BY id DESC LIMIT 1').get() || {};
    const education = db.prepare('SELECT * FROM education ORDER BY sort_order ASC, id ASC').all().map(item => ({
        ...item,
        coursework: item.coursework ? safeJsonParse(item.coursework, []) : []
    }));
    const experience = db.prepare('SELECT * FROM experience ORDER BY sort_order ASC, start_date DESC').all().map(item => ({
        ...item,
        bullet_points: item.bullet_points ? safeJsonParse(item.bullet_points, []) : [],
        technologies: item.technologies ? safeJsonParse(item.technologies, []) : []
    }));
    const skills = db.prepare('SELECT * FROM skills ORDER BY category ASC, sort_order ASC, name ASC').all();
    const certifications = db.prepare('SELECT * FROM certifications ORDER BY sort_order ASC, issue_date DESC').all().map(item => ({
        ...item,
        skills_covered: item.skills_covered ? safeJsonParse(item.skills_covered, []) : []
    }));
    const projects = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC, featured DESC, id ASC').all().map(item => ({
        ...item,
        bullet_points: item.bullet_points ? safeJsonParse(item.bullet_points, []) : [],
        technologies: item.technologies ? safeJsonParse(item.technologies, []) : []
    }));
    const achievements = db.prepare('SELECT * FROM achievements ORDER BY sort_order ASC, date DESC').all();
    const publications = db.prepare('SELECT * FROM publications ORDER BY sort_order ASC, publication_date DESC').all();
    const languages = db.prepare('SELECT * FROM languages ORDER BY sort_order ASC, language ASC').all();

    return {
        personal_info: personal,
        education,
        experience,
        skills,
        certifications,
        projects,
        achievements,
        publications,
        languages
    };
}

function safeJsonParse(val, fallback) {
    if (!val) return fallback;
    if (typeof val !== 'string') return val;
    try {
        return JSON.parse(val);
    } catch (e) {
        return fallback;
    }
}

module.exports = {
    getDb,
    getPortfolio,
    seedDatabase,
    safeJsonParse
};
