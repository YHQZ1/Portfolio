export const projects = [
  {
    title: "kprobe",
    category: "selected",
    description:
      "A kernel-level flight recorder for production systems. eBPF probes written in Rust with Aya capture network, CPU scheduling, memory and database-write events with nanosecond timestamps, without touching application code. A Go causal engine streams them through Kafka into ClickHouse and builds a Neo4j graph of what caused what, and a ptrace-based replay engine reproduces incidents with injected timing changes.",
    tags: ["eBPF", "Distributed Systems", "FinTech"],
    github: "https://github.com/YHQZ1/kprobe",
    live: null,
    image: "/projects/kprobe.png",
  },
  {
    title: "Escrow Stock Exchange | ESX",
    category: "selected",
    description:
      "A securities exchange built from scratch, covering order intake over FIX 4.2, pre-trade risk checks, price-time order matching, central-counterparty clearing, and atomic delivery-versus-payment settlement into a double-entry ledger. Eight Go microservices, each owning its own Postgres database, communicate over Kafka and gRPC, with live market data streamed to clients over WebSockets.",
    tags: ["Distributed Systems", "FinTech", "Event-Driven Architecture"],
    github: "https://github.com/YHQZ1/esx",
    live: null,
    image: "/projects/esx.png",
  },
  {
    title: "Provenance",
    category: "selected",
    description:
      "An AI-assisted plastic EPR compliance platform for Indian producers and brand owners. Invoices and recycling certificates are read with PaddleOCR, each line is classified through RAG over a local LLM, and a person reviews every line before it counts. Reviewed figures roll up into per-year filings with obligation calculations and a full audit trail, running as five services on Docker Compose or Kubernetes.",
    tags: ["RegTech", "Document Intelligence", "RAG", "Distributed Systems"],
    github: "https://github.com/YHQZ1/Provenance",
    live: null,
    image: "/projects/provenance.png",
  },
  {
    title: "Hatch",
    category: "focused",
    description:
      "Render-style deploys into your own AWS account, with cost guardrails built in. Connect a GitHub repo and Hatch builds the Dockerfile, pushes the image to ECR, runs it on ECS Fargate behind a load balancer, and streams build logs live, all from one Go binary backed by Postgres. Currently being rebuilt around a bring-your-own-account design with spending limits and one-click teardown.",
    tags: ["Distributed Systems", "Cloud Infrastructure", "DevOps"],
    github: "https://github.com/YHQZ1/Hatch",
    live: null,
    image: null,
  },
  {
    title: "BitLink",
    category: "focused",
    description:
      "A URL shortener and analytics platform built around one rule: redirects never wait. Hot links are served from a Redis cache with a MongoDB fallback, while click events like device, browser, location and referrer are queued through BullMQ and processed by separate workers. Includes custom aliases, QR codes, link expiry and OAuth, and was deployed behind Nginx on AWS EC2 with Prometheus metrics. Used by about 40 real users while it was live.",
    tags: ["Distributed Systems", "Caching Strategies", "Analytics Pipeline"],
    github: "https://github.com/YHQZ1/BitLink",
    live: null,
    image: null,
  },
  {
    title: "Sandboxed",
    category: "focused",
    description:
      "A self-hosted coding contest platform for recruiting programmers. Hosts create a room with a shareable code, post problems with hidden test cases and run a timed contest while candidates join with just a name. A Go judge service runs submissions in disposable, network-isolated Docker sandboxes in five languages, with verdicts and the leaderboard pushed live over WebSockets and fullscreen proctoring.",
    tags: ["Distributed Systems", "Real-time Systems", "Developer Tooling"],
    github: "https://github.com/YHQZ1/Sandboxed",
    live: null,
    image: null,
  },
  {
    title: "Overclock",
    category: "focused",
    description:
      "A live head-to-head strategy game built for SymbiTech 2026, our college tech fest. Two teams run pretend websites and spend their earnings defending their own or attacking the other, across three rounds with a live leaderboard on the big screen. Built on a deterministic, seeded game engine and a Socket.io server with rooms and refresh-safe rejoin. Played in about 120 matches by 150+ players over two days.",
    tags: ["Real-time Systems", "Game Engine", "Live Events"],
    github: "https://github.com/YHQZ1/OverClock",
    live: null,
    image: null,
  },
  {
    title: "Vouch",
    category: "focused",
    description:
      "An evidence-grade finance controller, built for Razorpay's buildathon, that reconciles settlements across Razorpay reports, bank statements and ledgers. Deterministic rules verify each settlement's net amount, bank credit and journal entries before marking the close ready or blocked. A bounded local AI agent can investigate leftover mismatches, but every hypothesis must pass a verifier before it counts. Evaluated on synthetic data.",
    tags: ["FinTech", "Reconciliation Engine", "Applied AI"],
    github:
      "https://github.com/YHQZ1/Vouch-Evidence-Grade-Settlement-Reconciliation",
    live: null,
    image: null,
  },
  {
    title: "Bumper",
    category: "focused",
    description:
      "A bump allocator (arena) built from scratch in Rust. It reserves one fixed block up front and serves allocations by advancing a pointer, with zero per-object overhead, no garbage collector, automatic cleanup on drop and an instant reset for reuse. Criterion benchmarks measure it 7-8x faster than heap allocation for 1,000 small objects. Packaged as the bumper-alloc crate.",
    tags: ["Rust", "Memory Management", "Systems Programming"],
    github: "https://github.com/YHQZ1/Bumper",
    live: null,
    image: null,
  },
];
