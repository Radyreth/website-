// EmailJS
export const EMAILJS_PUBLIC_KEY = "wauCG7fDFn2GHkSvW";
export const EMAILJS_SERVICE_ID = "service_v41ksrk";
export const EMAILJS_TEMPLATE_ID = "template_xplgwel";

// External URLs
export const FIVERR_URL = "https://www.fiverr.com/reazy213";
export const CALENDLY_URL = "https://calendly.com/reazy2133/30min";
export const FALLBACK_EMAIL = "rezay2133@gmail.com";

// Colors
export const COLORS = {
  bg: "#050508",
  bgCard: "#08081a",
  text: "#e8e8f0",
  cyan: "#00ffcc",
  pink: "#ff3366",
  blue: "#00aaff",
  dimText: "rgba(255,255,255,0.55)",
  mutedText: "rgba(255,255,255,0.25)",
  ghostText: "rgba(255,255,255,0.12)",
  border: "rgba(255,255,255,0.06)",
  cyanDim: "rgba(0,255,204,0.4)",
  cyanGhost: "rgba(0,255,204,0.12)",
};

// Breakpoints
export const BP = {
  mobile: 768,
  tablet: 1024,
};

// Services data
export const SERVICES = [
  { n: "01", title: "Security Audit", sub: "Break your app before hackers do", price: "$99", delivery: "2-3 days" },
  { n: "02", title: "Web Dev", sub: "Ship fast. Ship secure.", price: "$200", delivery: "7-14 days" },
  { n: "03", title: "UX Review", sub: "Find what kills conversions", price: "$49", delivery: "1-2 days" },
  { n: "04", title: "Full Package", sub: "Audit + Fix + Review", price: "$299", delivery: "10-14 days" },
];

// FAQ data
export const FAQS = [
  { q: "What's in an audit?", a: "OWASP Top 10, SSL, dependencies, headers. PDF report with prioritized fixes + debrief call." },
  { q: "How fast?", a: "Audits: 2-3 days. UX: 1-2 days. Dev: 7-14 days. Rush available." },
  { q: "NDA?", a: "Always. Signed before we start." },
  { q: "Sample report?", a: "Reach out. I'll send a redacted one." },
  { q: "Revisions included?", a: "Yes. All packages include one round of revisions. Additional rounds at discounted rate." },
];

// Stats data — real credentials only
export const STATS = [
  { type: "badge", icon: "shield", label: "SecNumedu", sublabel: "ANSSI Certified Program" },
  { type: "badge", icon: "school", label: "ESIEA", sublabel: "Cybersecurity Engineering" },
  { value: 24, suffix: "h", prefix: "<", label: "Response Time", type: "counter" },
  { type: "badge", icon: "lock", label: "NDA", sublabel: "100% Secure Delivery" },
];

// Stack/skills data
export const STACK = {
  security: ["Burp Suite", "ZAP", "Nmap", "Linux"],
  dev: ["React", "Node", "Next.js", "Python", "Docker"],
  languages: ["C++", "Java", "Git"],
};

// Terminal scan steps
export const SCAN_STEPS = [
  { t: "$ reazy --scan target.com", c: COLORS.cyan },
  { t: "[■■■■■■■■■■] scanning...", c: "#3a3a5a" },
  { t: "✓ SSL valid", c: "#00ff88" },
  { t: "✗ CSP missing", c: COLORS.pink },
  { t: "✗ jQuery 2.1.4 — 3 CVEs", c: COLORS.pink },
  { t: "⚠ X-Frame-Options absent", c: "#ffcc00" },
  { t: "✓ HSTS enabled", c: "#00ff88" },
  { t: "─────────────────────", c: "#1a1a2e" },
  { t: "72/100 — 2 crit · 1 warn", c: "#fff" },
];

// Terminal commands
export const TERMINAL_COMMANDS = {
  help: [
    "Available commands:",
    "  help       — show this menu",
    "  about      — who is reazy?",
    "  skills     — technical skills",
    "  services   — what I offer",
    "  contact    — get in touch",
    "  clear      — clear terminal",
    "  ls projects/ — list projects",
    "  sudo hire reazy — 🤫",
  ],
  about: [
    "┌─────────────────────────────────┐",
    "│ REAZY — Cybersec & Web Dev      │",
    "│ Based in Paris, FR              │",
    "│ I break things, then rebuild    │",
    "│ them stronger.                  │",
    "│ Pentester × Full-Stack Dev      │",
    "└─────────────────────────────────┘",
  ],
  skills: [
    "Security:",
    "  Burp Suite  [████████░░] 80%",
    "  Nmap        [███████░░░] 70%",
    "  ZAP         [████████░░] 80%",
    "  Linux       [█████████░] 90%",
    "",
    "Development:",
    "  React       [█████████░] 90%",
    "  Node.js     [████████░░] 80%",
    "  Python      [████████░░] 80%",
    "  Next.js     [███████░░░] 70%",
    "  Docker      [██████░░░░] 60%",
  ],
  services: [
    "┌──────────────────┬────────┬──────────┐",
    "│ Service          │ Price  │ Delivery │",
    "├──────────────────┼────────┼──────────┤",
    "│ Security Audit   │   $99  │  2-3 d   │",
    "│ Web Development  │  $200  │  7-14 d  │",
    "│ UX/UI Review     │   $49  │  1-2 d   │",
    "│ Full Package     │  $299  │ 10-14 d  │",
    "└──────────────────┴────────┴──────────┘",
    "",
    "→ fiverr.com/reazy213",
  ],
  "ls projects/": [
    "drwxr-xr-x  this-site/",
    "drwxr-xr-x  security-scan/",
    "drwxr-xr-x  cipher-playground/",
    "-rw-r--r--  README.md",
  ],
  "cat projects/this-site": [
    "# this-site",
    "The portfolio you're currently browsing.",
    "Built with: React, GSAP, Three.js, Canvas 2D",
    "Features: Interactive terminal, 3D shield,",
    "  particle system, orbital skills display",
    "Status: Live ✓",
  ],
  "cat projects/security-scan": [
    "# security-scan",
    "Automated web security scanner demo.",
    "Checks: SSL, CSP, HSTS, outdated libs, headers",
    "Output: Score /100 + categorized findings",
    "Try: scroll up to the 'Proof' section",
  ],
  "cat projects/cipher-playground": [
    "# cipher-playground",
    "Live encryption/decryption widget.",
    "Supports: Caesar, ROT13, XOR",
    "Try: find it in the 'Proof of Craft' section",
  ],
};

// Nav links
export const NAV_LINKS = [
  { id: "services", label: "Services" },
  { id: "proof", label: "Proof" },
  { id: "stats", label: "Stats" },
  { id: "stack", label: "Stack" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];
