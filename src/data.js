// All site content lives here. Edit this file to update the portfolio.

// Real screenshots of each project (800x500 WebP), bundled by Vite so they never 404
import imgTalentlens from './assets/projects/talentlens.webp';
import imgSitechat from './assets/projects/sitechat.webp';
import imgLegal from './assets/projects/legal.webp';
import imgScholarai from './assets/projects/scholarai.webp';
import imgBluebook from './assets/projects/bluebook.webp';
import imgStratum from './assets/projects/stratum.webp';
import imgEdvenity from './assets/projects/edvenity.webp';
import imgVisionx from './assets/projects/visionx.webp';
import imgSooqsense from './assets/projects/sooqsense.webp';


export const PROFILE = {
  name: 'Rabeea',
  role: 'Full Stack Developer & AI/ML Engineer',
  tagline: 'Building products that ship.',
  intro:
    'Web, mobile, and intelligent systems for startups that need speed without sacrificing craft.',
  email: 'dev.rabeea@gmail.com',
  phone: '+92 304-8111212',
  address: 'Office 276B, Phase 4 DHA, Lahore',
  linkedin: 'https://www.linkedin.com/in/rabeea-r26/',
  github: 'https://github.com/DevNebula300',
};

export const bookDemoUrl = () =>
  `https://calendar.google.com/calendar/u/0/r/eventedit?add=${encodeURIComponent(
    PROFILE.email
  )}&text=${encodeURIComponent('Demo Meeting with ' + PROFILE.name)}`;

export const ABOUT = [
  `I'm ${PROFILE.name}, a Full-Stack & AI Engineer helping startups go from concept to working AI products in weeks, not months.`,
  'With over 7 years of hands-on experience, I specialize in building modern websites, mobile apps, SaaS platforms, and AI-driven MVPs that accelerate business growth. I design and develop AI agents, LLM-powered chatbots, and automation workflows that bring intelligence and efficiency to digital products.',
  'From crafting scalable SaaS systems to delivering interactive dashboards and custom AI integrations, I help founders turn ideas into revenue-generating realities. My work has empowered teams across the US, UK, and beyond, saving them hours of manual effort and unlocking new levels of productivity.',
  "I'm passionate about building meaningful tech that solves real-world problems and creates lasting impact. When I'm not coding, I'm exploring new innovations, learning emerging AI trends, and finding creative inspiration through travel.",
];

export const SKILLS = [
  { label: 'Full Stack', value: 95 },
  { label: 'AI/ML', value: 95 },
  { label: 'MERN', value: 90 },
];

export const STATS = [
  { value: 71, suffix: '', label: 'Projects shipped' },
  { value: 7, suffix: '+', label: 'Years experience' },
  { value: 92, suffix: '', label: 'Happy clients' },
];

export const MARQUEE = [
  'React', 'Node.js', 'TypeScript', 'AI Agents', 'React Native', 'LLMs',
  'PostgreSQL', 'Automation', 'Next.js', 'Python',
];

// Shown on the 3D tech sphere in the About section
export const TECH_CLOUD = [
  'React', 'Next.js', 'Node.js', 'TypeScript', 'Python', 'FastAPI', 'LangChain',
  'LangGraph', 'RAG', 'OpenAI', 'Gemini', 'PostgreSQL', 'pgvector', 'Qdrant',
  'Chroma', 'MongoDB', 'Express', 'React Native', 'Docker', 'Tailwind',
  'spaCy', 'Transformers', 'GSAP', 'Vercel', 'Railway', 'AI Agents', 'LLMs',
  'Automation',
];

