export type ProjectCategory = "selected" | "focused";

export type DiagramNodeKind = "service" | "store" | "external";

export interface DiagramNode {
  id: string;
  col: number;
  row: number;
  title: string;
  sub?: string;
  icons?: string[];
  kind?: DiagramNodeKind;
}

export interface DiagramEdge {
  from: string;
  to: string;
}

export interface Architecture {
  stages: string[];
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  note?: string;
}

export interface ProjectLogo {
  light: string;
  dark: string;
}

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  summary: string;
  /** One short line for the home page tiles. Falls back to the first tag. */
  tagline?: string;
  description: string;
  tags: string[];
  github: string;
  live: string | null;
  logo?: ProjectLogo;
  stat?: { value: string; label: string };
  stack?: string[];
  status?: string;
  highlights?: string[];
  architecture?: Architecture;
}

export const projects: Project[] = [
  {
    slug: "kprobe",
    title: "kprobe",
    category: "selected",
    summary:
      "A kernel-level flight recorder for production systems. eBPF probes capture what your application never logs, and a causal graph explains why it failed.",
    tagline: "A kernel flight recorder that explains why production failed.",
    description:
      "A kernel-level flight recorder for production systems. eBPF probes written in Rust with Aya capture network, CPU scheduling, memory and database-write events with nanosecond timestamps, without touching application code. A Go causal engine streams them through Kafka into ClickHouse and builds a Neo4j graph of what caused what, and a ptrace-based replay engine reproduces incidents with injected timing changes.",
    tags: ["eBPF", "Distributed Systems", "FinTech"],
    github: "https://github.com/YHQZ1/kprobe",
    live: null,
    logo: {
      light: "/projects/kprobe-light.webp",
      dark: "/projects/kprobe-dark.webp",
    },
    highlights: [
      "Captures kernel events such as tcp_sendmsg, sys_write, sched_switch and mm_page_fault with nanosecond timestamps, with no changes to application code.",
      "The probes are written entirely in Rust with Aya, from the kernel-side eBPF programs to the userspace loader, with no C anywhere.",
      "A Go causal engine groups events into windows, draws causal edges between them and writes the result to Neo4j as a queryable graph.",
      "A ptrace-based replay engine serves recorded syscalls to a sandboxed process, so an incident can be reproduced with injected timing changes.",
    ],
    architecture: {
      stages: ["Capture", "Stream", "Correlate", "Analyze", "Serve", "Explore"],
      nodes: [
        {
          id: "probes",
          col: 0,
          row: 0,
          title: "eBPF probes",
          sub: "Rust \u00b7 Aya \u00b7 DaemonSet",
          icons: ["eBPF", "Rust"],
        },
        {
          id: "otel",
          col: 0,
          row: 1,
          title: "OpenTelemetry",
          sub: "spans \u00b7 planned join",
          icons: ["OpenTelemetry"],
          kind: "external",
        },
        {
          id: "kafka",
          col: 1,
          row: 0.5,
          title: "Kafka",
          sub: "raw_kernel_events",
          icons: ["Kafka"],
          kind: "store",
        },
        {
          id: "vector",
          col: 2,
          row: 0.5,
          title: "Vector",
          sub: "PID + timestamp join",
          icons: ["Vector"],
        },
        {
          id: "clickhouse",
          col: 3,
          row: 0,
          title: "ClickHouse",
          sub: "raw event store",
          icons: ["ClickHouse"],
          kind: "store",
        },
        {
          id: "engine",
          col: 3,
          row: 1,
          title: "Causal engine",
          sub: "Go \u00b7 causal inference",
          icons: ["Go"],
        },
        {
          id: "neo4j",
          col: 3,
          row: 2,
          title: "Neo4j",
          sub: "causal graph",
          icons: ["Neo4j"],
          kind: "store",
        },
        {
          id: "api",
          col: 4,
          row: 2,
          title: "gRPC API",
          sub: "Go",
          icons: ["gRPC", "Go"],
        },
        {
          id: "d3",
          col: 5,
          row: 1,
          title: "D3.js graph",
          sub: "causality",
          icons: ["D3.js"],
        },
        {
          id: "echarts",
          col: 5,
          row: 2,
          title: "ECharts timeline",
          sub: "nanosecond view",
        },
        {
          id: "replay",
          col: 5,
          row: 3,
          title: "Replay engine",
          sub: "Go \u00b7 ptrace",
          icons: ["Go"],
        },
      ],
      edges: [
        { from: "probes", to: "kafka" },
        { from: "otel", to: "kafka" },
        { from: "kafka", to: "vector" },
        { from: "vector", to: "clickhouse" },
        { from: "vector", to: "engine" },
        { from: "engine", to: "neo4j" },
        { from: "neo4j", to: "api" },
        { from: "api", to: "d3" },
        { from: "api", to: "echarts" },
        { from: "echarts", to: "replay" },
      ],
      note: "The probe runs as a Kubernetes DaemonSet on every node. OpenTelemetry spans are the next integration step.",
    },
  },
  {
    slug: "esx",
    title: "Escrow Stock Exchange | ESX",
    category: "selected",
    summary:
      "A securities exchange built from scratch: FIX order intake, price-time matching, central clearing and atomic settlement across eight Go microservices.",
    tagline: "A stock exchange built from scratch in eight Go services.",
    description:
      "A securities exchange built from scratch, covering order intake over FIX 4.2, pre-trade risk checks, price-time order matching, central-counterparty clearing, and atomic delivery-versus-payment settlement into a double-entry ledger. Eight Go microservices, each owning its own Postgres database, communicate over Kafka and gRPC, with live market data streamed to clients over WebSockets.",
    tags: ["Distributed Systems", "FinTech", "Event-Driven Architecture"],
    github: "https://github.com/YHQZ1/esx",
    live: null,
    logo: {
      light: "/projects/esx.webp",
      dark: "/projects/esx.webp",
    },
    highlights: [
      "Eight independent Go services, each owning its own PostgreSQL database and bounded domain, with no shared state.",
      "Orders arrive over FIX 4.2 or REST and pass a pre-trade risk check that locks cash or shares as collateral.",
      "Price-time priority matching, then central-counterparty clearing through novation.",
      "Settlement is an atomic four-way database transaction (delivery versus payment), recorded in a double-entry ledger whose entries always net to zero.",
      "Live prices and trades are pushed to clients over WebSockets.",
    ],
    architecture: {
      stages: [
        "Clients",
        "Gateway",
        "Pre-trade & match",
        "Clear & publish",
        "Settle & deliver",
        "Record",
      ],
      nodes: [
        {
          id: "participants",
          col: 0,
          row: 1.5,
          title: "Market participants",
          sub: "brokers \u00b7 traders \u00b7 algos",
          kind: "external",
        },
        {
          id: "gateway",
          col: 1,
          row: 1.5,
          title: "Order gateway",
          sub: "FIX 4.2 \u00b7 REST",
          icons: ["Go"],
        },
        {
          id: "registry",
          col: 2,
          row: 0,
          title: "Participant registry",
          sub: "gRPC \u00b7 API keys",
          icons: ["gRPC"],
        },
        {
          id: "risk",
          col: 2,
          row: 1,
          title: "Risk engine",
          sub: "gRPC \u00b7 collateral locks",
          icons: ["gRPC"],
        },
        {
          id: "matching",
          col: 2,
          row: 2,
          title: "Matching engine",
          sub: "gRPC \u00b7 price-time priority",
          icons: ["gRPC"],
        },
        {
          id: "clearing",
          col: 3,
          row: 2,
          title: "Clearing house",
          sub: "Kafka \u00b7 novation",
          icons: ["Kafka"],
        },
        {
          id: "marketdata",
          col: 3,
          row: 3,
          title: "Market data feed",
          sub: "WebSocket \u00b7 live prices",
          icons: ["WebSockets"],
        },
        {
          id: "settlement",
          col: 4,
          row: 2,
          title: "Settlement engine",
          sub: "Kafka \u00b7 atomic DvP",
          icons: ["Kafka"],
        },
        {
          id: "terminal",
          col: 4,
          row: 3,
          title: "Trading terminal",
          sub: "frontend",
          kind: "external",
        },
        {
          id: "ledger",
          col: 5,
          row: 2,
          title: "Ledger service",
          sub: "double-entry journal",
          icons: ["PostgreSQL"],
          kind: "store",
        },
      ],
      edges: [
        { from: "participants", to: "gateway" },
        { from: "gateway", to: "registry" },
        { from: "gateway", to: "risk" },
        { from: "gateway", to: "matching" },
        { from: "matching", to: "clearing" },
        { from: "matching", to: "marketdata" },
        { from: "clearing", to: "settlement" },
        { from: "marketdata", to: "terminal" },
        { from: "settlement", to: "ledger" },
      ],
      note: "Kafka topics carry each trade forward: trade.executed, then trade.cleared, then trade.settled. Every service owns its own PostgreSQL database.",
    },
  },
  {
    slug: "provenance",
    title: "Provenance",
    category: "selected",
    summary:
      "An AI-assisted plastic EPR compliance platform. Invoices are read with OCR, classified with RAG over a local LLM, and reviewed line by line by a person.",
    tagline: "Invoice OCR and a local LLM, with a person reviewing every line.",
    description:
      "An AI-assisted plastic EPR compliance platform for Indian producers and brand owners. Invoices and recycling certificates are read with PaddleOCR, each line is classified through RAG over a local LLM, and a person reviews every line before it counts. Reviewed figures roll up into per-year filings with obligation calculations and a full audit trail, running as five services on Docker Compose or Kubernetes.",
    tags: ["RegTech", "Document Intelligence", "RAG", "Distributed Systems"],
    github: "https://github.com/YHQZ1/Provenance",
    live: null,
    logo: {
      light: "/projects/provenance-light.webp",
      dark: "/projects/provenance-dark.webp",
    },
    highlights: [
      "Reads the PDF text layer first and falls back to PaddleOCR only for scanned pages, then normalises quantities to kilograms, including Indian number formats.",
      "Each line gets a suggested polymer and CPCB category from a synonym index plus a local llama3.2:3b model, with no paid APIs.",
      "A person approves, corrects or excludes every line before it counts, and each decision records who made it and when.",
      "Yearly filings can be finalized into a signed-off snapshot, with obligation calculations, an audit trail and CSV, JSON or PDF export.",
    ],
    architecture: {
      stages: ["Client", "Backend", "Services", "Models"],
      nodes: [
        {
          id: "web",
          col: 0,
          row: 1,
          title: "Web app",
          sub: "React \u00b7 Vite",
          icons: ["ReactJS"],
        },
        {
          id: "redis",
          col: 1,
          row: 0,
          title: "Redis",
          sub: "queue \u00b7 cache",
          icons: ["Redis"],
          kind: "store",
        },
        {
          id: "backend",
          col: 1,
          row: 1,
          title: "Backend API",
          sub: "Express \u00b7 only writer",
          icons: ["Node.js", "Express.js"],
        },
        {
          id: "supabase",
          col: 1,
          row: 2,
          title: "Supabase",
          sub: "Postgres \u00b7 Storage \u00b7 Auth",
          icons: ["Supabase"],
          kind: "store",
        },
        {
          id: "ocr",
          col: 2,
          row: 0,
          title: "OCR service",
          sub: "FastAPI \u00b7 PaddleOCR",
          icons: ["FastAPI", "PaddleOCR"],
        },
        {
          id: "classify",
          col: 2,
          row: 1,
          title: "Material classifier",
          sub: "FastAPI \u00b7 embeddings",
          icons: ["FastAPI"],
        },
        {
          id: "regulatory",
          col: 2,
          row: 2,
          title: "Regulatory research",
          sub: "FastAPI \u00b7 CPCB / SEBI Q&A",
          icons: ["FastAPI"],
        },
        {
          id: "vectors",
          col: 3,
          row: 1.5,
          title: "Qdrant \u00b7 Ollama",
          sub: "vectors \u00b7 llama3.2:3b",
          icons: ["Qdrant", "Ollama"],
          kind: "store",
        },
      ],
      edges: [
        { from: "web", to: "backend" },
        { from: "backend", to: "redis" },
        { from: "backend", to: "supabase" },
        { from: "backend", to: "ocr" },
        { from: "backend", to: "classify" },
        { from: "backend", to: "regulatory" },
        { from: "classify", to: "vectors" },
        { from: "regulatory", to: "vectors" },
      ],
      note: "Five services running on Docker Compose or Kubernetes, with a local llama3.2:3b model and no paid APIs.",
    },
  },
  {
    slug: "hatch",
    title: "Hatch",
    category: "selected",
    summary:
      "Render-style deploys into your own AWS account, with cost guardrails built in. Currently being rebuilt around a bring-your-own-account design.",
    tagline: "Render-style deploys into your own AWS account.",
    description:
      "Render-style deploys into your own AWS account, with cost guardrails built in. Connect a GitHub repo and Hatch builds the Dockerfile, pushes the image to ECR, runs it on ECS Fargate behind a load balancer, and streams build logs live, all from one Go binary backed by Postgres. Currently being rebuilt around a bring-your-own-account design with spending limits and one-click teardown.",
    tags: ["Distributed Systems", "Cloud Infrastructure", "DevOps"],
    github: "https://github.com/YHQZ1/Hatch",
    live: null,
    logo: {
      light: "/projects/hatch-light.svg",
      dark: "/projects/hatch-dark.svg",
    },
    status: "Being rebuilt",
    highlights: [
      "Sign in with GitHub, pick a repository and Hatch detects the Dockerfile and exposed port. Pushes to the project's branch redeploy it through a webhook.",
      "Builds the Dockerfile, pushes the image to ECR and runs it on ECS Fargate behind a shared load balancer, with a subdomain per project.",
      "Build and deploy logs stream to the browser live, and a deployment can be cancelled at any stage.",
      "Every job is queued in the same database transaction as the change that causes it, so a change and its job are saved together.",
      "The rebuild moves deploys into your own AWS account through a limited role, adding spending limits, idle shutdown and complete teardown.",
    ],
    architecture: {
      stages: ["Client", "API", "Queue", "Jobs", "AWS"],
      nodes: [
        {
          id: "browser",
          col: 0,
          row: 1,
          title: "Browser",
          sub: "dashboard \u00b7 live logs",
          kind: "external",
        },
        {
          id: "github",
          col: 1,
          row: 0,
          title: "GitHub",
          sub: "App sign-in \u00b7 webhooks",
          icons: ["GitHub"],
          kind: "external",
        },
        {
          id: "api",
          col: 1,
          row: 1,
          title: "API",
          sub: "Go \u00b7 Gin",
          icons: ["Go", "Gin"],
        },
        {
          id: "postgres",
          col: 2,
          row: 1,
          title: "PostgreSQL",
          sub: "River queue \u00b7 logs",
          icons: ["PostgreSQL"],
          kind: "store",
        },
        {
          id: "build",
          col: 3,
          row: 0,
          title: "Build job",
          sub: "clone \u00b7 docker build",
          icons: ["Docker"],
        },
        {
          id: "deploy",
          col: 3,
          row: 1,
          title: "Deploy job",
          sub: "task def \u00b7 ALB rule",
          icons: ["AWS"],
        },
        {
          id: "ecr",
          col: 4,
          row: 0,
          title: "Amazon ECR",
          sub: "image registry",
          icons: ["AWS"],
          kind: "external",
        },
        {
          id: "ecs",
          col: 4,
          row: 1,
          title: "ECS Fargate",
          sub: "subdomain per project",
          icons: ["AWS"],
          kind: "external",
        },
      ],
      edges: [
        { from: "browser", to: "api" },
        { from: "github", to: "api" },
        { from: "api", to: "postgres" },
        { from: "postgres", to: "build" },
        { from: "build", to: "ecr" },
        { from: "build", to: "deploy" },
        { from: "deploy", to: "ecs" },
      ],
      note: "This is the current prototype. Logs flow from the jobs into Postgres (NOTIFY), then to the API as server-sent events and on to the browser.",
    },
  },
  {
    slug: "trixie",
    title: "Trixie",
    category: "focused",
    summary:
      "A voice assistant for macOS in native Swift. Wake word and speech recognition run on-device; answers stream back sentence by sentence.",
    description:
      "A desktop pet for macOS in native Swift, with no web stack, driven by the Claude CLI on your own subscription. The wake word and speech recognition run on-device, and replies stream sentence by sentence through ElevenLabs, falling back to a local Kokoro voice if the network drops or the monthly character cap is reached. File access is read-only with credentials and secrets blocked by default, and a slimmed setup cut each question from about 23,000 tokens to about 5,000.",
    tags: ["Voice AI", "Native Swift", "On-device Speech"],
    github: "https://github.com/YHQZ1/trixie",
    live: null,
    stat: { value: "5k", label: "tokens per question, down from 23k" },
    stack: ["Swift", "Claude Code", "Python"],
  },
  {
    slug: "bitlink",
    title: "BitLink",
    category: "focused",
    summary:
      "A URL shortener with click analytics, built so the redirect path never waits on anything but a cache lookup.",
    description:
      "A URL shortener and analytics platform built around one rule: the redirect path stays fast. Hot links are served from Redis with a MongoDB fallback, while click events (device, browser, location, referrer) go through a BullMQ queue to separate workers. Includes custom aliases, QR codes, link expiry and OAuth. Originally deployed behind Nginx on AWS EC2 with Prometheus and Grafana monitoring, and used by about 40 people while live.",
    tags: ["Distributed Systems", "Caching", "Event Pipeline"],
    github: "https://github.com/YHQZ1/BitLink",
    live: null,
    stat: { value: "~40", label: "real users while it was live" },
    stack: ["Node.js", "ReactJS", "Redis", "MongoDB", "BullMQ", "NGINX"],
  },
  {
    slug: "sandboxed",
    title: "Sandboxed",
    category: "focused",
    summary:
      "A self-hosted contest platform for hiring programmers. A Go judge runs every submission in a disposable, network-isolated container.",
    description:
      "A self-hosted coding contest platform for recruiting. Hosts open a room with a shareable code, post problems with hidden test cases and run a timed contest while candidates join with just a name. A Go judge service executes submissions in disposable, network-isolated Docker containers in five languages, and verdicts and the leaderboard are pushed live over WebSockets. Fullscreen proctoring tracks violations and removes a candidate after four.",
    tags: ["Code Execution", "Real-time", "Isolation"],
    github: "https://github.com/YHQZ1/Sandboxed",
    live: null,
    stat: { value: "5", label: "languages, each in an isolated container" },
    stack: ["Go", "Node.js", "ReactJS", "PostgreSQL", "Redis", "Docker"],
  },
  {
    slug: "overclock",
    title: "Overclock",
    category: "focused",
    summary:
      "A live two-team strategy game where load balancers, rate limiters and failover are the mechanics, run on a deterministic, seeded engine.",
    description:
      "A live head-to-head strategy game that teaches system design through play. Each team runs a pretend website: earn coins by serving traffic, then spend them defending with servers, load balancers, caches and replicas, or attacking the other side with traffic spikes, bot floods and outages. The simulation is a pure, seeded engine, so the same seed and inputs always replay the same match, served over Socket.IO with refresh-safe rejoin and PostgreSQL for results. Balance-tested with bot players, and played in about 120 matches by 150+ players over two days.",
    tags: ["System Design", "Game Engine", "Real-time Multiplayer"],
    github: "https://github.com/YHQZ1/OverClock",
    live: null,
    stat: { value: "150+", label: "players across about 120 matches" },
    stack: [
      "ReactJS",
      "Node.js",
      "Socket.io",
      "PostgreSQL",
      "Drizzle ORM",
      "Vitest",
    ],
  },
  {
    slug: "vouch",
    title: "Vouch",
    category: "focused",
    summary:
      "Reconciles Razorpay settlements against bank statements and ledgers, and only closes the books on evidence it can prove.",
    description:
      "An evidence-grade finance controller, built for Razorpay's buildathon, that reconciles settlements across Razorpay reports, bank statements and ledgers. Deterministic controls verify each settlement's net amount, bank credit and journal entries before the close is marked ready or blocked. Money is handled as integer subunits, never floats, and a bounded local AI agent may investigate leftover mismatches but cannot clear anything: every hypothesis must pass a deterministic verifier. Evaluated on synthetic data.",
    tags: ["FinTech", "Reconciliation", "Verifiable AI"],
    github:
      "https://github.com/YHQZ1/Vouch-Evidence-Grade-Settlement-Reconciliation",
    live: null,
    stat: { value: "3-way", label: "settlement, bank and ledger match" },
    stack: ["Python", "FastAPI", "ReactJS", "Playwright", "Docker"],
  },
  {
    slug: "bumper",
    title: "Bumper",
    category: "focused",
    summary:
      "A bump allocator in Rust that serves allocations by advancing a pointer, measured 7-8x faster than heap allocation.",
    description:
      "An arena (bump) allocator written from scratch in Rust. It reserves one fixed block up front and serves each allocation by advancing a pointer, with no per-object overhead, no garbage collector, cleanup on drop and an instant reset for reuse. Criterion benchmarks measure it about 8.3x faster than Box for 1,000 integers and 7.2x for 1,000 structs. Packaged as the bumper-alloc crate.",
    tags: ["Rust", "Memory Allocation", "Systems Programming"],
    github: "https://github.com/YHQZ1/Bumper",
    live: null,
    stat: { value: "7-8x", label: "faster than heap allocation" },
    stack: ["Rust"],
  },
];

export const getProject = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug);
