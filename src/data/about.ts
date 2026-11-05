export const LEAD =
  "I'm Uttkarsh, a backend engineer. I care about how a system behaves under load, how it fails, and how quickly you find out.";

export const INTRO = [
  "I'm a final-year CS student at SIT Pune and a software engineer intern at TraceLink, working on backend services. What interests me is how software behaves when things go wrong: how a system degrades under load, how a failure spreads, and how quickly you find out. My projects keep returning to that ground: a stock exchange built from scratch, a kernel flight recorder in Rust and Go, a deploy platform on AWS, a bump allocator in Rust.",
  "Most of my work is in Go and TypeScript, with Rust, C and Python where the problem asks for them. I care about correctness before cleverness: tests that pin down behaviour, failures handled explicitly, and documentation that says plainly what is still broken. I'd rather ship what I can explain and debug than what only looks good in a demo, so I learn by following a real request end to end until the failure makes sense.",
];

export const COMPETENCIES = [
  {
    title: "Distributed Systems & Reliability",
    tech: ["Go", "Kafka", "Redis", "gRPC", "Jaeger"],
    body: "Things fail: networks drop, disks fill up, and a service that behaved all week picks the worst possible moment to stop. I like designing for that day instead of hoping it never comes, and I like the detective work of finding out what actually went wrong.",
  },
  {
    title: "System Design",
    tech: ["PostgreSQL", "ClickHouse", "Neo4j", "Protocol Buffers", "OpenAPI"],
    body: "Before I build anything, I try to work out what will break first and what it will take down with it. Good design is mostly deciding where the walls go, so a failure in one place stays in that place. I'd rather spend an afternoon on a whiteboard than a month untangling a rushed decision.",
  },
  {
    title: "DevOps & Cloud",
    tech: [
      "Docker",
      "Kubernetes",
      "AWS",
      "GitHub Actions",
      "Jenkins",
      "Terraform",
      "Prometheus",
      "Grafana",
    ],
    body: "Shipping is part of the job, not something that happens afterwards. I like pipelines that are boring, deployments I can repeat, and dashboards that tell me something is wrong before a user does. And I keep an eye on cost too, because a good system shouldn't surprise you on the invoice.",
  },
  {
    title: "Competitive Programming",
    tech: ["Java", "C++"],
    body: "Contests taught me to think clearly with a clock running, and to be suspicious of any solution I can't explain. I spent a year co-heading the competitive programming vertical of my college's developer community, designing problems, running contests and helping people get unstuck.",
  },
];

export interface Role {
  title: string;
  period: string;
  body: string;
  current?: boolean;
}

export const TRACELINK_ROLES: Role[] = [
  {
    title: "Software Engineer Intern",
    period: "September 2026 – Present",
    current: true,
    body: "Working across the solution design and solution builder teams as a backend engineer, designing and building solutions in Node.js, Express and Java. The stack includes Redis, S3, OpenSearch, RocksDB and Kafka, shipped through Jenkins pipelines with Docker, Kubernetes and AWS, and watched through Grafana and Jaeger.",
  },
];

export const COMMUNITY_ROLES: Role[] = [
  {
    title: "President",
    period: "July 2026 – Present",
    current: true,
    body: "Leading the student developer community at SIT Pune, taking over right after my time as Competitive Programming Co-Head. That means setting the technical direction for a 30+ member team and building a culture where people learn by doing: hands-on sessions, real projects, and pushing members to build things that go beyond coursework.",
  },
  {
    title: "Competitive Programming Co-Head",
    period: "July 2025 – June 2026",
    body: "Built and ran the community's competitive programming vertical — designing problem sets, running contests, and mentoring students through the grind of algorithmic thinking. The goal was never leaderboard rankings, it was getting people to think precisely under pressure. That's a skill that transfers everywhere.",
  },
  {
    title: "Media Co-Head",
    period: "July 2024 – June 2025",
    body: "Ran the community's media: photographing events, making reels and edits, and covering flagship events like the tech fest, induction and the hackathon. Later moved over to co-lead the competitive programming vertical.",
  },
];
