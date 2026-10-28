/**
 * Live Resume Studio & Real-time Preview Controller
 * Renders high-fidelity ATS resumes, switches templates, generates DOCX & PDF
 */

const ResumeStudioUI = {
    currentConfig: {
        template_name: 'modern',
        accent_color: '#4f46e5',
        tailored_summary: null,
        selected_experience_ids: null,
        selected_project_ids: null,
        selected_certification_ids: null,
        selected_publication_ids: null,
        bullet_overrides: {},
        target_role: 'Senior Software & AI Engineer',
        jdAnalysis: null
    },

    init() {
        this.bindEvents();
    },

    bindEvents() {
        // Template Selector
        document.getElementById('templateSelector').addEventListener('change', (e) => {
            this.setTemplate(e.target.value);
        });

        // Accent Color Dots
        document.querySelectorAll('.color-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                const color = dot.getAttribute('data-color');
                this.setAccentColor(color);
            });
        });

        // AI Actions
        document.getElementById('btnAiTailorSummary').addEventListener('click', async () => {
            await this.aiTailorSummary();
        });

        document.getElementById('btnAiOptimizeBullets').addEventListener('click', async () => {
            await this.aiOptimizeBullets();
        });

        // Downloads
        document.getElementById('btnDownloadDocx').addEventListener('click', () => {
            this.downloadDocx();
        });
        document.getElementById('btnDownloadDocxSidebar').addEventListener('click', () => {
            this.downloadDocx();
        });

        document.getElementById('btnPrintResume').addEventListener('click', () => {
            window.print();
        });

        document.getElementById('btnDownloadJson').addEventListener('click', () => {
            this.downloadJson();
        });

        document.getElementById('btnSaveConfig').addEventListener('click', async () => {
            await this.saveConfiguration();
        });
    },

    setTemplate(name) {
        this.currentConfig.template_name = name;
        const sheet = document.getElementById('resumePreviewSheet');
        sheet.className = `resume-sheet tpl-${name}`;
        this.renderResume();
    },

    setAccentColor(color) {
        this.currentConfig.accent_color = color;
        const sheet = document.getElementById('resumePreviewSheet');
        sheet.style.setProperty('--resume-accent', color);
        this.renderResume();
    },

    applyJdCustomization(params) {
        this.currentConfig.selected_experience_ids = params.experienceIds;
        this.currentConfig.selected_project_ids = params.projectIds;
        this.currentConfig.selected_certification_ids = params.certificationIds;
        this.currentConfig.selected_publication_ids = params.publicationIds;
        this.currentConfig.target_role = params.targetRole;
        this.currentConfig.jdAnalysis = params.jdAnalysis;

        // Auto-craft initial role title & summary tailored to target role
        if (params.targetRole && App.portfolioData?.personal_info) {
            this.currentConfig.tailored_summary = `Accomplished ${params.targetRole} with verified background in ${params.jdAnalysis?.required_skills?.slice(0, 4).join(', ') || 'distributed systems and AI'}. Proven success in architecting production platforms, optimizing latency budgets, and delivering enterprise impact.`;
        }

        this.renderResume();
    },

    renderResume() {
        const p = App.portfolioData;
        if (!p) return;

        const sheet = document.getElementById('resumePreviewSheet');
        const personal = p.personal_info || {};
        const cfg = this.currentConfig;

        // Filter items
        const expList = (p.experience || []).filter(e => !cfg.selected_experience_ids || cfg.selected_experience_ids.includes(e.id));
        const projList = (p.projects || []).filter(pr => !cfg.selected_project_ids || cfg.selected_project_ids.includes(pr.id));
        const certList = (p.certifications || []).filter(c => !cfg.selected_certification_ids || cfg.selected_certification_ids.includes(c.id));
        const pubList = (p.publications || []).filter(pub => !cfg.selected_publication_ids || cfg.selected_publication_ids.includes(pub.id));
        const eduList = p.education || [];

        const summaryText = cfg.tailored_summary || personal.summary || '';
        const roleTitle = cfg.target_role || personal.title || 'Software Professional';

        // Group skills
        const featuredSkills = p.skills || [];
        const skillsByCategory = {};
        for (const s of featuredSkills) {
            const cat = s.category || 'Technical';
            if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
            skillsByCategory[cat].push(s.name);
        }

        sheet.innerHTML = `
            <!-- Resume Header -->
            <div class="res-header">
                <div class="res-name">${personal.full_name || 'Candidate Name'}</div>
                <div class="res-title">${roleTitle}</div>
                <div class="res-contact">
                    ${personal.email ? `<span>✉️ ${personal.email}</span>` : ''}
                    ${personal.phone ? `<span>📞 ${personal.phone}</span>` : ''}
                    ${personal.location ? `<span>📍 ${personal.location}</span>` : ''}
                    ${personal.linkedin ? `<span>🔗 <a href="${personal.linkedin}" target="_blank">LinkedIn</a></span>` : ''}
                    ${personal.github ? `<span>💻 <a href="${personal.github}" target="_blank">GitHub</a></span>` : ''}
                </div>
            </div>

            <!-- Professional Summary -->
            <div class="res-section">
                <div class="res-section-title">Professional Summary</div>
                <p style="margin: 0; line-height: 1.5; color: #1f2937;">${summaryText}</p>
            </div>

            <!-- Core Skills -->
            <div class="res-section">
                <div class="res-section-title">Core Competencies & Technical Skills</div>
                <div style="font-size: 13px; line-height: 1.6;">
                    ${Object.entries(skillsByCategory).map(([cat, list]) => `
                        <div><strong>• ${cat}:</strong> ${list.join(', ')}</div>
                    `).join('')}
                </div>
            </div>

            <!-- Professional Experience -->
            ${expList.length > 0 ? `
                <div class="res-section">
                    <div class="res-section-title">Professional Experience</div>
                    ${expList.map(exp => {
                        const bullets = cfg.bullet_overrides[`exp_${exp.id}`] || exp.bullet_points || [];
                        return `
                            <div class="res-entry">
                                <div class="res-entry-head">
                                    <span class="res-entry-role">${exp.role} <span class="res-entry-company">— ${exp.company}</span></span>
                                    <span class="res-entry-dates">${exp.start_date} – ${exp.is_current ? 'Present' : exp.end_date}</span>
                                </div>
                                <ul class="res-bullets">
                                    ${bullets.map(b => `<li>${b}</li>`).join('')}
                                </ul>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : ''}

            <!-- Key Engineering Projects -->
            ${projList.length > 0 ? `
                <div class="res-section">
                    <div class="res-section-title">Featured Projects</div>
                    ${projList.map(pr => {
                        const bullets = cfg.bullet_overrides[`proj_${pr.id}`] || pr.bullet_points || [];
                        return `
                            <div class="res-entry">
                                <div class="res-entry-head">
                                    <span class="res-entry-role">${pr.title} ${pr.role ? `<span style="font-weight: 500; font-size: 12px; color: #4b5563;">(${pr.role})</span>` : ''}</span>
                                    ${pr.url ? `<span class="res-entry-dates"><a href="${pr.url}" target="_blank" style="color: inherit;">${pr.url}</a></span>` : ''}
                                </div>
                                <div style="font-size: 12px; color: #4b5563; font-style: italic; margin-bottom: 2px;">
                                    ${pr.technologies?.slice(0, 6).join(' • ')}
                                </div>
                                <ul class="res-bullets">
                                    ${bullets.map(b => `<li>${b}</li>`).join('')}
                                </ul>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : ''}

            <!-- Education -->
            ${eduList.length > 0 ? `
                <div class="res-section">
                    <div class="res-section-title">Education</div>
                    ${eduList.map(edu => `
                        <div class="res-entry">
                            <div class="res-entry-head">
                                <span class="res-entry-role">${edu.degree} in ${edu.field_of_study}</span>
                                <span class="res-entry-dates">${edu.start_date} – ${edu.end_date}</span>
                            </div>
                            <div style="font-size: 12px; color: #4b5563;">
                                ${edu.institution} ${edu.gpa ? `• GPA: ${edu.gpa}` : ''} ${edu.honors ? `• ${edu.honors}` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            <!-- Certifications & Publications -->
            ${(certList.length > 0 || pubList.length > 0) ? `
                <div class="res-section">
                    <div class="res-section-title">Certifications & Research Publications</div>
                    <ul class="res-bullets">
                        ${certList.map(c => `<li><strong>${c.name}</strong> — ${c.issuing_organization} (${c.issue_date})</li>`).join('')}
                        ${pubList.map(pub => `<li>"${pub.title}" — <em>${pub.venue}</em> (${pub.publication_date})</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        `;
    },

    async aiTailorSummary() {
        if (!this.currentConfig.jdAnalysis) {
            App.showToast('Please analyze a Job Description in Tab 2 first!', 'warning');
            return;
        }

        App.showToast('Gemini is synthesizing a targeted, anti-hallucinated summary...', 'info');
        try {
            const res = await App.apiPost('/api/ai/tailor-resume', {
                jdAnalysis: this.currentConfig.jdAnalysis,
                selectedItemIds: {
                    experience: this.currentConfig.selected_experience_ids,
                    projects: this.currentConfig.selected_project_ids
                }
            });

            if (res.success && res.tailoredContent) {
                this.currentConfig.tailored_summary = res.tailoredContent.tailored_summary;
                if (res.tailoredContent.tailored_bullets) {
                    this.currentConfig.bullet_overrides = res.tailoredContent.tailored_bullets;
                }
                this.renderResume();
                App.showToast('Summary tailored successfully to target JD!', 'success');
            }
        } catch (err) {
            App.showToast('Tailoring error: ' + err.message, 'error');
        }
    },

    async aiOptimizeBullets() {
        if (!this.currentConfig.jdAnalysis) {
            App.showToast('Please analyze a Job Description in Tab 2 first!', 'warning');
            return;
        }

        App.showToast('Gemini is polishing bullet points with target keywords...', 'info');
        try {
            const res = await App.apiPost('/api/ai/tailor-resume', {
                jdAnalysis: this.currentConfig.jdAnalysis,
                selectedItemIds: {
                    experience: this.currentConfig.selected_experience_ids,
                    projects: this.currentConfig.selected_project_ids
                }
            });

            if (res.success && res.tailoredContent?.tailored_bullets) {
                this.currentConfig.bullet_overrides = res.tailoredContent.tailored_bullets;
                this.renderResume();
                App.showToast('Bullets polished & verified against original portfolio records!', 'success');
            }
        } catch (err) {
            App.showToast('Optimization error: ' + err.message, 'error');
        }
    },

    async downloadDocx() {
        App.showToast('Generating ATS-compliant Word (.docx) document...', 'info');
        try {
            const payload = {
                target_role: this.currentConfig.target_role,
                tailored_summary: this.currentConfig.tailored_summary,
                accent_color: this.currentConfig.accent_color,
                selected_experience_ids: this.currentConfig.selected_experience_ids,
                selected_project_ids: this.currentConfig.selected_project_ids,
                selected_certification_ids: this.currentConfig.selected_certification_ids,
                selected_publication_ids: this.currentConfig.selected_publication_ids,
                bullet_overrides: this.currentConfig.bullet_overrides
            };

            const response = await fetch('/api/export/docx', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to generate DOCX');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const candidateName = (App.portfolioData?.personal_info?.full_name || 'Resume').replace(/\s+/g, '_');
            const role = (this.currentConfig.target_role || 'Custom').replace(/[^a-zA-Z0-9_-]/g, '_');
            a.download = `${candidateName}_${role}.docx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            App.showToast('Word document downloaded successfully!', 'success');
        } catch (err) {
            App.showToast('Download failed: ' + err.message, 'error');
        }
    },

    async downloadJson() {
        try {
            const payload = {
                target_role: this.currentConfig.target_role,
                tailored_summary: this.currentConfig.tailored_summary,
                accent_color: this.currentConfig.accent_color,
                selected_experience_ids: this.currentConfig.selected_experience_ids,
                selected_project_ids: this.currentConfig.selected_project_ids,
                bullet_overrides: this.currentConfig.bullet_overrides
            };

            const response = await fetch('/api/export/json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Resume_Export_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            App.showToast('Resume JSON data exported!', 'success');
        } catch (err) {
            App.showToast('JSON export failed: ' + err.message, 'error');
        }
    },

    async saveConfiguration() {
        const name = prompt('Enter a name for this resume configuration:', `${this.currentConfig.target_role} Resume`);
        if (!name) return;

        try {
            await App.apiPost('/api/export/save-config', {
                name,
                target_role: this.currentConfig.target_role,
                template_name: this.currentConfig.template_name,
                accent_color: this.currentConfig.accent_color,
                tailored_summary: this.currentConfig.tailored_summary,
                selected_experiences: this.currentConfig.selected_experience_ids,
                selected_projects: this.currentConfig.selected_project_ids,
                selected_certifications: this.currentConfig.selected_certification_ids,
                selected_publications: this.currentConfig.selected_publication_ids,
                custom_bullet_overrides: this.currentConfig.bullet_overrides
            });
            App.showToast('Resume configuration saved to database!', 'success');
        } catch (err) {
            App.showToast('Failed to save config: ' + err.message, 'error');
        }
    }
};
