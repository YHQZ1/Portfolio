export const projects = [
  {
    title: "Hatch",
    category: "selected",
    description:
      "A self-hosted alternative to Render and Railway. Connect a GitHub repo, drop in a Dockerfile, and get a live public URL — no infrastructure setup, no cloud console, no manual configuration. Hatch handles orchestration, container lifecycle, and streams the entire build process back to you in real time.",
    tags: ["Distributed Systems", "Cloud Infrastructure", "DevOps"],
    github: "https://github.com/YHQZ1/Hatch",
    live: "https://app.hatchcloud.xyz",
    image: "/projects/hatch.png",
  },
  {
    title: "PayFlow",
    category: "selected",
    description:
      "A multi-tenant payment platform inspired by Stripe that enables businesses to process transactions, handle refunds, and receive real-time updates. Built for reliability under retries, accurate financial record-keeping, and seamless scaling as usage grows.",
    tags: ["Distributed Systems", "Microservices", "FinTech"],
    github: "https://github.com/YHQZ1/PayFlow",
    live: null,
    image: "/projects/payflow.png",
  },
  {
    title: "Dojo",
    category: "selected",
    description:
      "A self-hosted competitive coding platform built for recruiting programmers. Spin up a contest room, share a code, and let candidates compete in real time — with a built-in judge, live leaderboard, and a proctored environment that streams verdicts the moment code executes.",
    tags: ["Distributed Systems", "Real-time Systems", "Developer Tooling"],
    github: "https://github.com/YHQZ1/Dojo",
    live: "https://dojov1.vercel.app",
    image: "/projects/dojo.png",
  },
  {
    title: "BitLink",
    category: "selected",
    description:
      "A low-latency URL redirection system designed for high read throughput and write-heavy analytics ingestion. Implements collision-safe short code generation, indexed storage for fast resolution, and an event-driven pipeline for click tracking and aggregation.",
    tags: ["Distributed Systems", "Caching Strategies", "Analytics Pipeline"],
    github: "https://github.com/YHQZ1/BitLink",
    live: "https://www.bitlk.in/",
    image: "/projects/bitlink.png",
  },
  {
    title: "Raveline",
    category: "focused",
    description:
      "A decoupled moderation decision layer that evaluates user-generated content before publication. Built as an extensible policy engine supporting rule-based evaluation and asynchronous review workflows — isolating safety logic cleanly from core product services.",
    tags: ["Event-Driven Systems", "Policy Engines", "System Design"],
    github: "https://github.com/YHQZ1/Raveline",
    live: null,
    image: "/projects/raveline.png",
  },
  {
    title: "Resume Screener",
    category: "focused",
    description:
      "An intelligent recruitment engine that performs multi-vector semantic analysis on candidate resumes. Implements a hybrid scoring model — combining TF-IDF lexical matching with SBERT context embeddings — to evaluate alignment against job descriptions and surface deterministic skill gap analysis.",
    tags: ["NLP", "FastAPI", "Vector Embeddings"],
    github: "https://github.com/YHQZ1/resume-screener",
    live: "https://resume-screenerv1.vercel.app",
    image: "/projects/resume-screener.png",
  },
  {
    title: "Anchor",
    category: "focused",
    description:
      "A role-based academic workflow system that consolidates assignments, attendance, and scheduling into a transactional backend. Emphasizes structured data modeling, automated reminders, and consistency across concurrent updates.",
    tags: ["RBAC", "Workflow Automation", "Transactional Systems"],
    github: "https://github.com/YHQZ1/Anchor",
    live: "https://anchor-dev.vercel.app/",
    image: "/projects/anchor.png",
  },
  {
    title: "Provenance",
    category: "focused",
    description:
      "A deterministic ESG compliance engine for Indian SMEs that transforms operational data into regulator-ready EPR and BRSR reports. Uses structured ingestion, OCR-assisted extraction, and rule-based validation to produce fully audit-traceable outputs.",
    tags: ["RegTech", "Rule Engine Design", "Data Processing"],
    github: "https://github.com/YHQZ1/Provenance",
    live: "https://provenanceio.vercel.app",
    image: "/projects/provenance.png",
  },
  {
    title: "OneGov",
    category: "focused",
    description:
      "A multi-tenant civic services architecture that unifies disparate government workflows under a shared identity and access model. Focuses on role isolation, service abstraction, and extensibility across independent service modules.",
    tags: ["Multi-Tenant Architecture", "Access Control", "Platform Design"],
    github: "https://github.com/YHQZ1/OneGov",
    live: "https://onegov.vercel.app",
    image: "/projects/onegov.png",
  },
  {
    title: "GradCircle",
    category: "focused",
    description:
      "A secure alumni engagement and fundraising system supporting campaign management and contribution tracking. Implements role-scoped access control and transaction-safe donation handling.",
    tags: ["Secure Transactions", "Access Control", "Relational Modeling"],
    github: "https://github.com/YHQZ1/ISCKON-Alumni-Connect",
    live: "https://gradcircle.vercel.app/",
    image: "/projects/gradcircle.png",
  },
  {
    title: "VerQ",
    category: "focused",
    description:
      "A structured placement workflow system that centralizes opportunity discovery, application tracking, and preparation resources. Reduces information fragmentation while enabling automated reminders and end-to-end status visibility.",
    tags: ["Applied AI", "Process Automation", "Product Systems"],
    github: "https://github.com/YHQZ1/Verq",
    live: "https://verq-pi.vercel.app",
    image: "/projects/verq.png",
  },
  {
    title: "Matchmaking Engine",
    category: "focused",
    description:
      "A simulation-based matchmaking system that pairs players dynamically using skill-based ranking and queue-aware fairness constraints. Explores trade-offs between match quality and wait time under variable load conditions.",
    tags: ["Algorithms", "Queue Simulation", "Java"],
    github: "https://github.com/YHQZ1/Matchmaking-Engine",
    live: null,
    image: "/projects/matchmaking-engine.png",
  },
  {
    title: "Order Management System",
    category: "focused",
    description:
      "A desktop-based operational management system for customers, vendors, and inventory. Emphasizes structured data handling, state transitions, and integrity across order lifecycles.",
    tags: ["State Management", "Desktop Systems", "Data Modeling"],
    github: "https://github.com/YHQZ1/Order-Management-System",
    live: null,
    image: "/projects/oms.png",
  },
  {
    title: "F1 Performance Analysis (1950–2024)",
    category: "focused",
    description:
      "An exploratory data analysis of Formula 1 history examining longitudinal performance trends across drivers and constructors. Focuses on era-normalized comparisons and statistical pattern identification.",
    tags: ["Data Analysis", "Statistical Modeling", "Python"],
    github: "https://github.com/YHQZ1/F1-EDA",
    live: null,
    image: "/projects/f1.png",
  },
  {
    title: "CFHub",
    category: "focused",
    description:
      "A browser extension that automates archival of accepted competitive programming submissions to GitHub. Integrates with platform events and GitHub APIs to maintain versioned, structured solution repositories.",
    tags: ["Developer Tooling", "Browser Extensions", "API Integration"],
    github: "https://github.com/YHQZ1/CFHub",
    live: null,
    image: "/projects/cfhub.png",
  },
  {
    title: "QuickStream",
    category: "focused",
    description:
      "A lightweight browser extension enabling keyboard-driven control of video playback speed. Uses DOM manipulation and browser APIs to modify media elements without UI overhead.",
    tags: ["Web APIs", "Browser Extensions", "UX Optimization"],
    github: "https://github.com/YHQZ1/quickstream",
    live: null,
    image: "/projects/quickstream.png",
  },
];
