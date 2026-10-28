# 🚀 PortfolioPulse AI - Intelligent Portfolio Database & Dynamic Resume Generator

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/PranavNair2007/ai-portfolio-resume-system)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PranavNair2007/ai-portfolio-resume-system)
[![GitHub Repository](https://img.shields.io/badge/GitHub-PranavNair2007%2Fai--portfolio--resume--system-blue?logo=github)](https://github.com/PranavNair2007/ai-portfolio-resume-system)

An enterprise-grade, AI-powered portfolio management and resume customization platform. It centralizes professional credentials, projects, certifications, experiences, and publications in a structured relational database (SQLite), integrates with the **Google Gemini API** for semantic analysis and job-description matching, provides **bi-directional Google Sheets synchronization**, and generates ATS-optimized, downloadable resumes (**DOCX & PDF**) dynamically tailored to specific target Job Descriptions (JDs).

---

## 📑 Table of Contents
1. [Architecture & System Flow](#-architecture--system-flow)
2. [Key Capabilities](#-key-capabilities)
3. [Database Schema](#-database-schema)
4. [Installation & Setup](#-installation--setup)
5. [Gemini API Integration & Anti-Hallucination Guardrails](#-gemini-api-integration--anti-hallucination-guardrails)
6. [Google Sheets Integration Guide](#-google-sheets-integration-guide)
7. [Benchmark Test Cases & Dual Resume Customization](#-benchmark-test-cases--dual-resume-customization)
8. [Deliverables & Sample Files](#-deliverables--sample-files)

---

## 🏛️ Architecture & System Flow

```mermaid
flowchart TD
    subgraph Client [Web Interface]
        UI[Modern Glassmorphism UI]
        PM[Portfolio Manager]
        JM[JD Matcher & Customizer]
        RS[Live Resume Studio]
        GS[Google Sheets Hub]
        EC[Export & Compare Center]
    end

    subgraph CoreBackend [Node.js Express Server]
        API_Portfolio[/api/portfolio]
        API_AI[/api/ai]
        API_Sheets[/api/sheets]
        API_Export[/api/export]
    end

    subgraph Storage [Database & Cloud]
        SQLite[(SQLite Database WAL Mode)]
        GSheets[Google Sheets Webhook & Multi-Tab XLSX]
    end

    subgraph AI_Engine [Gemini AI Service]
        GeminiFlash[Google Gemini 2.5 / 1.5 Flash]
        Guardrails[Anti-Hallucination Verification Layer]
        FallbackNLP[Semantic ATS Heuristic Engine]
    end

    subgraph Outputs [Generated Deliverables]
        DocxFile[Styled Word .DOCX Resume]
        PdfFile[Print-Accurate Vector PDF]
        JsonFile[Structured Resume JSON]
        XlsxFile[9-Tab Spreadsheet XLSX]
    end

    UI --> CoreBackend
    API_Portfolio --> SQLite
    API_Sheets --> SQLite
    API_Sheets <--> GSheets
    API_AI --> GeminiFlash
    GeminiFlash --> Guardrails
    Guardrails --> CoreBackend
    API_Export --> DocxFile
    API_Export --> PdfFile
    API_Export --> JsonFile
    API_Sheets --> XlsxFile
```

---

## ✨ Key Capabilities

### 1. Centralized Structured Portfolio Database
* **9 Standardized Categories**:
  1. Personal & Contact Information + Executive Summary
  2. Educational Qualifications (Degrees, Coursework, GPA, Honors)
  3. Work Experience & Internships (Roles, Responsibilities, Metrics, Tech stacks)
  4. Technical & Soft Skills (Proficiency levels, Categorization, Years of Experience)
  5. Certifications & Courses (Credential IDs, Verification URLs, Expiry dates)
  6. Featured Engineering Projects (Live URLs, GitHub repos, Key achievements)
  7. Achievements & Awards (Hackathon wins, Patents, Corporate recognitions)
  8. Research Papers & Publications (Journals, Conferences, DOIs, Citation links)
  9. Languages & Competencies (Proficiency levels)
* Full CRUD capabilities: Add, edit, delete, categorize, and validate every entry.
* **AI Unstructured Text Importer**: Paste any messy LinkedIn export, bio, or draft resume; Gemini parses it into structured records without manual entry.

### 2. Gemini API Integration & Anti-Hallucination Guardrails
* **Job Description Extraction**: Extracts must-have skills, preferred skills, soft skills, seniority level, core responsibilities, and ATS domain keywords.
* **Alignment & Match Scoring**: Computes an ATS fit percentage (0–100%), displays a visual match dial, lists matched skills vs missing skills, and explains why specific portfolio projects align best.
* **Strict Anti-Hallucination Guardrail**: The system cross-references every AI-tailored summary, bullet point, and recommended skill against the candidate's verified database records. **It never invents unverified certifications, companies, metrics, or technologies.**
* **Zero-Downtime Fallback**: If an API key is not yet provided, an intelligent local semantic NLP matcher automatically activates so the system remains 100% operational out of the box.

### 3. Google Sheets Integration
* **1-Click Cloud Export**: Pushes all 9 portfolio categories into separate formatted worksheets (`Personal_Info`, `Education`, `Experience`, `Skills`, `Projects`, `Certifications`, `Achievements`, `Publications`, `Languages`).
* **Automated Webhook Deployment**: Includes a production-ready Google Apps Script (`google-apps-script/Code.gs`) that creates frozen colored headers, auto-fits columns, and handles bi-directional data exchange.
* **Multi-Tab Excel Download**: Users without a Google Cloud account can instantly download an identical multi-tab `.xlsx` workbook ready to open or import into Google Drive.
* **Audit Logging**: SQLite stores complete synchronization logs (timestamps, targets, row counts, and status badges).

### 4. Dynamic Resume Customizer & Live Studio
* **Interactive Inclusion Checklists**: Toggle specific experiences, projects, skills, certifications, and publications to include or exclude.
* **3 ATS-Compliant Templates**:
  * **Modern Tech**: Crisp indigo/violet accents, 2-column skills grid, bold accomplishment metrics.
  * **Classic Executive**: Elegant Georgia serif typography, traditional single-column ATS structure.
  * **Minimalist Clean**: High-density typography, subtle borders, maximum information density.
* **Live Customizer Toolbar**: Customize accent colors (Indigo, Emerald, Violet, Ocean, Crimson, Slate) and edit summaries in real-time.
* **Dual Multi-Format Export**:
  * **DOCX (Microsoft Word)**: Server-side generation using `docx` with professional styles, bullet points, tab stops, and hyperlinks.
  * **PDF**: Print-ready vector PDF via browser engine with `@media print` styling and clean page margins.

---

## 🗄️ Database Schema

The system uses SQLite with Write-Ahead Logging (WAL) mode for high concurrency and zero setup overhead. The database is initialized automatically at `database/portfolio.db` from `database/schema.sql`:

| Table Name | Primary Fields | Purpose |
| :--- | :--- | :--- |
| `personal_info` | `id`, `full_name`, `title`, `email`, `phone`, `location`, `linkedin`, `github`, `portfolio_url`, `summary` | Candidate master contact and executive bio |
| `education` | `id`, `institution`, `degree`, `field_of_study`, `start_date`, `end_date`, `gpa`, `honors`, `coursework` | Academic credentials & relevant coursework |
| `experience` | `id`, `company`, `role`, `experience_type`, `location`, `start_date`, `end_date`, `bullet_points` (JSON), `technologies` (JSON) | Chronological employment & internship records |
| `skills` | `id`, `name`, `category`, `proficiency_level`, `years_of_experience`, `is_featured` | Categorized technical, tool, and soft competencies |
| `projects` | `id`, `title`, `role`, `start_date`, `end_date`, `url`, `github_url`, `description`, `bullet_points` (JSON), `technologies` (JSON) | Technical projects and open-source contributions |
| `certifications` | `id`, `name`, `issuing_organization`, `issue_date`, `expiration_date`, `credential_id`, `credential_url` | Professional accreditations and credentials |
| `achievements` | `id`, `title`, `category`, `issuer`, `date`, `description` | Hackathon wins, corporate awards, patents |
| `publications` | `id`, `title`, `venue`, `publication_date`, `authors`, `doi`, `url`, `description` | Peer-reviewed papers, conference proceedings |
| `languages` | `id`, `language`, `proficiency` | Spoken/written languages and fluency level |
| `job_descriptions` | `id`, `title`, `company`, `raw_text`, `extracted_data` (JSON) | Target JDs and parsed requirements |
| `resume_configurations` | `id`, `name`, `jd_id`, `target_role`, `template_name`, `accent_color`, `tailored_summary`, `selected_skills`, `custom_bullet_overrides` | Stored JD-specific resume parameter states |
| `sync_logs` | `id`, `sync_type`, `target_url`, `status`, `record_counts` (JSON), `synced_at` | Audit trail of Google Sheets exports & imports |
| `app_settings` | `key`, `value`, `updated_at` | Secure storage for API keys and webhook URLs |

---

## ⚡ Installation & Setup

### Prerequisites
* **Node.js** v18+ (tested on v26)
* **npm** v9+

### Steps
1. Navigate to the project root directory:
   ```bash
   cd /Users/pnair/.gemini/antigravity-ide/scratch/portfolio-gemini-system
   ```

2. Dependencies are already installed (`package.json`), but if running on a fresh environment:
   ```bash
   npm install
   ```

3. (Optional) Configure environment variables:
   Copy `.env.example` to `.env` or configure via the in-app Settings modal:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
   ```

4. Start the application:
   ```bash
   node server.js
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🤖 Gemini API Integration & Anti-Hallucination Guardrails

The application utilizes Google's official Gemini REST endpoints (`gemini-2.5-flash` / `gemini-1.5-flash`) via structured JSON schema modes.

### Anti-Hallucination Architecture
* **Original Ground Truth**: Every portfolio entity has an immutable database record.
* **Low Temperature Constraint**: Gemini runs at `temperature: 0.2` to prioritize factual precision and consistency.
* **Verification Pipeline**:
  1. The candidate's verified portfolio items (companies, degrees, projects, skills) are passed into the prompt context.
  2. The system prompt instructs Gemini: *"NEVER invent any companies, job titles, dates, metrics, degrees, or tools. Every tailored bullet point MUST be derived directly from verified data."*
  3. Tailored output is strictly validated to ensure no foreign entities are introduced.

### API Key Management
* You can supply your Gemini API key via:
  1. Setting `GEMINI_API_KEY` in `.env`
  2. Clicking the **Settings** gear icon in the UI header and entering your key (saved locally in SQLite `app_settings`)
* **Note**: If no key is set, the system seamlessly runs its built-in heuristic semantic matcher, allowing complete evaluation with zero setup.

---

## 📊 Google Sheets Integration Guide

The system supports two methods for Google Sheets integration:

### Method A: Live 2-Way Sync via Google Apps Script (Recommended)
1. Open a blank Google Sheet at [sheets.new](https://sheets.new).
2. Go to **Extensions > Apps Script**.
3. Replace any code in `Code.gs` with the contents of [`google-apps-script/Code.gs`](file:///Users/pnair/.gemini/antigravity-ide/scratch/portfolio-gemini-system/google-apps-script/Code.gs).
4. Click **Deploy > New deployment**:
   * Select type: **Web app**
   * Description: `Portfolio Sync`
   * Execute as: `Me`
   * Who has access: `Anyone`
5. Click **Deploy**, authorize permissions, and copy the **Web app URL**.
6. In PortfolioPulse AI, go to the **Google Sheets Sync** tab, paste the URL, and click **Save Webhook URL**.
7. Click **Export to Google Sheets Now**. All 9 tabs will instantly populate with styled header rows and data!

### Method B: Direct Multi-Tab Spreadsheet Download
* Click **Download Multi-Tab XLSX Workbook** in the **Google Sheets Sync** tab.
* The system instantly compiles all 9 tables into `Portfolio_Database_Alex_Vance_Morgan.xlsx`, which can be dragged directly into Google Drive or Excel.

---

## 🔬 Benchmark Test Cases & Dual Resume Customization

To demonstrate how the **exact same user portfolio** dynamically produces **two distinctly tailored resumes**, the system includes two pre-loaded benchmark Job Descriptions:

| Feature / Metric | Benchmark Test Case 1: Senior Full-Stack & AI Systems Engineer | Benchmark Test Case 2: Senior Machine Learning & NLP Data Scientist |
| :--- | :--- | :--- |
| **Target Company & Role** | ScaleSphere Cloud Technologies — *Senior Full-Stack & AI Systems Engineer* | Synthetica AI Research Labs — *Senior ML & NLP Data Scientist* |
| **Core Domain Focus** | Enterprise SaaS, React dashboards, Node.js/Python microservices, production RAG pipelines, AWS EKS | Transformer quantization, PyTorch, LoRA fine-tuning, research papers, vector embeddings |
| **Match Score** | **90% - 94% (Exceptional Match)** | **88% - 92% (Exceptional Match)** |
| **Tailored Summary** | *"Versatile Senior Full-Stack & AI Systems Engineer with 6+ years of experience architecting high-scale distributed systems, enterprise generative AI copilots, and resilient cloud services. Expert in React, TypeScript, Node.js, and multi-tenant RAG pipelines..."* | *"Accomplished Senior Machine Learning & NLP Data Scientist specializing in deep neural retrieval, transformer token quantization, and multimodal knowledge representation. Proven academic and industry track record in PyTorch, NeurIPS research..."* |
| **Featured Projects Selected** | 1. **OmniAgent: Autonomous Workflow Copilot** (React, TypeScript, Node.js, Gemini API)<br>2. **Veritas: Enterprise Multimodal Document Intelligence** | 1. **Berkeley ML Research Lab: 4-bit INT Quantization** (PyTorch, Transformers, CUDA)<br>2. **OmniAgent Multi-Agent Planner** |
| **Featured Accreditations** | AWS Certified Solutions Architect – Professional | Google Cloud Professional Data Engineer + DeepLearning.AI GenAI |
| **Featured Publications** | *Design Patterns for Production-Grade Multi-Agent Copilots in Enterprise SaaS* (IEEE) | *Accelerating Multi-Modal Document Retrieval via Hierarchical Late-Interaction Encoders* (NeurIPS) |
| **Output File (.DOCX)** | [`samples/resume_fullstack_ai_engineer.docx`](file:///Users/pnair/.gemini/antigravity-ide/scratch/portfolio-gemini-system/samples/resume_fullstack_ai_engineer.docx) | [`samples/resume_ml_data_scientist.docx`](file:///Users/pnair/.gemini/antigravity-ide/scratch/portfolio-gemini-system/samples/resume_ml_data_scientist.docx) |

---

## 📦 Deliverables & Sample Files

All required deliverables have been generated and committed inside the project folder:

```
portfolio-gemini-system/
├── README.md                                # Comprehensive documentation & architecture guide
├── server.js                                # Express backend bootstrap (PORT 3000)
├── package.json                             # Dependencies & scripts
├── database/
│   ├── schema.sql                           # 13 relational tables schema
│   ├── seedData.js                          # Sample portfolio data across all 9 categories
│   ├── db.js                                # SQLite manager & initialization
│   └── portfolio.db                         # Active SQLite database file
├── services/
│   ├── geminiService.js                     # Gemini 2.5 Flash API + Anti-Hallucination Guardrails
│   ├── googleSheetsService.js               # Webhook dispatcher & multi-tab XLSX generator
│   ├── docxService.js                       # Server-side Microsoft Word DOCX generator
│   └── resumeService.js                     # Resume compilation & sample JDs
├── routes/
│   ├── portfolioRoutes.js                   # Full CRUD endpoints for all 9 sections
│   ├── aiRoutes.js                          # AI JD analysis, matching, and tailoring
│   ├── sheetsRoutes.js                      # Google Sheets sync & export endpoints
│   └── exportRoutes.js                      # DOCX, JSON, and config export endpoints
├── public/
│   ├── index.html                           # Modern single-page web application
│   ├── css/
│   │   └── style.css                        # Glassmorphism design system & print styles
│   ├── js/
│   │   ├── app.js                           # Coordinator, theme toggle, toast notifications
│   │   ├── portfolioUI.js                   # Portfolio CRUD & modal forms
│   │   ├── jdMatcherUI.js                   # JD analyzer, score gauge & checklists
│   │   ├── resumeStudioUI.js                # Live resume preview, templates & export
│   │   └── sheetsUI.js                      # Google Sheets sync hub & logs
│   └── assets/                              # UI workflow demonstration screenshots
├── google-apps-script/
│   └── Code.gs                              # Ready-to-deploy Google Apps Script
└── samples/
    ├── jd_fullstack_ai_engineer.txt         # Benchmark Job Description 1
    ├── jd_ml_data_scientist.txt             # Benchmark Job Description 2
    ├── resume_fullstack_ai_engineer.docx    # Pre-generated customized DOCX for JD 1
    ├── resume_ml_data_scientist.docx        # Pre-generated customized DOCX for JD 2
    └── sample_exported_portfolio.xlsx       # Pre-exported 9-tab spreadsheet workbook
```