export const SERVICES = [
  {
    title: 'Web development',
    icon: 'web',
    body: 'Building responsive, modern websites and web applications using cutting-edge technologies like React, Node.js, and cloud platforms for optimal performance and user experience.',
  },
  {
    title: 'AI/ML Engineer',
    icon: 'brain',
    body: 'Developing intelligent solutions and machine learning models to automate processes, analyze data, and create AI-powered applications that drive business innovation and efficiency.',
  },
  {
    title: 'Mobile Apps',
    icon: 'mobile',
    body: 'Creating cross-platform mobile applications with React Native and Flutter, delivering native performance and seamless user experiences across iOS and Android devices.',
  },
  {
    title: 'AI Chatbots & Agents',
    icon: 'chat',
    body: 'Building intelligent conversational AI agents and chatbots powered by LLMs that understand context, provide personalized responses, and automate customer interactions to enhance user engagement and operational efficiency.',
  },
  {
    title: 'AI Automation',
    icon: 'bolt',
    body: 'Creating intelligent automation workflows and AI-powered systems that streamline business processes, reduce manual work, and enable smart decision-making through machine learning and natural language processing.',
  },
  {
    title: 'iOS & Android Apps',
    icon: 'devices',
    body: 'Building native iOS and Android applications with platform-specific optimizations, ensuring high performance, security, and adherence to platform guidelines and best practices.',
  },
];

