/**
 * JD Matcher & Dynamic Resume Customizer Controller
 * Analyzes JDs with Gemini, computes match scores, and configures resume parameters
 */

const JdMatcherUI = {
    sampleJds: [],
    currentAnalysis: null,
    currentMatch: null,

    init() {
        this.bindEvents();
        this.loadSampleJds();
    },

    bindEvents() {
        // Quick benchmark buttons
        document.getElementById('btnSampleJd1').addEventListener('click', () => {
            this.selectSampleJd(0);
        });

        document.getElementById('btnSampleJd2').addEventListener('click', () => {
            this.selectSampleJd(1);
        });

        // Analyze button
        document.getElementById('btnAnalyzeJD').addEventListener('click', async () => {
            await this.analyzeCurrentJD();
        });

        // Proceed to studio button
        document.getElementById('btnProceedToStudio').addEventListener('click', () => {
            this.proceedToStudio();
        });
    },

    async loadSampleJds() {
        try {
            const res = await App.apiGet('/api/ai/sample-jds');
            if (res.success && res.sampleJds) {
                this.sampleJds = res.sampleJds;
                // Pre-populate with Sample 1
                if (this.sampleJds.length > 0) {
                    document.getElementById('jdInputText').value = this.sampleJds[0].raw_text;
                }
            }
        } catch (err) {
            console.error('Failed to load sample JDs:', err);
        }
    },

    selectSampleJd(index) {
        if (!this.sampleJds[index]) return;
        const jd = this.sampleJds[index];
        document.getElementById('jdInputText').value = jd.raw_text;
        App.showToast(`Loaded benchmark JD: ${jd.title}`, 'info');
        this.analyzeCurrentJD();
    },

    async analyzeCurrentJD() {
        const text = document.getElementById('jdInputText').value;
        if (!text.trim()) {
            App.showToast('Please enter or paste a Job Description.', 'error');
            return;
        }

        const analyzeBtn = document.getElementById('btnAnalyzeJD');
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = `⏳ Analyzing with Gemini...`;
        App.showToast('Gemini API analyzing job requirements & matching portfolio...', 'info');

        try {
            // 1. Analyze JD
            const analyzeRes = await App.apiPost('/api/ai/analyze-jd', { jdText: text });
            if (!analyzeRes.success) throw new Error(analyzeRes.error);
            this.currentAnalysis = analyzeRes.analysis;

            // 2. Match with portfolio
            const matchRes = await App.apiPost('/api/ai/match-portfolio', { jdAnalysis: this.currentAnalysis });
            if (!matchRes.success) throw new Error(matchRes.error);
            this.currentMatch = matchRes.matchResult;

            // 3. Render Match Dashboard
            this.renderMatchResults();
            App.showToast(`Match complete: ${this.currentMatch.overall_match_score}% Match!`, 'success');
        } catch (err) {
            App.showToast('Analysis error: ' + err.message, 'error');
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg> Analyze & Match with Gemini API`;
        }
    },

    renderMatchResults() {
        const section = document.getElementById('matchResultsSection');
        section.style.display = 'block';

        // Score Dial
        const score = this.currentMatch.overall_match_score || 85;
        document.getElementById('matchScoreVal').textContent = score;
        document.getElementById('matchLevelVal').textContent = this.currentMatch.match_level || 'Strong Match';

        const roleText = `${this.currentAnalysis.role_title || 'Target Role'} @ ${this.currentAnalysis.company_name || 'Target Company'}`;
        document.getElementById('targetRoleCompanyText').textContent = roleText;
        document.getElementById('targetRoleOverview').textContent = this.currentAnalysis.summary || '';

        // Skills Containers
        const matched = this.currentMatch.skill_coverage?.matched_required || [];
        const missing = this.currentMatch.skill_coverage?.missing_skills || [];

        document.getElementById('matchedSkillsCount').textContent = matched.length;
        document.getElementById('missingSkillsCount').textContent = missing.length;

        const matchedBox = document.getElementById('matchedSkillsContainer');
        matchedBox.innerHTML = matched.length > 0
            ? matched.map(s => `<span class="tag-badge success">✓ ${s}</span>`).join('')
            : '<span style="color: var(--text-muted); font-size: 0.8rem;">No direct matches found</span>';

        const missingBox = document.getElementById('missingSkillsContainer');
        missingBox.innerHTML = missing.length > 0
            ? missing.map(s => `<span class="tag-badge" style="color: #f87171; border-color: rgba(239, 68, 68, 0.3);">! ${s}</span>`).join('')
            : '<span class="tag-badge success">Zero skill gaps! Full coverage.</span>';

        // Render Inclusion Checklists
        this.renderSelectionChecklists();

        // Scroll smoothly to results
        section.scrollIntoView({ behavior: 'smooth' });
    },

    renderSelectionChecklists() {
        const container = document.getElementById('selectionChecklistsArea');
        const p = App.portfolioData;
        if (!p) return;

        const recommendedProjIds = this.currentMatch?.recommended_project_ids || [];
        const recommendedExpIds = this.currentMatch?.recommended_experience_ids || [];

        container.innerHTML = `
            <!-- Experience Checkbox List -->
            <div style="margin-bottom: 1.5rem;">
                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">
                    💼 Select Professional Experience to Include:
                </h4>
                ${(p.experience || []).map(exp => {
                    const isRec = recommendedExpIds.includes(exp.id);
                    return `
                        <label class="checklist-item" style="cursor: pointer;">
                            <input type="checkbox" name="chk_exp" value="${exp.id}" checked>
                            <div>
                                <strong style="color: var(--text-primary); font-size: 0.9rem;">${exp.role}</strong> — ${exp.company}
                                <span style="font-size: 0.8rem; color: var(--text-muted);">(${exp.start_date} – ${exp.is_current ? 'Present' : exp.end_date})</span>
                                ${isRec ? `<span class="tag-badge primary" style="font-size: 0.7rem; margin-left: 6px;">AI Recommended</span>` : ''}
                            </div>
                        </label>
                    `;
                }).join('')}
            </div>

            <!-- Projects Checkbox List -->
            <div style="margin-bottom: 1.5rem;">
                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">
                    🚀 Select Showcase Projects to Include:
                </h4>
                ${(p.projects || []).map(proj => {
                    const isRec = recommendedProjIds.includes(proj.id);
                    return `
                        <label class="checklist-item" style="cursor: pointer;">
                            <input type="checkbox" name="chk_proj" value="${proj.id}" ${isRec ? 'checked' : ''}>
                            <div>
                                <strong style="color: var(--text-primary); font-size: 0.9rem;">${proj.title}</strong>
                                <span style="font-size: 0.8rem; color: var(--text-muted);">${proj.technologies?.slice(0, 4).join(', ')}</span>
                                ${isRec ? `<span class="tag-badge primary" style="font-size: 0.7rem; margin-left: 6px;">AI High Match</span>` : ''}
                            </div>
                        </label>
                    `;
                }).join('')}
            </div>

            <!-- Publications & Certs List -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div>
                    <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">
                        📜 Certifications:
                    </h4>
                    ${(p.certifications || []).map(c => `
                        <label class="checklist-item" style="cursor: pointer;">
                            <input type="checkbox" name="chk_cert" value="${c.id}" checked>
                            <span style="font-size: 0.85rem;">${c.name}</span>
                        </label>
                    `).join('')}
                </div>
                <div>
                    <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">
                        📚 Research & Publications:
                    </h4>
                    ${(p.publications || []).map(pub => `
                        <label class="checklist-item" style="cursor: pointer;">
                            <input type="checkbox" name="chk_pub" value="${pub.id}" checked>
                            <span style="font-size: 0.85rem;">"${pub.title}"</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    },

    getSelectedParameters() {
        const selectedExp = Array.from(document.querySelectorAll('input[name="chk_exp"]:checked')).map(el => parseInt(el.value));
        const selectedProj = Array.from(document.querySelectorAll('input[name="chk_proj"]:checked')).map(el => parseInt(el.value));
        const selectedCert = Array.from(document.querySelectorAll('input[name="chk_cert"]:checked')).map(el => parseInt(el.value));
        const selectedPub = Array.from(document.querySelectorAll('input[name="chk_pub"]:checked')).map(el => parseInt(el.value));

        return {
            experienceIds: selectedExp,
            projectIds: selectedProj,
            certificationIds: selectedCert,
            publicationIds: selectedPub,
            targetRole: this.currentAnalysis?.role_title || 'Software Professional',
            jdAnalysis: this.currentAnalysis
        };
    },

    proceedToStudio() {
        const params = this.getSelectedParameters();
        ResumeStudioUI.applyJdCustomization(params);
        App.switchTab('tab-studio');
    }
};
