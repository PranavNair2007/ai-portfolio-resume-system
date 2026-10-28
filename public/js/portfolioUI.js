/**
 * Portfolio Database UI Controller
 * Manages full CRUD operations across all 9 professional categories
 */

const PortfolioUI = {
    currentCategory: 'personal',
    portfolioData: null,

    init() {
        this.bindEvents();
    },

    bindEvents() {
        // Category navigation items
        document.querySelectorAll('.cat-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const cat = item.getAttribute('data-cat');
                this.switchCategory(cat);
            });
        });

        // Add new item button
        document.getElementById('btnAddNewItem').addEventListener('click', () => {
            this.openAddModal(this.currentCategory);
        });

        // Reset portfolio button
        document.getElementById('btnResetPortfolio').addEventListener('click', async () => {
            if (confirm('Reset portfolio database to initial comprehensive sample records?')) {
                await this.resetToSeed();
            }
        });

        // AI Raw Importer buttons
        document.getElementById('btnImportRawText').addEventListener('click', () => {
            document.getElementById('importerModal').classList.add('active');
        });

        document.getElementById('btnCloseImporterModal').addEventListener('click', () => {
            document.getElementById('importerModal').classList.remove('active');
        });

        document.getElementById('btnCancelImporterModal').addEventListener('click', () => {
            document.getElementById('importerModal').classList.remove('active');
        });

        document.getElementById('btnExecuteRawImport').addEventListener('click', async () => {
            await this.executeRawImport();
        });

        // Entry Modal Close
        document.getElementById('btnCloseEntryModal').addEventListener('click', () => {
            document.getElementById('entryModal').classList.remove('active');
        });
        document.getElementById('btnCancelEntryModal').addEventListener('click', () => {
            document.getElementById('entryModal').classList.remove('active');
        });
        document.getElementById('btnSaveEntryModal').addEventListener('click', async () => {
            await this.saveModalEntry();
        });
    },

    setPortfolio(data) {
        this.portfolioData = data;
        this.updateCounts();
        this.renderCurrentCategory();
    },

    switchCategory(cat) {
        this.currentCategory = cat;
        document.querySelectorAll('.cat-nav-item').forEach(el => {
            el.classList.toggle('active', el.getAttribute('data-cat') === cat);
        });
        this.renderCurrentCategory();
    },

    updateCounts() {
        if (!this.portfolioData) return;
        const counts = {
            skills: this.portfolioData.skills?.length || 0,
            experience: this.portfolioData.experience?.length || 0,
            projects: this.portfolioData.projects?.length || 0,
            education: this.portfolioData.education?.length || 0,
            certifications: this.portfolioData.certifications?.length || 0,
            achievements: this.portfolioData.achievements?.length || 0,
            publications: this.portfolioData.publications?.length || 0,
            languages: this.portfolioData.languages?.length || 0
        };

        for (const [key, val] of Object.entries(counts)) {
            const el = document.getElementById(`count-${key}`);
            if (el) el.textContent = val;
        }

        const navSkills = document.getElementById('navSkillsCount');
        if (navSkills) navSkills.textContent = counts.skills;
    },

    renderCurrentCategory() {
        const area = document.getElementById('categoryContentArea');
        if (!this.portfolioData) {
            area.innerHTML = '<div style="padding: 2rem; color: var(--text-muted);">Loading portfolio...</div>';
            return;
        }

        switch (this.currentCategory) {
            case 'personal':
                this.renderPersonal(area);
                break;
            case 'skills':
                this.renderSkills(area);
                break;
            case 'experience':
                this.renderExperience(area);
                break;
            case 'projects':
                this.renderProjects(area);
                break;
            case 'education':
                this.renderEducation(area);
                break;
            case 'certifications':
                this.renderCertifications(area);
                break;
            case 'achievements':
                this.renderAchievements(area);
                break;
            case 'publications':
                this.renderPublications(area);
                break;
            case 'languages':
                this.renderLanguages(area);
                break;
        }
    },

    renderPersonal(area) {
        const p = this.portfolioData.personal_info || {};
        area.innerHTML = `
            <div class="glass-card">
                <div class="item-card-header">
                    <div>
                        <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">${p.full_name || 'Candidate Name'}</h2>
                        <div style="font-size: 1.05rem; color: var(--primary); font-weight: 600; margin-top: 2px;">${p.title || 'Professional Title'}</div>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="PortfolioUI.openEditPersonalModal()">
                        ✏️ Edit Contact & Summary
                    </button>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0; padding: 1.25rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                    <div><strong style="color: var(--text-muted); font-size: 0.8rem;">Email:</strong><br>${p.email || '—'}</div>
                    <div><strong style="color: var(--text-muted); font-size: 0.8rem;">Phone:</strong><br>${p.phone || '—'}</div>
                    <div><strong style="color: var(--text-muted); font-size: 0.8rem;">Location:</strong><br>${p.location || '—'}</div>
                    <div><strong style="color: var(--text-muted); font-size: 0.8rem;">Website:</strong><br>${p.portfolio_url ? `<a href="${p.portfolio_url}" target="_blank" style="color: var(--primary);">${p.portfolio_url}</a>` : '—'}</div>
                    <div><strong style="color: var(--text-muted); font-size: 0.8rem;">LinkedIn:</strong><br>${p.linkedin ? `<a href="${p.linkedin}" target="_blank" style="color: var(--primary);">${p.linkedin}</a>` : '—'}</div>
                    <div><strong style="color: var(--text-muted); font-size: 0.8rem;">GitHub:</strong><br>${p.github ? `<a href="${p.github}" target="_blank" style="color: var(--primary);">${p.github}</a>` : '—'}</div>
                </div>

                <div>
                    <h3 style="font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.5rem;">Executive Summary</h3>
                    <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary); background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-sm); border-left: 3px solid var(--primary);">
                        ${p.summary || 'No summary defined yet.'}
                    </p>
                </div>
            </div>
        `;
    },

    renderSkills(area) {
        const skills = this.portfolioData.skills || [];
        const grouped = {};
        for (const s of skills) {
            const cat = s.category || 'General';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(s);
        }

        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <h2 style="font-size: 1.35rem; font-weight: 700;">Technical & Soft Skills (${skills.length})</h2>
                <button class="btn btn-primary btn-sm" onclick="PortfolioUI.openAddModal('skills')">+ Add Skill</button>
            </div>
        `;

        for (const [category, list] of Object.entries(grouped)) {
            html += `
                <div class="glass-card" style="margin-bottom: 1.25rem;">
                    <h3 style="font-size: 1rem; font-weight: 700; color: var(--primary); margin-bottom: 0.85rem;">${category}</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${list.map(s => `
                            <div class="tag-badge ${s.proficiency_level === 'Expert' ? 'primary' : ''}" style="padding: 0.35rem 0.75rem; font-size: 0.825rem; display: flex; align-items: center; gap: 0.5rem;">
                                <span>${s.name}</span>
                                <span style="font-size: 0.7rem; color: var(--text-muted);">(${s.proficiency_level})</span>
                                <span onclick="PortfolioUI.deleteItem('skills', ${s.id})" style="cursor: pointer; color: #ef4444; margin-left: 4px;" title="Delete">&times;</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        area.innerHTML = html;
    },

    renderExperience(area) {
        const expList = this.portfolioData.experience || [];
        area.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <h2 style="font-size: 1.35rem; font-weight: 700;">Professional Experience (${expList.length})</h2>
                <button class="btn btn-primary btn-sm" onclick="PortfolioUI.openAddModal('experience')">+ Add Experience</button>
            </div>
            ${expList.map(exp => `
                <div class="item-card">
                    <div class="item-card-header">
                        <div>
                            <div class="item-card-title">${exp.role}</div>
                            <div class="item-card-subtitle">${exp.company} &nbsp;•&nbsp; <span style="color: var(--text-muted); font-size: 0.85rem;">${exp.location || ''}</span></div>
                        </div>
                        <div class="item-card-actions">
                            <button class="btn btn-secondary btn-sm" onclick="PortfolioUI.editItem('experience', ${exp.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="PortfolioUI.deleteItem('experience', ${exp.id})">Delete</button>
                        </div>
                    </div>
                    <div class="item-card-meta">
                        <span>🗓️ ${exp.start_date} – ${exp.is_current ? '<span class="tag-badge success">Present</span>' : exp.end_date}</span>
                        <span>💼 ${exp.experience_type || 'Full-time'}</span>
                    </div>
                    <ul class="bullet-list">
                        ${(Array.isArray(exp.bullet_points) ? exp.bullet_points : []).map(b => `<li>${b}</li>`).join('')}
                    </ul>
                    <div style="margin-top: 0.85rem; display: flex; flex-wrap: wrap; gap: 0.35rem;">
                        ${(Array.isArray(exp.technologies) ? exp.technologies : []).map(t => `<span class="tag-badge primary">${t}</span>`).join('')}
                    </div>
                </div>
            `).join('')}
        `;
    },

    renderProjects(area) {
        const projList = this.portfolioData.projects || [];
        area.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <h2 style="font-size: 1.35rem; font-weight: 700;">Key Engineering Projects (${projList.length})</h2>
                <button class="btn btn-primary btn-sm" onclick="PortfolioUI.openAddModal('projects')">+ Add Project</button>
            </div>
            ${projList.map(p => `
                <div class="item-card">
                    <div class="item-card-header">
                        <div>
                            <div class="item-card-title">${p.title}</div>
                            <div class="item-card-subtitle">${p.role || 'Project Lead'}</div>
                        </div>
                        <div class="item-card-actions">
                            <button class="btn btn-secondary btn-sm" onclick="PortfolioUI.editItem('projects', ${p.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="PortfolioUI.deleteItem('projects', ${p.id})">Delete</button>
                        </div>
                    </div>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;">${p.description || ''}</p>
                    <ul class="bullet-list">
                        ${(Array.isArray(p.bullet_points) ? p.bullet_points : []).map(b => `<li>${b}</li>`).join('')}
                    </ul>
                    <div style="margin-top: 0.85rem; display: flex; flex-wrap: wrap; gap: 0.35rem;">
                        ${(Array.isArray(p.technologies) ? p.technologies : []).map(t => `<span class="tag-badge primary">${t}</span>`).join('')}
                    </div>
                </div>
            `).join('')}
        `;
    },

    renderEducation(area) {
        const eduList = this.portfolioData.education || [];
        area.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <h2 style="font-size: 1.35rem; font-weight: 700;">Education & Degrees (${eduList.length})</h2>
                <button class="btn btn-primary btn-sm" onclick="PortfolioUI.openAddModal('education')">+ Add Degree</button>
            </div>
            ${eduList.map(edu => `
                <div class="item-card">
                    <div class="item-card-header">
                        <div>
                            <div class="item-card-title">${edu.degree} in ${edu.field_of_study}</div>
                            <div class="item-card-subtitle">${edu.institution} &nbsp;•&nbsp; ${edu.location || ''}</div>
                        </div>
                        <div class="item-card-actions">
                            <button class="btn btn-secondary btn-sm" onclick="PortfolioUI.editItem('education', ${edu.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="PortfolioUI.deleteItem('education', ${edu.id})">Delete</button>
                        </div>
                    </div>
                    <div class="item-card-meta">
                        <span>🗓️ ${edu.start_date} – ${edu.end_date}</span>
                        ${edu.gpa ? `<span>🏆 GPA: ${edu.gpa}</span>` : ''}
                        ${edu.honors ? `<span>⭐ ${edu.honors}</span>` : ''}
                    </div>
                </div>
            `).join('')}
        `;
    },

    renderCertifications(area) {
        const certList = this.portfolioData.certifications || [];
        area.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <h2 style="font-size: 1.35rem; font-weight: 700;">Certifications & Accreditations (${certList.length})</h2>
                <button class="btn btn-primary btn-sm" onclick="PortfolioUI.openAddModal('certifications')">+ Add Certification</button>
            </div>
            ${certList.map(c => `
                <div class="item-card">
                    <div class="item-card-header">
                        <div>
                            <div class="item-card-title">${c.name}</div>
                            <div class="item-card-subtitle">${c.issuing_organization}</div>
                        </div>
                        <div class="item-card-actions">
                            <button class="btn btn-secondary btn-sm" onclick="PortfolioUI.editItem('certifications', ${c.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="PortfolioUI.deleteItem('certifications', ${c.id})">Delete</button>
                        </div>
                    </div>
                    <div class="item-card-meta">
                        <span>🗓️ Issued: ${c.issue_date || 'N/A'}</span>
                        ${c.credential_id ? `<span>🔑 ID: ${c.credential_id}</span>` : ''}
                    </div>
                </div>
            `).join('')}
        `;
    },

    renderAchievements(area) {
        const achList = this.portfolioData.achievements || [];
        area.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <h2 style="font-size: 1.35rem; font-weight: 700;">Achievements & Awards (${achList.length})</h2>
                <button class="btn btn-primary btn-sm" onclick="PortfolioUI.openAddModal('achievements')">+ Add Achievement</button>
            </div>
            ${achList.map(a => `
                <div class="item-card">
                    <div class="item-card-header">
                        <div>
                            <div class="item-card-title">${a.title}</div>
                            <div class="item-card-subtitle">${a.issuer || ''} &nbsp;•&nbsp; ${a.date || ''}</div>
                        </div>
                        <div class="item-card-actions">
                            <button class="btn btn-secondary btn-sm" onclick="PortfolioUI.editItem('achievements', ${a.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="PortfolioUI.deleteItem('achievements', ${a.id})">Delete</button>
                        </div>
                    </div>
                    <p style="font-size: 0.9rem; color: var(--text-secondary);">${a.description || ''}</p>
                </div>
            `).join('')}
        `;
    },

    renderPublications(area) {
        const pubList = this.portfolioData.publications || [];
        area.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <h2 style="font-size: 1.35rem; font-weight: 700;">Research Papers & Publications (${pubList.length})</h2>
                <button class="btn btn-primary btn-sm" onclick="PortfolioUI.openAddModal('publications')">+ Add Publication</button>
            </div>
            ${pubList.map(pub => `
                <div class="item-card">
                    <div class="item-card-header">
                        <div>
                            <div class="item-card-title">"${pub.title}"</div>
                            <div class="item-card-subtitle">${pub.venue} &nbsp;•&nbsp; ${pub.publication_date || ''}</div>
                        </div>
                        <div class="item-card-actions">
                            <button class="btn btn-secondary btn-sm" onclick="PortfolioUI.editItem('publications', ${pub.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="PortfolioUI.deleteItem('publications', ${pub.id})">Delete</button>
                        </div>
                    </div>
                    <div class="item-card-meta">
                        <span>👥 Authors: ${pub.authors || ''}</span>
                        ${pub.doi ? `<span>🔗 DOI: ${pub.doi}</span>` : ''}
                    </div>
                    <p style="font-size: 0.875rem; color: var(--text-secondary);">${pub.description || ''}</p>
                </div>
            `).join('')}
        `;
    },

    renderLanguages(area) {
        const langList = this.portfolioData.languages || [];
        area.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <h2 style="font-size: 1.35rem; font-weight: 700;">Languages (${langList.length})</h2>
                <button class="btn btn-primary btn-sm" onclick="PortfolioUI.openAddModal('languages')">+ Add Language</button>
            </div>
            <div class="glass-card">
                <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
                    ${langList.map(l => `
                        <div class="tag-badge" style="padding: 0.4rem 0.85rem; font-size: 0.875rem;">
                            <strong>${l.language}:</strong>&nbsp;${l.proficiency}
                            <span onclick="PortfolioUI.deleteItem('languages', ${l.id})" style="cursor: pointer; color: #ef4444; margin-left: 6px;">&times;</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // Modal forms management
    openAddModal(section) {
        if (section === 'personal') {
            this.openEditPersonalModal();
            return;
        }

        const modal = document.getElementById('entryModal');
        const title = document.getElementById('entryModalTitle');
        const body = document.getElementById('entryModalBody');

        title.textContent = `Add New ${section.slice(0, -1).toUpperCase()}`;
        modal.dataset.section = section;
        modal.dataset.mode = 'add';
        modal.dataset.itemId = '';

        body.innerHTML = this.getModalFormHtml(section, {});
        modal.classList.add('active');
    },

    editItem(section, id) {
        const item = (this.portfolioData[section] || []).find(x => x.id === id);
        if (!item) return;

        const modal = document.getElementById('entryModal');
        const title = document.getElementById('entryModalTitle');
        const body = document.getElementById('entryModalBody');

        title.textContent = `Edit ${section.slice(0, -1).toUpperCase()}`;
        modal.dataset.section = section;
        modal.dataset.mode = 'edit';
        modal.dataset.itemId = id;

        body.innerHTML = this.getModalFormHtml(section, item);
        modal.classList.add('active');
    },

    openEditPersonalModal() {
        const modal = document.getElementById('entryModal');
        const title = document.getElementById('entryModalTitle');
        const body = document.getElementById('entryModalBody');
        const p = this.portfolioData.personal_info || {};

        title.textContent = 'Edit Personal Information & Summary';
        modal.dataset.section = 'personal';
        modal.dataset.mode = 'personal';

        body.innerHTML = `
            <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-control" id="form_full_name" value="${p.full_name || ''}">
            </div>
            <div class="form-group">
                <label class="form-label">Professional Title</label>
                <input type="text" class="form-control" id="form_title" value="${p.title || ''}">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="form_email" value="${p.email || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Phone Number</label>
                    <input type="text" class="form-control" id="form_phone" value="${p.phone || ''}">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Location / Work Authorization</label>
                <input type="text" class="form-control" id="form_location" value="${p.location || ''}">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label">LinkedIn URL</label>
                    <input type="url" class="form-control" id="form_linkedin" value="${p.linkedin || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">GitHub URL</label>
                    <input type="url" class="form-control" id="form_github" value="${p.github || ''}">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Executive Professional Summary</label>
                <textarea class="form-control" id="form_summary" rows="4">${p.summary || ''}</textarea>
            </div>
        `;

        modal.classList.add('active');
    },

    getModalFormHtml(section, item) {
        switch (section) {
            case 'skills':
                return `
                    <div class="form-group">
                        <label class="form-label">Skill Name</label>
                        <input type="text" class="form-control" id="form_name" value="${item.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Category</label>
                        <select class="form-control" id="form_category">
                            ${['Programming Languages', 'AI & Machine Learning', 'Frameworks & Libraries', 'Cloud & DevOps', 'Databases & Storage', 'Soft Skills']
                                .map(c => `<option value="${c}" ${item.category === c ? 'selected' : ''}>${c}</option>`).join('')}
                        </select>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Proficiency Level</label>
                            <select class="form-control" id="form_proficiency_level">
                                ${['Expert', 'Advanced', 'Intermediate', 'Beginner']
                                    .map(l => `<option value="${l}" ${item.proficiency_level === l ? 'selected' : ''}>${l}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Years of Experience</label>
                            <input type="number" step="0.5" class="form-control" id="form_years_of_experience" value="${item.years_of_experience || 1}">
                        </div>
                    </div>
                `;
            case 'experience':
                return `
                    <div class="form-group">
                        <label class="form-label">Company Name</label>
                        <input type="text" class="form-control" id="form_company" value="${item.company || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Role Title</label>
                        <input type="text" class="form-control" id="form_role" value="${item.role || ''}" required>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Start Date (YYYY-MM)</label>
                            <input type="text" class="form-control" id="form_start_date" value="${item.start_date || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">End Date (or 'Present')</label>
                            <input type="text" class="form-control" id="form_end_date" value="${item.is_current ? 'Present' : (item.end_date || '')}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Accomplishment Bullet Points (One per line)</label>
                        <textarea class="form-control" id="form_bullet_points" rows="5">${(Array.isArray(item.bullet_points) ? item.bullet_points.join('\n') : '')}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Technologies Used (Comma-separated)</label>
                        <input type="text" class="form-control" id="form_technologies" value="${(Array.isArray(item.technologies) ? item.technologies.join(', ') : '')}">
                    </div>
                `;
            case 'projects':
                return `
                    <div class="form-group">
                        <label class="form-label">Project Title</label>
                        <input type="text" class="form-control" id="form_title" value="${item.title || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Role</label>
                        <input type="text" class="form-control" id="form_role" value="${item.role || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Project Description</label>
                        <textarea class="form-control" id="form_description" rows="2">${item.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Accomplishment Bullets (One per line)</label>
                        <textarea class="form-control" id="form_bullet_points" rows="4">${(Array.isArray(item.bullet_points) ? item.bullet_points.join('\n') : '')}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Technologies (Comma-separated)</label>
                        <input type="text" class="form-control" id="form_technologies" value="${(Array.isArray(item.technologies) ? item.technologies.join(', ') : '')}">
                    </div>
                `;
            case 'education':
                return `
                    <div class="form-group">
                        <label class="form-label">Institution</label>
                        <input type="text" class="form-control" id="form_institution" value="${item.institution || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Degree</label>
                        <input type="text" class="form-control" id="form_degree" value="${item.degree || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Field of Study</label>
                        <input type="text" class="form-control" id="form_field_of_study" value="${item.field_of_study || ''}">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Start Date</label>
                            <input type="text" class="form-control" id="form_start_date" value="${item.start_date || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">End Date</label>
                            <input type="text" class="form-control" id="form_end_date" value="${item.end_date || ''}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">GPA / Honors</label>
                        <input type="text" class="form-control" id="form_honors" value="${item.honors || ''}">
                    </div>
                `;
            case 'certifications':
                return `
                    <div class="form-group">
                        <label class="form-label">Certification Name</label>
                        <input type="text" class="form-control" id="form_name" value="${item.name || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Issuing Organization</label>
                        <input type="text" class="form-control" id="form_issuing_organization" value="${item.issuing_organization || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Issue Date</label>
                        <input type="text" class="form-control" id="form_issue_date" value="${item.issue_date || ''}">
                    </div>
                `;
            case 'achievements':
                return `
                    <div class="form-group">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" id="form_title" value="${item.title || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Issuer</label>
                        <input type="text" class="form-control" id="form_issuer" value="${item.issuer || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" id="form_description">${item.description || ''}</textarea>
                    </div>
                `;
            case 'publications':
                return `
                    <div class="form-group">
                        <label class="form-label">Paper Title</label>
                        <input type="text" class="form-control" id="form_title" value="${item.title || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Venue / Conference</label>
                        <input type="text" class="form-control" id="form_venue" value="${item.venue || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Authors</label>
                        <input type="text" class="form-control" id="form_authors" value="${item.authors || ''}">
                    </div>
                `;
            case 'languages':
                return `
                    <div class="form-group">
                        <label class="form-label">Language</label>
                        <input type="text" class="form-control" id="form_language" value="${item.language || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Proficiency</label>
                        <select class="form-control" id="form_proficiency">
                            ${['Native', 'Fluent', 'Professional', 'Conversational'].map(p => `<option value="${p}">${p}</option>`).join('')}
                        </select>
                    </div>
                `;
            default:
                return '';
        }
    },

    async saveModalEntry() {
        const modal = document.getElementById('entryModal');
        const section = modal.dataset.section;
        const mode = modal.dataset.mode;
        const itemId = modal.dataset.itemId;

        if (mode === 'personal') {
            const payload = {
                full_name: document.getElementById('form_full_name').value,
                title: document.getElementById('form_title').value,
                email: document.getElementById('form_email').value,
                phone: document.getElementById('form_phone').value,
                location: document.getElementById('form_location').value,
                linkedin: document.getElementById('form_linkedin').value,
                github: document.getElementById('form_github').value,
                summary: document.getElementById('form_summary').value
            };

            await App.apiPut('/api/portfolio/personal', payload);
            App.showToast('Personal info updated!', 'success');
        } else {
            const payload = {};
            const inputs = modal.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                const key = input.id.replace('form_', '');
                if (key === 'bullet_points') {
                    payload[key] = input.value.split('\n').map(s => s.trim()).filter(Boolean);
                } else if (key === 'technologies') {
                    payload[key] = input.value.split(',').map(s => s.trim()).filter(Boolean);
                } else {
                    payload[key] = input.value;
                }
            });

            if (mode === 'add') {
                await App.apiPost(`/api/portfolio/${section}`, payload);
                App.showToast(`Added new ${section.slice(0, -1)}!`, 'success');
            } else {
                await App.apiPut(`/api/portfolio/${section}/${itemId}`, payload);
                App.showToast(`Updated ${section.slice(0, -1)}!`, 'success');
            }
        }

        modal.classList.remove('active');
        await App.loadPortfolio();
    },

    async deleteItem(section, id) {
        if (!confirm('Are you sure you want to delete this record?')) return;
        await App.apiDelete(`/api/portfolio/${section}/${id}`);
        App.showToast('Item deleted.', 'info');
        await App.loadPortfolio();
    },

    async resetToSeed() {
        await App.apiPost('/api/portfolio/reset/seed', {});
        App.showToast('Database reset to comprehensive sample portfolio.', 'success');
        await App.loadPortfolio();
    },

    async executeRawImport() {
        const text = document.getElementById('rawImportTextInput').value;
        if (!text.trim()) {
            App.showToast('Please paste raw text first.', 'error');
            return;
        }

        App.showToast('Gemini is parsing unstructured text into database...', 'info');
        try {
            const res = await App.apiPost('/api/ai/parse-unstructured', { rawText: text, autoSave: true });
            if (res.success) {
                App.showToast('Successfully extracted and merged into portfolio!', 'success');
                document.getElementById('importerModal').classList.remove('active');
                await App.loadPortfolio();
            }
        } catch (err) {
            App.showToast('Import error: ' + err.message, 'error');
        }
    }
};
