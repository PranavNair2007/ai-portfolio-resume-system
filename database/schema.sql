-- Portfolio Database Schema (SQLite)

-- 1. Personal & Contact Information
CREATE TABLE IF NOT EXISTS personal_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    title TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    linkedin TEXT,
    github TEXT,
    portfolio_url TEXT,
    summary TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Educational Qualifications
CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    gpa TEXT,
    honors TEXT,
    coursework TEXT, -- JSON array of courses
    location TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Work Experience & Internships
CREATE TABLE IF NOT EXISTS experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    experience_type TEXT DEFAULT 'Full-time', -- 'Full-time', 'Internship', 'Contract'
    location TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT, -- NULL or 'Present'
    is_current INTEGER DEFAULT 0,
    description TEXT,
    bullet_points TEXT NOT NULL, -- JSON array of bullet strings
    technologies TEXT, -- JSON array of tech strings
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Technical and Soft Skills
CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL, -- 'Programming Languages', 'AI & Machine Learning', 'Frameworks & Libraries', 'Cloud & DevOps', 'Databases', 'Soft Skills'
    proficiency_level TEXT DEFAULT 'Advanced', -- 'Expert', 'Advanced', 'Intermediate', 'Beginner'
    years_of_experience REAL,
    is_featured INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Certifications & Courses
CREATE TABLE IF NOT EXISTS certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    issuing_organization TEXT NOT NULL,
    issue_date TEXT,
    expiration_date TEXT,
    credential_id TEXT,
    credential_url TEXT,
    skills_covered TEXT, -- JSON array
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Projects & Descriptions
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    role TEXT,
    start_date TEXT,
    end_date TEXT,
    url TEXT,
    github_url TEXT,
    description TEXT NOT NULL,
    bullet_points TEXT NOT NULL, -- JSON array of accomplishment bullets
    technologies TEXT NOT NULL, -- JSON array of tech stack
    featured INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Achievements & Awards
CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Award', -- 'Award', 'Hackathon', 'Scholarship', 'Patent'
    issuer TEXT,
    date TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Research Papers, Publications & Activities
CREATE TABLE IF NOT EXISTS publications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    venue TEXT NOT NULL, -- Journal / Conference / ArXiv / Blog
    publication_date TEXT,
    authors TEXT,
    url TEXT,
    doi TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. Languages & Competencies
CREATE TABLE IF NOT EXISTS languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    language TEXT NOT NULL,
    proficiency TEXT NOT NULL, -- 'Native', 'Fluent', 'Professional', 'Conversational'
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Job Descriptions & Analysis Cache
CREATE TABLE IF NOT EXISTS job_descriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT,
    raw_text TEXT NOT NULL,
    extracted_data TEXT, -- JSON object of parsed JD attributes
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. Resume Configurations (Customizations per JD)
CREATE TABLE IF NOT EXISTS resume_configurations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    jd_id INTEGER,
    target_role TEXT,
    template_name TEXT DEFAULT 'modern',
    accent_color TEXT DEFAULT '#4f46e5',
    tailored_summary TEXT,
    selected_skills TEXT, -- JSON array of skill IDs or names
    selected_experiences TEXT, -- JSON array of experience IDs
    selected_projects TEXT, -- JSON array of project IDs
    selected_certifications TEXT, -- JSON array of cert IDs
    selected_achievements TEXT, -- JSON array of achievement IDs
    selected_publications TEXT, -- JSON array of publication IDs
    custom_bullet_overrides TEXT, -- JSON map: { [itemKey]: string[] }
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(jd_id) REFERENCES job_descriptions(id) ON DELETE SET NULL
);

-- 12. Google Sheets Synchronization Logs
CREATE TABLE IF NOT EXISTS sync_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sync_type TEXT NOT NULL, -- 'export', 'import'
    target_url TEXT,
    status TEXT NOT NULL, -- 'success', 'failed'
    details TEXT,
    record_counts TEXT, -- JSON summary of rows per table
    synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 13. System Configurations (API keys, webhook URLs)
CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
