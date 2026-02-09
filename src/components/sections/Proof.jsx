import React, { useEffect, useRef, useState } from "react";
import { gsap } from "../../utils/animations";
import InteractiveTerminal from "../ui/InteractiveTerminal";
import useReducedMotion from "../../hooks/useReducedMotion";

// Cipher Playground widget
function CipherPlayground() {
  const [input, setInput] = useState("Hello World");
  const [cipher, setCipher] = useState("rot13");

  const rot13 = (str) =>
    str.replace(/[a-zA-Z]/g, (c) => {
      const base = c <= "Z" ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
    });

  const caesar = (str, shift = 3) =>
    str.replace(/[a-zA-Z]/g, (c) => {
      const base = c <= "Z" ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
    });

  const xorCipher = (str, key = 42) =>
    str.split("").map((c) => {
      const xored = c.charCodeAt(0) ^ key;
      return xored.toString(16).padStart(2, "0");
    }).join(" ");

  const getOutput = () => {
    switch (cipher) {
      case "rot13": return rot13(input);
      case "caesar": return caesar(input);
      case "xor": return xorCipher(input);
      default: return input;
    }
  };

  return (
    <div style={{
      background: "rgba(8,8,26,0.6)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 8,
      padding: 20,
    }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {["rot13", "caesar", "xor"].map((c) => (
          <button
            key={c}
            onClick={() => setCipher(c)}
            style={{
              padding: "4px 10px",
              fontSize: 10,
              fontFamily: "'Courier New', monospace",
              letterSpacing: 1,
              background: cipher === c ? "var(--cyan-ghost)" : "transparent",
              border: `1px solid ${cipher === c ? "var(--cyan-dim)" : "var(--border)"}`,
              color: cipher === c ? "var(--cyan)" : "var(--muted)",
              borderRadius: 2,
              cursor: "pointer",
              textTransform: "uppercase",
              transition: "all 0.2s",
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type something..."
        style={{
          width: "100%",
          padding: "8px 0",
          background: "transparent",
          border: "none",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          color: "#e8e8f0",
          fontFamily: "'Courier New', monospace",
          fontSize: 13,
          outline: "none",
          marginBottom: 12,
        }}
      />
      <div style={{
        fontSize: 12,
        color: "var(--cyan)",
        fontFamily: "'Courier New', monospace",
        wordBreak: "break-all",
        lineHeight: 1.8,
        minHeight: 20,
      }}>
        {getOutput()}
      </div>
    </div>
  );
}

// Mini Network Topology Canvas
function NetworkTopology() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = 300;
    const h = 200;
    canvas.width = w * 2;
    canvas.height = h * 2;
    ctx.scale(2, 2);

    const nodes = [
      { x: 150, y: 40, label: "Router", ox: 150, oy: 40 },
      { x: 60, y: 100, label: "Server", ox: 60, oy: 100 },
      { x: 240, y: 100, label: "Client", ox: 240, oy: 100 },
      { x: 100, y: 160, label: "DB", ox: 100, oy: 160 },
      { x: 200, y: 160, label: "API", ox: 200, oy: 160 },
    ];
    const links = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4]];

    let animId;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Mouse influence on nodes
      nodes.forEach((n) => {
        const dx = mouse.current.x - n.ox;
        const dy = mouse.current.y - n.oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80 && dist > 0) {
          n.x = n.ox + (dx / dist) * 10;
          n.y = n.oy + (dy / dist) * 10;
        } else {
          n.x += (n.ox - n.x) * 0.1;
          n.y += (n.oy - n.y) * 0.1;
        }
      });

      // Links
      links.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.strokeStyle = "var(--border)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Nodes
      nodes.forEach((n) => {
        const dx = mouse.current.x - n.x;
        const dy = mouse.current.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hover = dist < 30;

        ctx.beginPath();
        ctx.arc(n.x, n.y, hover ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = hover ? "var(--cyan)" : "var(--cyan-dim)";
        ctx.fill();

        ctx.font = "8px 'Courier New'";
        ctx.fillStyle = hover ? "var(--cyan)" : "var(--muted)";
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.x, n.y + 16);
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: (e.clientX - rect.left) * (w / rect.width),
        y: (e.clientY - rect.top) * (h / rect.height),
      };
    };

    canvas.addEventListener("mousemove", onMouse);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: 200,
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,8,26,0.6)",
      }}
    />
  );
}

