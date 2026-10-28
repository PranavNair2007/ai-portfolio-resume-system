// Comprehensive sample portfolio data for demonstrations
module.exports = {
    personal_info: {
        full_name: "Alex Vance Morgan",
        title: "Senior Full-Stack & AI Systems Engineer",
        email: "alex.morgan.portfolio@example.com",
        phone: "+1 (555) 382-9104",
        location: "San Francisco, CA (Open to Remote)",
        linkedin: "https://linkedin.com/in/alex-morgan-ai",
        github: "https://github.com/alexmorgan-ai",
        portfolio_url: "https://alexmorgan.dev",
        summary: "Versatile Senior Engineer with 6+ years of experience architecting high-scale distributed systems, enterprise full-stack applications, and production generative AI solutions. Proven record of deploying RAG architectures, multi-agent frameworks, and resilient cloud services serving millions of requests daily."
    },

    education: [
        {
            institution: "Stanford University",
            degree: "Master of Science (M.S.)",
            field_of_study: "Computer Science (AI & Distributed Systems Track)",
            start_date: "2018",
            end_date: "2020",
            gpa: "3.92 / 4.0",
            honors: "Graduate Research Fellowship, Dean's Honors",
            coursework: JSON.stringify(["Distributed Systems", "Deep Generative Models", "Advanced Database Systems", "Natural Language Processing", "Cloud Computing Architectures"]),
            location: "Stanford, CA",
            sort_order: 1
        },
        {
            institution: "University of California, Berkeley",
            degree: "Bachelor of Science (B.S.)",
            field_of_study: "Computer Science & Applied Mathematics",
            start_date: "2014",
            end_date: "2018",
            gpa: "3.88 / 4.0",
            honors: "Summa Cum Laude, Tau Beta Pi Engineering Honor Society",
            coursework: JSON.stringify(["Data Structures & Algorithms", "Operating Systems", "Machine Learning", "Computer Architecture", "Linear Algebra"]),
            location: "Berkeley, CA",
            sort_order: 2
        }
    ],

    experience: [
        {
            company: "Nexus AI Technologies",
            role: "Senior AI & Full-Stack Solutions Lead",
            experience_type: "Full-time",
            location: "San Francisco, CA",
            start_date: "2022-03",
            end_date: "Present",
            is_current: 1,
            description: "Directing the core AI platform team building enterprise generative AI copilots and high-throughput real-time APIs.",
            bullet_points: JSON.stringify([
                "Architected and deployed a multi-tenant Agentic RAG workflow using Gemini 1.5/2.0 and LangGraph, reducing query latency by 42% and processing 4.5M+ document chunks monthly.",
                "Spearheaded full-stack dashboard modernization using React, TypeScript, Node.js, and WebSocket streaming, improving active user retention by 28%.",
                "Constructed high-throughput hybrid semantic search combining Qdrant vector database and Elasticsearch BM25, boosting retrieval precision by 35%.",
                "Instituted automated LLM evaluation and guardrail pipelines with CI/CD regression suites, mitigating hallucination rates below 0.8% across production prompts."
            ]),
            technologies: JSON.stringify(["Python", "TypeScript", "React", "Node.js", "Gemini API", "FastAPI", "PostgreSQL", "Docker", "Qdrant", "AWS"]),
            sort_order: 1
        },
        {
            company: "CloudScale Software Inc.",
            role: "Full-Stack Software Engineer II",
            experience_type: "Full-time",
            location: "San Jose, CA",
            start_date: "2020-07",
            end_date: "2022-02",
            is_current: 0,
            description: "Engineered scalable cloud microservices, REST/GraphQL APIs, and customer-facing web applications.",
            bullet_points: JSON.stringify([
                "Engineered scalable microservices in Node.js and Go handling 12,000+ RPS with 99.98% uptime on AWS EKS Kubernetes clusters.",
                "Designed responsive frontend analytics dashboards in React with virtualized data grids rendering 100K+ concurrent telemetry records with zero lag.",
                "Optimized relational PostgreSQL query bottlenecks and Redis caching layers, cutting 95th-percentile API response time from 420ms to 65ms.",
                "Mentored 4 junior engineers on clean architecture, unit testing with Jest/PyTest, and automated GitOps deployment patterns."
            ]),
            technologies: JSON.stringify(["JavaScript", "TypeScript", "React", "Node.js", "Express", "Go", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS"]),
            sort_order: 2
        },
        {
            company: "Berkeley Machine Learning Research Lab",
            role: "Graduate Research Assistant & ML Engineer",
            experience_type: "Internship",
            location: "Berkeley, CA",
            start_date: "2019-06",
            end_date: "2020-05",
            is_current: 0,
            description: "Researched efficient neural network quantization and transformer token compression under academic grant.",
            bullet_points: JSON.stringify([
                "Developed novel 4-bit INT quantization techniques for Transformer models in PyTorch, reducing GPU VRAM memory footprint by 55% while maintaining 98.6% BLEU accuracy.",
                "Co-authored research paper accepted at NeurIPS Workshop on Efficient Deep Learning.",
                "Built automated data ingestion pipelines processing 2TB+ multi-modal datasets using Apache Spark and Ray."
            ]),
            technologies: JSON.stringify(["Python", "PyTorch", "Hugging Face", "CUDA", "Ray", "Apache Spark", "Linux"]),
            sort_order: 3
        }
    ],

    skills: [
        // Programming Languages
        { name: "Python", category: "Programming Languages", proficiency_level: "Expert", years_of_experience: 6, is_featured: 1, sort_order: 1 },
        { name: "TypeScript / JavaScript", category: "Programming Languages", proficiency_level: "Expert", years_of_experience: 6, is_featured: 1, sort_order: 2 },
        { name: "SQL (PostgreSQL / SQLite)", category: "Programming Languages", proficiency_level: "Expert", years_of_experience: 5, is_featured: 1, sort_order: 3 },
        { name: "Go (Golang)", category: "Programming Languages", proficiency_level: "Intermediate", years_of_experience: 2, is_featured: 0, sort_order: 4 },
        { name: "C++", category: "Programming Languages", proficiency_level: "Intermediate", years_of_experience: 3, is_featured: 0, sort_order: 5 },

        // AI & Machine Learning
        { name: "Google Gemini API & GenAI SDK", category: "AI & Machine Learning", proficiency_level: "Expert", years_of_experience: 3, is_featured: 1, sort_order: 6 },
        { name: "PyTorch & Deep Learning", category: "AI & Machine Learning", proficiency_level: "Advanced", years_of_experience: 4, is_featured: 1, sort_order: 7 },
        { name: "RAG & Vector Embeddings", category: "AI & Machine Learning", proficiency_level: "Expert", years_of_experience: 3, is_featured: 1, sort_order: 8 },
        { name: "LangChain / LangGraph", category: "AI & Machine Learning", proficiency_level: "Advanced", years_of_experience: 2, is_featured: 1, sort_order: 9 },
        { name: "Hugging Face Transformers", category: "AI & Machine Learning", proficiency_level: "Advanced", years_of_experience: 3, is_featured: 1, sort_order: 10 },
        { name: "Prompt Engineering & Guardrails", category: "AI & Machine Learning", proficiency_level: "Expert", years_of_experience: 3, is_featured: 1, sort_order: 11 },

        // Frameworks & Libraries
        { name: "React.js & Next.js", category: "Frameworks & Libraries", proficiency_level: "Expert", years_of_experience: 5, is_featured: 1, sort_order: 12 },
        { name: "Node.js & Express", category: "Frameworks & Libraries", proficiency_level: "Expert", years_of_experience: 6, is_featured: 1, sort_order: 13 },
        { name: "FastAPI & Flask", category: "Frameworks & Libraries", proficiency_level: "Expert", years_of_experience: 4, is_featured: 1, sort_order: 14 },
        { name: "HTML5 / Modern Vanilla CSS", category: "Frameworks & Libraries", proficiency_level: "Expert", years_of_experience: 6, is_featured: 1, sort_order: 15 },
        { name: "Tailwind CSS", category: "Frameworks & Libraries", proficiency_level: "Advanced", years_of_experience: 3, is_featured: 0, sort_order: 16 },

        // Cloud & DevOps
        { name: "Docker & Containerization", category: "Cloud & DevOps", proficiency_level: "Expert", years_of_experience: 5, is_featured: 1, sort_order: 17 },
        { name: "Amazon Web Services (AWS)", category: "Cloud & DevOps", proficiency_level: "Advanced", years_of_experience: 4, is_featured: 1, sort_order: 18 },
        { name: "Google Cloud Platform (GCP)", category: "Cloud & DevOps", proficiency_level: "Advanced", years_of_experience: 3, is_featured: 1, sort_order: 19 },
        { name: "Kubernetes (K8s)", category: "Cloud & DevOps", proficiency_level: "Intermediate", years_of_experience: 3, is_featured: 0, sort_order: 20 },
        { name: "CI/CD (GitHub Actions)", category: "Cloud & DevOps", proficiency_level: "Advanced", years_of_experience: 5, is_featured: 1, sort_order: 21 },

        // Databases & Storage
        { name: "PostgreSQL & Prisma/TypeORM", category: "Databases & Storage", proficiency_level: "Expert", years_of_experience: 5, is_featured: 1, sort_order: 22 },
        { name: "Qdrant / Pinecone Vector DB", category: "Databases & Storage", proficiency_level: "Advanced", years_of_experience: 2, is_featured: 1, sort_order: 23 },
        { name: "Redis & In-Memory Caching", category: "Databases & Storage", proficiency_level: "Advanced", years_of_experience: 4, is_featured: 1, sort_order: 24 },
        { name: "SQLite", category: "Databases & Storage", proficiency_level: "Expert", years_of_experience: 6, is_featured: 1, sort_order: 25 },

        // Soft Skills
        { name: "System Architecture & Design", category: "Soft Skills", proficiency_level: "Expert", years_of_experience: 5, is_featured: 1, sort_order: 26 },
        { name: "Cross-Functional Technical Leadership", category: "Soft Skills", proficiency_level: "Advanced", years_of_experience: 4, is_featured: 1, sort_order: 27 },
        { name: "Agile & Sprint Planning", category: "Soft Skills", proficiency_level: "Advanced", years_of_experience: 5, is_featured: 0, sort_order: 28 },
        { name: "Technical Writing & Documentation", category: "Soft Skills", proficiency_level: "Expert", years_of_experience: 6, is_featured: 1, sort_order: 29 }
    ],

    projects: [
        {
            title: "OmniAgent: Autonomous Workflow Copilot",
            role: "Lead Architect & Developer",
            start_date: "2023-08",
            end_date: "2024-02",
            url: "https://omniagent.demo.io",
            github_url: "https://github.com/alexmorgan-ai/omni-agent",
            description: "An open-source multi-agent automation orchestration framework leveraging Gemini models to synthesize complex database operations, code modifications, and external tool calls.",
            bullet_points: JSON.stringify([
                "Built an interactive task execution planner using Gemini 1.5 Pro function calling with self-correcting error recovery loops.",
                "Engineered a glassmorphism web dashboard in React & WebSockets providing real-time streaming traces of agent thought reasoning and tool calls.",
                "Grew open-source community to 2,400+ GitHub stars with 120,000+ Docker pulls worldwide."
            ]),
            technologies: JSON.stringify(["TypeScript", "React", "Node.js", "Gemini API", "FastAPI", "Docker", "PostgreSQL"]),
            featured: 1,
            sort_order: 1
        },
        {
            title: "Veritas: Enterprise Multimodal Document Intelligence",
            role: "Full-Stack AI Engineer",
            start_date: "2023-01",
            end_date: "2023-07",
            url: "https://veritas-docs.example.com",
            github_url: "https://github.com/alexmorgan-ai/veritas-docs",
            description: "High-accuracy PDF parsing and semantic search platform designed for legal and financial institutions handling compliance documents.",
            bullet_points: JSON.stringify([
                "Developed OCR and multimodal vision pipeline utilizing Gemini Vision for structured table extraction with 99.1% parsing fidelity.",
                "Implemented hybrid semantic retrieval engine over 1.2M dense vectors with sub-80ms p95 search latency.",
                "Built secure role-based access control (RBAC) and audit trails complying with SOC2 standards."
            ]),
            technologies: JSON.stringify(["Python", "React", "FastAPI", "Qdrant", "PostgreSQL", "Docker", "AWS S3"]),
            featured: 1,
            sort_order: 2
        },
        {
            title: "PulseFlow: Real-Time Distributed Telemetry Dashboard",
            role: "Backend & Systems Engineer",
            start_date: "2021-04",
            end_date: "2021-11",
            url: "https://pulseflow.dev",
            github_url: "https://github.com/alexmorgan-ai/pulseflow",
            description: "Distributed metric collection service and visual dashboard tracking system health and anomaly detection.",
            bullet_points: JSON.stringify([
                "Implemented asynchronous stream processing consuming 50,000 events/sec with Apache Kafka and Go worker pools.",
                "Designed zero-dependency interactive SVG visualization charting engine in vanilla JavaScript and CSS.",
                "Decreased server memory overhead by 40% compared to legacy monitoring agents."
            ]),
            technologies: JSON.stringify(["Go", "JavaScript", "Kafka", "Redis", "TimescaleDB", "Docker"]),
            featured: 0,
            sort_order: 3
        }
    ],

    certifications: [
        {
            name: "AWS Certified Solutions Architect – Professional",
            issuing_organization: "Amazon Web Services",
            issue_date: "2023-04",
            expiration_date: "2026-04",
            credential_id: "AWS-PSA-948201",
            credential_url: "https://aws.amazon.com/verification/AWS-PSA-948201",
            skills_covered: JSON.stringify(["Cloud Architecture", "AWS EKS", "Security & IAM", "High Availability Systems"]),
            sort_order: 1
        },
        {
            name: "Generative AI with Large Language Models Professional",
            issuing_organization: "DeepLearning.AI & AWS",
            issue_date: "2023-09",
            expiration_date: "No Expiration",
            credential_id: "DLAI-GENAI-88319",
            credential_url: "https://coursera.org/verify/DLAI-GENAI-88319",
            skills_covered: JSON.stringify(["LLM Fine-Tuning", "RLHF", "PEFT/LoRA", "RAG Systems", "Evaluation Metrics"]),
            sort_order: 2
        },
        {
            name: "Google Cloud Professional Data Engineer",
            issuing_organization: "Google Cloud",
            issue_date: "2022-11",
            expiration_date: "2024-11",
            credential_id: "GCP-PDE-440219",
            credential_url: "https://google.accredible.com/GCP-PDE-440219",
            skills_covered: JSON.stringify(["BigQuery", "Dataflow", "Machine Learning Pipelines", "Pub/Sub"]),
            sort_order: 3
        }
    ],

    achievements: [
        {
            title: "1st Place Winner – National AI Agents Hackathon",
            category: "Hackathon",
            issuer: "Google Cloud & Devpost",
            date: "2023-11",
            description: "Built the top-ranking autonomous multi-modal agent for automated codebase refactoring competing against 450+ engineering teams.",
            sort_order: 1
        },
        {
            title: "Outstanding Engineering Innovation Award",
            category: "Award",
            issuer: "Nexus AI Technologies",
            date: "2023-12",
            description: "Recognized for architecting the company's flagship high-throughput RAG pipeline that saved over $180,000 in monthly inference costs.",
            sort_order: 2
        },
        {
            title: "Patent Pending: Adaptive Context Window Compression for LLM Inference",
            category: "Patent",
            issuer: "US Patent & Trademark Office (USPTO)",
            date: "2024-03",
            description: "Invented novel algorithm dynamically compressing conversational memory tokens without semantic degradation.",
            sort_order: 3
        }
    ],

    publications: [
        {
            title: "Accelerating Multi-Modal Document Retrieval via Hierarchical Late-Interaction Encoders",
            venue: "NeurIPS Workshop on Efficient Machine Learning & Agents",
            publication_date: "2023-12",
            authors: "Alex V. Morgan, Dr. Elena Rostova, Marcus Chen",
            url: "https://arxiv.org/abs/2312.09918",
            doi: "10.48550/arXiv.2312.09918",
            description: "Proposed token-pruned ColBERT-style embeddings that achieve 3.4x faster inference speed on multi-page financial filings.",
            sort_order: 1
        },
        {
            title: "Design Patterns for Production-Grade Multi-Agent Copilots in Enterprise SaaS",
            venue: "IEEE Software Engineering Practice Conference",
            publication_date: "2022-09",
            authors: "Alex V. Morgan, David H. Miller",
            url: "https://ieee-xplore.org/document/891274",
            doi: "10.1109/SEPC.2022.891274",
            description: "Explored state machine workflows, deterministic rollback strategies, and human-in-the-loop validation for enterprise AI tooling.",
            sort_order: 2
        }
    ],

    languages: [
        { language: "English", proficiency: "Native", sort_order: 1 },
        { language: "Spanish", proficiency: "Fluent", sort_order: 2 },
        { language: "German", proficiency: "Conversational", sort_order: 3 }
    ]
};
