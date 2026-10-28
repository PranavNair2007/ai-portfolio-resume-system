/**
 * PortfolioPulse AI - Main Application Coordinator
 */

const App = {
    portfolioData: null,

    async init() {
        this.bindGlobalEvents();
        this.setupTheme();
        await this.loadPortfolio();
        PortfolioUI.init();
        JdMatcherUI.init();
        ResumeStudioUI.init();
        SheetsUI.init();
        this.loadSettings();
    },

    bindGlobalEvents() {
        // Main Tab Buttons
        document.querySelectorAll('#mainNavTabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });

        // Settings Modal
        document.getElementById('openSettingsBtn').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.add('active');
        });
        document.getElementById('btnCloseSettingsModal').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.remove('active');
        });
        document.getElementById('btnCancelSettingsModal').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.remove('active');
        });
        document.getElementById('btnSaveSettings').addEventListener('click', async () => {
            await this.saveSettings();
        });

        // Theme Toggle
        document.getElementById('themeToggleBtn').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Benchmark Dual Resumes Downloads in Tab 5
        document.getElementById('btnDownloadSample1Docx').addEventListener('click', () => {
            this.downloadSampleResumeDocx('fullstack');
        });
        document.getElementById('btnDownloadSample2Docx').addEventListener('click', () => {
            this.downloadSampleResumeDocx('datascience');
        });
    },

    switchTab(tabId) {
        document.querySelectorAll('#mainNavTabs .tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.id === tabId);
        });

        // Re-render studio when switching to it
        if (tabId === 'tab-studio') {
            ResumeStudioUI.renderResume();
        }
    },

    setupTheme() {
        const savedTheme = localStorage.getItem('app-theme') || 'dark';
        if (savedTheme === 'light') {
            document.body.classList.add('theme-light');
        }
    },

    toggleTheme() {
        const isLight = document.body.classList.toggle('theme-light');
        localStorage.setItem('app-theme', isLight ? 'light' : 'dark');
        this.showToast(`Switched to ${isLight ? 'Light' : 'Dark'} mode.`, 'info');
    },

    async loadPortfolio() {
        try {
            const res = await this.apiGet('/api/portfolio');
            if (res.success && res.portfolio) {
                this.portfolioData = res.portfolio;
                PortfolioUI.setPortfolio(this.portfolioData);
                ResumeStudioUI.renderResume();
            }
        } catch (err) {
            console.error('Failed to load portfolio:', err);
            this.showToast('Failed to load portfolio database: ' + err.message, 'error');
        }
    },

    async loadSettings() {
        try {
            const res = await this.apiGet('/api/export/settings');
            if (res.success) {
                if (res.hasGeminiKey) {
                    document.getElementById('settingsGeminiKeyInput').placeholder = `Configured (${res.maskedGeminiKey})`;
                }
                if (res.googleSheetsWebhookUrl) {
                    document.getElementById('settingsSheetsWebhookInput').value = res.googleSheetsWebhookUrl;
                }
            }
        } catch (err) {
            console.error('Failed to load settings:', err);
        }
    },

    async saveSettings() {
        const geminiKey = document.getElementById('settingsGeminiKeyInput').value;
        const sheetsUrl = document.getElementById('settingsSheetsWebhookInput').value;

        try {
            const payload = {};
            if (geminiKey.trim()) payload.geminiApiKey = geminiKey.trim();
            if (sheetsUrl.trim()) payload.googleSheetsWebhookUrl = sheetsUrl.trim();

            const res = await this.apiPost('/api/export/settings', payload);
            if (res.success) {
                this.showToast('Settings saved successfully!', 'success');
                document.getElementById('settingsModal').classList.remove('active');
            }
        } catch (err) {
            this.showToast('Failed to save settings: ' + err.message, 'error');
        }
    },

    async downloadSampleResumeDocx(type) {
        if (!this.portfolioData) return;

        let payload = {};
        if (type === 'fullstack') {
            payload = {
                target_role: 'Senior Full-Stack & AI Systems Engineer',
                tailored_summary: 'Versatile Senior Full-Stack & AI Systems Engineer with 6+ years of experience architecting high-scale distributed systems, enterprise generative AI copilots, and resilient cloud services. Expert in React, TypeScript, Node.js, and multi-tenant RAG pipelines processing millions of document chunks.',
                accent_color: '#4f46e5',
                selected_experience_ids: [1, 2],
                selected_project_ids: [1, 2],
                selected_certification_ids: [1, 2]
            };
        } else {
            payload = {
                target_role: 'Senior Machine Learning & NLP Data Scientist',
                tailored_summary: 'Accomplished Senior Machine Learning & NLP Data Scientist specializing in deep neural retrieval, transformer token quantization, and multimodal knowledge representation. Proven academic and industry track record in PyTorch, NeurIPS research, and high-performance vector architectures.',
                accent_color: '#059669',
                selected_experience_ids: [1, 3],
                selected_project_ids: [1, 2],
                selected_certification_ids: [2, 3],
                selected_publication_ids: [1, 2]
            };
        }

        this.showToast(`Generating customized DOCX resume for ${payload.target_role}...`, 'info');

        try {
            const response = await fetch('/api/export/docx', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Alex_Morgan_${payload.target_role.replace(/\s+/g, '_')}.docx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            this.showToast('Customized resume downloaded successfully!', 'success');
        } catch (err) {
            this.showToast('Download error: ' + err.message, 'error');
        }
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';
        if (type === 'warning') icon = '⚠️';

        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    // HTTP Helpers
    async apiGet(url) {
        const res = await fetch(url);
        return await res.json();
    },

    async apiPost(url, data) {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await res.json();
    },

    async apiPut(url, data) {
        const res = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await res.json();
    },

    async apiDelete(url) {
        const res = await fetch(url, { method: 'DELETE' });
        return await res.json();
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