// Before/After Audit Score widget
function AuditBeforeAfter() {
  const [showAfter, setShowAfter] = useState(false);
  const [beforeScore, setBeforeScore] = useState(0);
  const [afterScore, setAfterScore] = useState(0);
  const ref = useRef(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        // Animate before score
        const before = { val: 0 };
        gsap.to(before, {
          val: 35,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => setBeforeScore(Math.round(before.val)),
          onComplete: () => {
            setTimeout(() => {
              setShowAfter(true);
              const after = { val: 0 };
              gsap.to(after, {
                val: 92,
                duration: 2,
                ease: "power2.out",
                onUpdate: () => setAfterScore(Math.round(after.val)),
              });
            }, 800);
          },
        });
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const BEFORE_FINDINGS = [
    { label: "CSP Header", status: "fail" },
    { label: "jQuery 2.1.4", status: "fail" },
    { label: "X-Frame-Options", status: "warn" },
    { label: "SSL Certificate", status: "pass" },
    { label: "HSTS", status: "warn" },
  ];

  const AFTER_FINDINGS = [
    { label: "CSP Header", status: "pass" },
    { label: "Dependencies", status: "pass" },
    { label: "X-Frame-Options", status: "pass" },
    { label: "SSL Certificate", status: "pass" },
    { label: "HSTS", status: "pass" },
  ];

  const getScoreColor = (score) => {
    if (score < 50) return "var(--pink)";
    if (score < 75) return "#f59e0b"; // Amber for warning
    return "var(--cyan)";
  };

  const getStatusIcon = (status) => {
    if (status === "pass") return { symbol: "\u2713", color: "var(--cyan)" };
    if (status === "warn") return { symbol: "\u26A0", color: "#f59e0b" };
    return { symbol: "\u2717", color: "var(--pink)" };
  };

  const findings = showAfter ? AFTER_FINDINGS : BEFORE_FINDINGS;
  const score = showAfter ? afterScore : beforeScore;

  return (
    <div ref={ref} style={{
      background: "rgba(8,8,26,0.6)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 8,
      padding: 20,
    }}>
      {/* Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["Before", "After"].map((label) => {
          const active = label === "After" ? showAfter : !showAfter;
          return (
            <button
              key={label}
              onClick={() => setShowAfter(label === "After")}
              style={{
                padding: "4px 12px",
                fontSize: 10,
                fontFamily: "'Courier New', monospace",
                letterSpacing: 1,
                background: active ? "var(--cyan-ghost)" : "transparent",
                border: `1px solid ${active ? "var(--cyan-dim)" : "var(--border)"}`,
                color: active ? "var(--cyan)" : "var(--muted)",
                borderRadius: 2,
                cursor: "pointer",
                textTransform: "uppercase",
                transition: "all 0.2s",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Score circle */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: `3px solid ${getScoreColor(score)}`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          transition: "border-color 0.5s",
          boxShadow: `0 0 20px ${getScoreColor(score)}22`,
        }}>
          <span style={{
            fontSize: 24,
            fontWeight: 700,
            color: getScoreColor(score),
            fontFamily: "'Courier New', monospace",
            transition: "color 0.5s",
          }}>
            {score}
          </span>
          <span style={{
            fontSize: 8,
            color: "rgba(255,255,255,0.3)",
            fontFamily: "'Courier New', monospace",
          }}>
            /100
          </span>
        </div>
      </div>

      {/* Findings */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {findings.map((f, i) => {
          const icon = getStatusIcon(f.status);
          return (
            <div key={i} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "4px 0",
              fontSize: 11,
              fontFamily: "'Courier New', monospace",
            }}>
              <span style={{ color: "rgba(255,255,255,0.35)" }}>{f.label}</span>
              <span style={{ color: icon.color, fontSize: 12 }}>{icon.symbol}</span>
            </div>
          );
        })}
      </div>

      {/* Label */}
      <div style={{
        marginTop: 12,
        textAlign: "center",
        fontSize: 9,
        color: "rgba(255,255,255,0.15)",
        fontFamily: "'Courier New', monospace",
        letterSpacing: 1,
      }}>
        {showAfter ? "AFTER REAZY AUDIT" : "BEFORE AUDIT"}
      </div>
    </div>
  );
}