// kind: 'ai' = shipped AI product, 'platform' = client platform, 'oss' = open source on GitHub
export const PROJECTS = [
  {
    id: 'talentlens',
    image: imgTalentlens,
    host: 'talent-lens-ai-weld.vercel.app',
    title: 'TalentLens AI',
    kind: 'ai',
    hue: [205, 330],
    summary:
      'An AI-powered resume to job matching system with explainable compatibility scoring: strengths, gaps, and recommendations for every match.',
    detail:
      'Takes a candidate resume and a job description, extracts skills and experience with an NLP pipeline, and produces an explainable compatibility score. Scoring is multi-factor rather than a single opaque number, weights shift with the role, and skill matches are graded by similarity.',
    features: [
      'PDF resume parsing and text normalization for clean NLP input',
      'Skill, title, education, and experience extraction, including date ranges and seniority signals',
      'Four-pillar matching: semantic understanding, hard skills, experience level, and keyword alignment',
      'Dynamic scoring weights that adapt to JD complexity',
      'Skill similarity classification (exact / equivalent / related) beyond keyword overlap',
      'Analysis history with stored results and resume re-analysis',
    ],
    stack: ['FastAPI', 'spaCy', 'Sentence Transformers', 'PostgreSQL + pgvector', 'PyMuPDF', 'Next.js', 'TypeScript', 'Tailwind v4', 'Docker', 'Railway', 'Vercel'],
    links: [{ label: 'Live demo', url: 'https://talent-lens-ai-weld.vercel.app' }],
  },
  {
    id: 'sitechat',
    image: imgSitechat,
    host: 'website-rag-chat-bott.vercel.app',
    title: 'Website RAG Chatbot',
    kind: 'ai',
    hue: [190, 260],
    summary:
      'A "chat with any website" system that crawls, indexes, and answers with citation-backed responses drawn only from the source material.',
    detail:
      'An agentic RAG pipeline on LangGraph that retrieves, grades evidence relevance, rewrites weak queries and retries before generating, with an honest fallback when the answer is not in the content. Security-hardened for public use with SSRF protection against redirect-based attacks and bounded inputs.',
    features: [
      'Same-domain crawling with focus-topic prioritized page discovery and boilerplate removal',
      'Recursive chunking with deterministic IDs so re-ingestion upserts instead of duplicating',
      'Chroma vector store with per-provider collections',
      'Retrieve, grade, rewrite and retry loop before generation',
      'Bring-your-own-key for OpenAI or Gemini; keys are never stored or logged',
      'Guided, animated walkthrough of the full retrieval pipeline',
    ],
    stack: ['FastAPI', 'LangChain', 'LangGraph', 'OpenAI', 'Gemini', 'Chroma', 'BeautifulSoup', 'React', 'Vite', 'GSAP', 'Docker', 'Render', 'Vercel'],
    links: [{ label: 'Live demo', url: 'https://website-rag-chat-bott.vercel.app/' }],
  },
  {
    id: 'legal',
    image: imgLegal,
    host: 'legal-contract-intelligence-rag.vercel.app',
    title: 'LegalIntelligence',
    kind: 'ai',
    hue: [330, 220],
    summary:
      'A RAG multi-agent contract analysis platform: grounded Q&A, playbook risk review, precedent lookup, contract comparison, and full risk reports.',
    detail:
      'Uploaded contracts are parsed, clause-chunked, classified against a legal playbook, and embedded for retrieval. Specialized agents answer only from retrieved contract text, risk findings are playbook-checked rather than free-form, and reports compile scored findings with citations.',
    features: [
      'Background ingestion: parse, chunk, classify, embed',
      'Citation-backed Q&A with page and clause references',
      'Playbook-driven risk assessment with missing required-clause detection',
      'Precedent search with caching and CourtListener integration',
      'Clause-aligned comparison of two contracts',
      'Risk reports in Markdown and PDF, with an in-app PDF viewer beside the AI chat',
    ],
    stack: ['FastAPI', 'Gemini', 'LangGraph', 'bge-small-en', 'Qdrant', 'PostgreSQL', 'PyMuPDF', 'ReportLab', 'Next.js', 'shadcn/ui', 'Docker', 'Railway', 'Vercel'],
    links: [{ label: 'Live demo', url: 'https://legal-contract-intelligence-rag.vercel.app/' }],
  },
  {
    id: 'scholarai',
    image: imgScholarai,
    host: 'github.com/DevNebula300/Multi_Agent_Research_Assistant',
    title: 'ScholarAI',
    kind: 'oss',
    hue: [215, 300],
    summary:
      'A multi-agent research assistant that turns a topic into a source-grounded literature review with real arXiv papers and verified citations.',
    detail:
      'Retrieves real papers from arXiv and runs specialized agents for cited Q&A, structured summaries, multi-paper comparison, claim verification, and research-gap detection. Claims are re-verified independently against source text rather than trusting a citation next to them.',
    features: [
      'Topic search that retrieves and indexes real arXiv papers',
      'Citation-backed answers linked to specific papers',
      'Structured paper cards: problem, method, dataset, metrics, findings, limitations',
      'Side-by-side comparison matrix with written analysis',
      'Independent claim checking that catches unsupported statements',
      'Full literature-review drafting with .docx export and an offline evaluation harness',
    ],
    stack: ['Python', 'FastAPI', 'Gemini', 'TF-IDF retrieval', 'arXiv API', 'React', 'Vite', 'Tailwind', 'Framer Motion', 'Docker', 'Railway'],
    links: [{ label: 'GitHub', url: 'https://github.com/DevNebula300/Multi_Agent_Research_Assistant' }],
  },
  {
    id: 'bluebook',
    image: imgBluebook,
    host: 'github.com/DevNebula300/rag-chatbot',
    title: 'Support Chatbot',
    kind: 'oss',
    hue: [200, 160],
    summary:
      'A tool-augmented support chatbot that combines BM25 document retrieval with deterministic pricing and feature lookups, so answers are exact and cited.',
    detail:
      'Built for a cloud storage SaaS: docs are chunked by section and indexed with BM25, while pricing and feature data are loaded into deterministic tools. The LLM orchestrates tool calls and writes the answer, but never does pricing arithmetic or guesses a feature flag.',
    features: [
      'Eight agent tools across two data layers loaded at startup',
      'BM25 documentation search over markdown sections',
      'Seat-constraint-aware pricing math and cheapest-plan search',
      'Feature comparison across plans with exact values',
      'Catches trap questions, such as plan names that do not exist',
      'Every factual claim cites its source file and section, streamed to the UI',
    ],
    stack: ['Python', 'PydanticAI', 'OpenRouter', 'FastAPI', 'rank-bm25', 'JavaScript', 'Railway'],
    links: [{ label: 'GitHub', url: 'https://github.com/DevNebula300/rag-chatbot' }],
  },
  {
    id: 'stratum',
    image: imgStratum,
    host: 'github.com/DevNebula300/Stratum',
    title: 'Stratum',
    kind: 'oss',
    hue: [280, 200],
    summary:
      'A coordination layer for fleets of cross-vendor coding agents that catches the emergent conflicts git and CI merge silently.',
    detail:
      'Sits at the git boundary and builds a semantic model of the codebase. When several agents each make a locally correct change that is collectively broken, Stratum blocks it. Detection is deterministic and explainable; the LLM is reserved for resolution.',
    features: [
      'AST dependency graph with producer to consumer contract tracking',
      'Detects semantic, dependency, syntactic, and architectural-drift conflicts',
      'Cluster-scoped write leases instead of per-file locks',
      'Coupling-based risk scoring that flags fragile files early',
      'Replays 7 concurrent changes from 4 agent vendors in the demo',
      'No-build dashboard and zero third-party dependencies',
    ],
    stack: ['Python', 'AST analysis', 'Git hooks', 'JavaScript', 'HTML dashboard'],
    links: [{ label: 'GitHub', url: 'https://github.com/DevNebula300/Stratum' }],
  },
  {
    id: 'edvenity',
    image: imgEdvenity,
    host: 'edvenity.com',
    title: 'Edvenity',
    kind: 'platform',
    hue: [190, 330],
    summary:
      'An AI-powered recruitment and talent management platform that automates the hiring lifecycle from sourcing to final selection.',
    detail:
      'Connects recruiters and candidates through intelligent sourcing, screening, assessments, and interview workflows, using AI-driven talent matching to help organizations make faster, better-informed hiring decisions.',
    features: [
      'Job posting, sourcing, screening, interviews, assessments, and selection in one flow',
      'Neural talent matching on skills and requirements, not keyword search',
      'AI technical and behavioral interviews with skills assessments',
      'Candidate tools: interview prep, resume builder, CV templates, application tracking',
      'ATS, talent pools, recruiter dashboards, and automated workflows',
    ],
    stack: ['AI matching', 'LLMs', 'ATS', 'Dashboards', 'Workflow automation'],
    links: [{ label: 'Website', url: 'https://edvenity.com' }],
  },
  {
    id: 'visionx',
    image: imgVisionx,
    host: 'visionx.io',
    title: 'VisionX',
    kind: 'platform',
    hue: [210, 350],
    summary:
      'An enterprise Vision AI platform that turns existing cameras and business systems into real-time operational intelligence.',
    detail:
      'Combines computer vision, custom AI models, voice and language capabilities, and agentic AI to monitor real-world environments and automate decisions, without requiring additional camera hardware.',
    features: [
      'Object detection, activity recognition, queue and safety monitoring',
      'Real-time operational anomaly detection',
      'Industry solutions for logistics, retail, utilities, and government',
      'AI agents that interpret events and trigger actions with a human in the loop',
      'Command center for multiple locations, feeds, assets, and alerts',
    ],
    stack: ['Computer vision', 'Custom models', 'Agentic AI', 'Voice AI', 'Enterprise integrations'],
    links: [{ label: 'Website', url: 'https://visionx.io' }],
  },
  {
    id: 'sooqsense',
    image: imgSooqsense,
    host: 'sooqsense.com',
    title: 'SooqSense',
    kind: 'platform',
    hue: [320, 210],
    summary:
      'An agentic AI CRM that automates relationship management, sales operations, and follow-ups while keeping users in control.',
    detail:
      'Connects communication channels and CRM systems into one view of contacts, conversations, meetings, and deals. AI agents find opportunities, recommend next actions, and automate repetitive sales work with human approval.',
    features: [
      'Gmail, Google Calendar, HubSpot, Salesforce, and Slack integrations',
      'Relationship health, risk, and missed-opportunity detection',
      'Prioritized daily action queues and renewal tracking',
      'Personalized follow-up drafts with approval before sending',
      'Pipeline, inbox, and calendar management with REST APIs and webhooks',
    ],
    stack: ['Agentic AI', 'LLMs', 'CRM integrations', 'REST APIs', 'Webhooks'],
    links: [{ label: 'Website', url: 'https://sooqsense.com' }],
  },
];

export const FILTERS = [
  { id: 'all', label: 'All work' },
  { id: 'ai', label: 'AI products' },
  { id: 'platform', label: 'Platforms' },
  { id: 'oss', label: 'Open source' },
];
