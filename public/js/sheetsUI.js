/**
 * Google Sheets Integration & Synchronization Controller
 */

const SheetsUI = {
    init() {
        this.bindEvents();
        this.loadWebhookUrl();
        this.loadSyncLogs();
    },

    bindEvents() {
        // Direct XLSX Download
        document.getElementById('btnDownloadXlsxDirect').addEventListener('click', () => {
            window.location.href = '/api/sheets/download-xlsx';
            App.showToast('Downloading multi-tab Excel workbook...', 'info');
        });

        // Live Export to Google Sheets
        document.getElementById('btnSyncGoogleSheets').addEventListener('click', async () => {
            await this.exportToSheets();
        });

        // Save Webhook URL
        document.getElementById('btnSaveWebhookUrl').addEventListener('click', async () => {
            await this.saveWebhookUrl();
        });

        // Test Webhook
        document.getElementById('btnTestWebhook').addEventListener('click', async () => {
            await this.exportToSheets();
        });

        // Copy Apps Script Code
        document.getElementById('btnCopyAppsScriptCode').addEventListener('click', async () => {
            await this.copyAppsScriptCode();
        });
    },

    async loadWebhookUrl() {
        try {
            const res = await App.apiGet('/api/sheets/webhook-url');
            if (res.success && res.webhookUrl) {
                document.getElementById('sheetsWebhookInput').value = res.webhookUrl;
            }
        } catch (err) {
            console.error('Failed to load webhook URL:', err);
        }
    },

    async saveWebhookUrl() {
        const url = document.getElementById('sheetsWebhookInput').value;
        try {
            const res = await App.apiPost('/api/sheets/save-webhook', { webhookUrl: url });
            if (res.success) {
                App.showToast('Google Sheets Webhook URL saved!', 'success');
            }
        } catch (err) {
            App.showToast('Failed to save webhook URL: ' + err.message, 'error');
        }
    },

    async exportToSheets() {
        const url = document.getElementById('sheetsWebhookInput').value;
        App.showToast('Exporting all 9 portfolio categories to Google Sheets...', 'info');

        try {
            const res = await App.apiPost('/api/sheets/export', { webhookUrl: url });
            if (res.success) {
                if (res.mode === 'live_google_sheet') {
                    App.showToast('Synchronized with live Google Sheet successfully!', 'success');
                } else {
                    App.showToast(res.message, 'success');
                    // Trigger download
                    window.location.href = '/api/sheets/download-xlsx';
                }
                await this.loadSyncLogs();
            }
        } catch (err) {
            App.showToast('Google Sheets sync failed: ' + err.message, 'error');
            await this.loadSyncLogs();
        }
    },

    async loadSyncLogs() {
        try {
            const res = await App.apiGet('/api/sheets/logs');
            const container = document.getElementById('sheetsSyncLogArea');
            if (!container) return;

            if (!res.success || !res.logs || res.logs.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem;">
                        No synchronization history yet. Click "Export to Google Sheets Now" above to begin.
                    </div>
                `;
                return;
            }

            container.innerHTML = res.logs.map(log => {
                const isSuccess = log.status === 'success';
                let counts = {};
                try { counts = JSON.parse(log.record_counts || '{}'); } catch(e) {}
                const totalRows = Object.values(counts).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

                return `
                    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.85rem; margin-bottom: 0.75rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                            <span class="tag-badge ${isSuccess ? 'success' : 'danger'}" style="font-size: 0.75rem;">
                                ${isSuccess ? '✓ SYNCED' : '✗ FAILED'}
                            </span>
                            <span style="font-size: 0.75rem; color: var(--text-muted);">${new Date(log.synced_at).toLocaleString()}</span>
                        </div>
                        <div style="font-size: 0.825rem; color: var(--text-secondary);">
                            <strong>Target:</strong> ${log.target_url}
                        </div>
                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">
                            Records: <strong>${totalRows} total items</strong> across 9 separate worksheets
                        </div>
                    </div>
                `;
            }).join('');
        } catch (err) {
            console.error('Failed to load sync logs:', err);
        }
    },

    async copyAppsScriptCode() {
        try {
            const res = await App.apiGet('/api/sheets/code');
            if (res.success && res.code) {
                await navigator.clipboard.writeText(res.code);
                App.showToast('Google Apps Script code copied to clipboard!', 'success');
            }
        } catch (err) {
            App.showToast('Could not copy code automatically. Check google-apps-script/Code.gs in the project directory.', 'warning');
        }
    }
};