// Proof cards
const PROOF_ITEMS = [
  {
    title: "Audit: Before vs After",
    desc: "See what a security audit delivers. Real findings, real fixes.",
    type: "audit",
  },
  {
    title: "Live Security Scan",
    desc: "Real-time scan simulation. Try typing commands after it finishes.",
    type: "terminal",
  },
  {
    title: "This Site",
    desc: "You're looking at it. React, GSAP, Canvas 2D, Three.js, Interactive Terminal.",
    type: "text",
  },
  {
    title: "Cipher Playground",
    desc: "Type text and see it encrypted live. ROT13, Caesar, XOR.",
    type: "cipher",
  },
  {
    title: "Network Topology",
    desc: "Interactive network graph. Hover to disturb the nodes.",
    type: "network",
  },
];

export default function Proof() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current.querySelectorAll(".proof-card");
      cards.forEach((card, i) => {
        gsap.from(card, {
          x: i % 2 === 0 ? -40 : 40,
          opacity: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="proof"
      ref={sectionRef}
      style={{
        padding: "10vh 32px",
        position: "relative",
        zIndex: 2,
      }}
    >
      <span className="section-number" style={{ left: -20, top: -20 }}>02</span>

      <div style={{ maxWidth: 900 }}>
        <span style={{
          fontSize: 10,
          letterSpacing: 3,
          color: "var(--cyan-dim)",
          textTransform: "uppercase",
        }}>
          Proof of Craft
        </span>
        <h2 style={{
          fontSize: "min(4vw, 40px)",
          fontWeight: 700,
          color: "#fff",
          letterSpacing: -1,
          margin: "12px 0 40px",
          lineHeight: 1.1,
          fontFamily: "system-ui, sans-serif",
        }}>
          Don't trust words<span style={{ color: "var(--pink)" }}>.</span>
          <br />
          <span style={{ color: "rgba(255,255,255,0.25)" }}>Trust output.</span>
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}>
          {PROOF_ITEMS.map((item, i) => (
            <div
              key={i}
              className="proof-card"
              style={{
                background: "rgba(255,255,255,0.015)",
                border: "1px solid rgba(255,255,255,0.04)",
                borderRadius: 8,
                padding: item.type === "terminal" ? 0 : 24,
                minHeight: item.type === "terminal" ? 280 : "auto",
                overflow: "hidden",
              }}
            >
              {item.type === "text" && (
                <div>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#fff",
                    marginBottom: 8,
                    fontFamily: "system-ui, sans-serif",
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.3)",
                    lineHeight: 1.7,
                    fontFamily: "'Courier New', monospace",
                  }}>
                    {item.desc}
                  </p>
                  <div style={{
                    marginTop: 16,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                  }}>
                    {["React", "GSAP", "Canvas", "Three.js", "Terminal"].map((tech) => (
                      <span key={tech} style={{
                        fontSize: 9,
                        padding: "3px 8px",
                        border: "1px solid var(--cyan-ghost)",
                        borderRadius: 2,
                        color: "var(--cyan-dim)",
                        fontFamily: "'Courier New', monospace",
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {item.type === "audit" && (
                <div>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#fff",
                    marginBottom: 8,
                    fontFamily: "system-ui, sans-serif",
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.3)",
                    lineHeight: 1.7,
                    marginBottom: 12,
                    fontFamily: "'Courier New', monospace",
                  }}>
                    {item.desc}
                  </p>
                  <AuditBeforeAfter />
                </div>
              )}
              {item.type === "terminal" && <InteractiveTerminal />}
              {item.type === "network" && (
                <div>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#fff",
                    marginBottom: 8,
                    fontFamily: "system-ui, sans-serif",
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.3)",
                    lineHeight: 1.7,
                    marginBottom: 12,
                    fontFamily: "'Courier New', monospace",
                  }}>
                    {item.desc}
                  </p>
                  <NetworkTopology />
                </div>
              )}
              {item.type === "cipher" && (
                <div>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#fff",
                    marginBottom: 8,
                    fontFamily: "system-ui, sans-serif",
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.3)",
                    lineHeight: 1.7,
                    marginBottom: 12,
                    fontFamily: "'Courier New', monospace",
                  }}>
                    {item.desc}
                  </p>
                  <CipherPlayground />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
