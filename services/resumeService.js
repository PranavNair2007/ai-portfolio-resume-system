const { getPortfolio } = require('../database/db');
const { generateDocxResume } = require('./docxService');

const SAMPLE_JOB_DESCRIPTIONS = [
    {
        id: 'fullstack_ai',
        title: 'Senior Full-Stack & AI Systems Engineer',
        company: 'ScaleSphere Cloud Technologies',
        seniority: 'Senior',
        summary: 'We are seeking a Senior Full-Stack & AI Systems Engineer to lead the design and deployment of our next-generation enterprise copilot platform. You will build high-performance React frontends, scalable Node.js/Python microservices, and production RAG pipelines integrated with modern LLMs.',
        raw_text: `Job Title: Senior Full-Stack & AI Systems Engineer
Company: ScaleSphere Cloud Technologies
Location: San Francisco, CA / Remote

About the Role:
ScaleSphere is hiring a Senior Full-Stack & AI Engineer to pioneer generative AI features across our enterprise SaaS analytics suite. You will bridge frontend engineering with deep learning infrastructure, building high-throughput services that handle millions of interactions daily.

Key Responsibilities:
- Architect and ship responsive, accessible web dashboards using React, TypeScript, and modern CSS.
- Build high-concurrency backend services and REST/GraphQL APIs with Node.js, Express, and Python.
- Design, deploy, and monitor production RAG (Retrieval-Augmented Generation) workflows using Gemini models, vector databases, and semantic search.
- Collaborate with cloud infrastructure teams to deploy containerized microservices on AWS/GCP with Docker and CI/CD pipelines.
- Ensure strict latency budgets, automated testing, and low-latency response times for real-time streaming interfaces.

Requirements:
- 5+ years of software engineering experience across frontend and backend.
- Strong proficiency in TypeScript, React, Node.js, and Python.
- Proven experience deploying production LLM solutions (RAG, vector embeddings, prompt engineering).
- Experience with relational databases (PostgreSQL/SQLite) and distributed caching (Redis).
- Hands-on experience with Docker, cloud infrastructure (AWS or GCP), and CI/CD automation.
- Excellent communication and ability to mentor junior engineers.`
    },
    {
        id: 'ml_nlp_scientist',
        title: 'Senior Machine Learning & NLP Data Scientist',
        company: 'Synthetica AI Research Labs',
        seniority: 'Senior / Staff',
        summary: 'Synthetica is looking for a Senior ML & NLP Data Scientist to conduct research and productionize advanced transformer quantization, token compression, and multi-modal representation models for large-scale enterprise knowledge graphs.',
        raw_text: `Job Title: Senior Machine Learning & NLP Data Scientist
Company: Synthetica AI Research Labs
Location: Sunnyvale, CA / Remote

About the Role:
Join our Applied AI Research group to drive breakthroughs in efficient transformer architectures, neural retrieval, and large-scale multimodal document intelligence. You will transition cutting-edge research concepts into optimized, scalable machine learning systems.

Key Responsibilities:
- Design, fine-tune, and evaluate state-of-the-art transformer and LLM architectures using PyTorch and Hugging Face.
- Research and implement efficient model optimization techniques including quantization (INT4/INT8), LoRA fine-tuning, and context compression.
- Develop dense retrieval and multimodal embedding models for semantic document parsing and knowledge extraction.
- Conduct rigorous experimentation, benchmark against industry baselines, and contribute to research publications.
- Collaborate with engineering leads to package and deploy ML models into high-throughput inference endpoints.

Requirements:
- Master's or Ph.D. in Computer Science, Machine Learning, Applied Mathematics, or related field.
- 4+ years of hands-on experience in Deep Learning and Natural Language Processing.
- Expert-level command of PyTorch, Python, Hugging Face Transformers, and CUDA optimization.
- Documented record of research publications (NeurIPS, ICML, ACL, IEEE, or similar) or major open-source ML contributions.
- Deep theoretical understanding of attention mechanisms, vector search, and model evaluation metrics.`
    }
];

/**
 * Filter and assemble complete resume payload according to user selections
 */
function assembleResume(portfolio, options = {}) {
    const {
        tailored_summary = null,
        selected_skill_ids = null,
        selected_experience_ids = null,
        selected_project_ids = null,
        selected_education_ids = null,
        selected_certification_ids = null,
        selected_publication_ids = null,
        bullet_overrides = {},
        template_name = 'modern',
        accent_color = '#4f46e5'
    } = options;

    const resume = {
        personal_info: portfolio.personal_info,
        tailored_summary: tailored_summary || portfolio.personal_info.summary,
        template_name,
        accent_color,
        selected_skills: [],
        selected_experience: [],
        selected_projects: [],
        selected_education: [],
        selected_certifications: [],
        selected_publications: []
    };

    // Filter Skills
    if (selected_skill_ids && Array.isArray(selected_skill_ids)) {
        resume.selected_skills = portfolio.skills.filter(s => selected_skill_ids.includes(s.id) || selected_skill_ids.includes(s.name));
    } else {
        resume.selected_skills = portfolio.skills.filter(s => s.is_featured);
    }

    // Filter Experience & apply tailored bullet overrides if any
    if (selected_experience_ids && Array.isArray(selected_experience_ids)) {
        resume.selected_experience = portfolio.experience
            .filter(e => selected_experience_ids.includes(e.id))
            .map(e => ({
                ...e,
                bullet_points: bullet_overrides[`exp_${e.id}`] || e.bullet_points
            }));
    } else {
        resume.selected_experience = portfolio.experience.map(e => ({
            ...e,
            bullet_points: bullet_overrides[`exp_${e.id}`] || e.bullet_points
        }));
    }

    // Filter Projects
    if (selected_project_ids && Array.isArray(selected_project_ids)) {
        resume.selected_projects = portfolio.projects
            .filter(p => selected_project_ids.includes(p.id))
            .map(p => ({
                ...p,
                bullet_points: bullet_overrides[`proj_${p.id}`] || p.bullet_points
            }));
    } else {
        resume.selected_projects = portfolio.projects.map(p => ({
            ...p,
            bullet_points: bullet_overrides[`proj_${p.id}`] || p.bullet_points
        }));
    }

    // Filter Education
    if (selected_education_ids && Array.isArray(selected_education_ids)) {
        resume.selected_education = portfolio.education.filter(e => selected_education_ids.includes(e.id));
    } else {
        resume.selected_education = portfolio.education;
    }

    // Filter Certifications
    if (selected_certification_ids && Array.isArray(selected_certification_ids)) {
        resume.selected_certifications = portfolio.certifications.filter(c => selected_certification_ids.includes(c.id));
    } else {
        resume.selected_certifications = portfolio.certifications;
    }

    // Filter Publications
    if (selected_publication_ids && Array.isArray(selected_publication_ids)) {
        resume.selected_publications = portfolio.publications.filter(pub => selected_publication_ids.includes(pub.id));
    } else {
        resume.selected_publications = portfolio.publications;
    }

    return resume;
}

module.exports = {
    SAMPLE_JOB_DESCRIPTIONS,
    assembleResume
};
