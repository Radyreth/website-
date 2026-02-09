import React, { useState, useEffect, useRef } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import useReducedMotion from "../../hooks/useReducedMotion";
import { STACK } from "../../utils/constants";

const ALL_SKILLS = [
  ...STACK.security.map((s) => ({ name: s, ring: 0, category: "Security" })),
  ...STACK.dev.map((s) => ({ name: s, ring: 1, category: "Development" })),
  ...STACK.languages.map((s) => ({ name: s, ring: 2, category: "Languages & Tools" })),
];

// Related skills mapping
const RELATIONS = {
  React: ["Node", "Next.js"],
  Node: ["React", "Next.js", "Docker"],
  "Next.js": ["React", "Node"],
  Python: ["Docker", "Linux"],
  Docker: ["Linux", "Node", "Python"],
  "Burp Suite": ["ZAP", "Nmap"],
  ZAP: ["Burp Suite", "Nmap"],
  Nmap: ["Burp Suite", "ZAP", "Linux"],
  Linux: ["Nmap", "Docker", "Python"],
  "C++": ["Java"],
  Java: ["C++"],
  Git: [],
};

const RING_RADII = [100, 170, 230];
const RING_SPEEDS = [0.0003, -0.0002, 0.00015];

function OrbitView() {
  const [hovered, setHovered] = useState(null);
  const [paused, setPaused] = useState(null);
  const anglesRef = useRef(
    ALL_SKILLS.map((s, i) => {
      const ring = s.ring;
      const sameRing = ALL_SKILLS.filter((sk) => sk.ring === ring);
      const idx = sameRing.indexOf(s);
      return (idx / sameRing.length) * Math.PI * 2;
    })
  );
  const frameRef = useRef(null);
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const animate = () => {
      anglesRef.current = anglesRef.current.map((angle, i) => {
        const skill = ALL_SKILLS[i];
        if (paused === skill.ring) return angle;
        return angle + RING_SPEEDS[skill.ring];
      });

      if (containerRef.current) {
        const nodes = containerRef.current.querySelectorAll(".orbit-node");
        nodes.forEach((node, i) => {
          const skill = ALL_SKILLS[i];
          const r = RING_RADII[skill.ring];
          const x = Math.cos(anglesRef.current[i]) * r;
          const y = Math.sin(anglesRef.current[i]) * r;
          node.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        });
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [paused, reducedMotion]);

  const isRelated = (name) => {
    if (!hovered) return false;
    return RELATIONS[hovered]?.includes(name);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: RING_RADII[2] * 2 + 80,
        height: RING_RADII[2] * 2 + 80,
        margin: "0 auto",
      }}
    >
      {/* Ring circles */}
      {RING_RADII.map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            border: "1px solid rgba(0,255,204,0.06)",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Center node */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: "rgba(0,255,204,0.08)",
        border: "1px solid rgba(0,255,204,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3,
      }}>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          color: "#00ffcc",
          fontFamily: "'Courier New', monospace",
        }}>
          REAZY
        </span>
      </div>

      {/* Skill nodes */}
      {ALL_SKILLS.map((skill, i) => {
        const r = RING_RADII[skill.ring];
        const sameRing = ALL_SKILLS.filter((s) => s.ring === skill.ring);
        const idx = sameRing.indexOf(skill);
        const angle = (idx / sameRing.length) * Math.PI * 2;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;

        const isHovered = hovered === skill.name;
        const related = isRelated(skill.name);
        const dimmed = hovered && !isHovered && !related;

        return (
          <div
            key={skill.name}
            className="orbit-node"
            onMouseEnter={() => {
              setHovered(skill.name);
              setPaused(skill.ring);
            }}
            onMouseLeave={() => {
              setHovered(null);
              setPaused(null);
            }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
              padding: "6px 12px",
              background: isHovered
                ? "rgba(0,255,204,0.15)"
                : related
                ? "rgba(0,255,204,0.08)"
                : "rgba(255,255,255,0.03)",
              border: `1px solid ${
                isHovered
                  ? "rgba(0,255,204,0.5)"
                  : related
                  ? "rgba(0,255,204,0.25)"
                  : "rgba(255,255,255,0.08)"
              }`,
              borderRadius: 4,
              cursor: "pointer",
              transition: "all 0.3s ease",
              opacity: dimmed ? 0.3 : 1,
              scale: isHovered ? "1.3" : "1",
              zIndex: isHovered ? 10 : 2,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{
              fontSize: 10,
              color: isHovered || related ? "#00ffcc" : "rgba(255,255,255,0.4)",
              fontFamily: "'Courier New', monospace",
              letterSpacing: 1,
              transition: "color 0.3s",
            }}>
              {skill.name}
            </span>

            {/* Tooltip */}
            {isHovered && (
              <div style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "4px 8px",
                background: "rgba(0,0,0,0.85)",
                borderRadius: 3,
                fontSize: 9,
                color: "rgba(255,255,255,0.6)",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}>
                {skill.category}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function GridView() {
  const [hovered, setHovered] = useState(null);
  const categories = [
    { title: "Security", skills: STACK.security },
    { title: "Development", skills: STACK.dev },
    { title: "Languages & Tools", skills: STACK.languages },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {categories.map((cat) => (
        <div key={cat.title}>
          <span style={{
            fontSize: 10,
            letterSpacing: 2,
            color: "rgba(0,255,204,0.4)",
            fontFamily: "'Courier New', monospace",
            textTransform: "uppercase",
          }}>
            {cat.title}
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {cat.skills.map((skill) => {
              const isHovered = hovered === skill;
              const related = hovered && RELATIONS[hovered]?.includes(skill);
              const dimmed = hovered && !isHovered && !related;

              return (
                <span
                  key={skill}
                  onMouseEnter={() => setHovered(skill)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    fontSize: 11,
                    padding: "6px 14px",
                    fontFamily: "'Courier New', monospace",
                    border: `1px solid ${
                      isHovered
                        ? "rgba(0,255,204,0.4)"
                        : related
                        ? "rgba(0,255,204,0.2)"
                        : "rgba(255,255,255,0.06)"
                    }`,
                    borderRadius: 2,
                    color: isHovered || related ? "#00ffcc" : "rgba(255,255,255,0.25)",
                    transition: "all 0.3s",
                    cursor: "default",
                    letterSpacing: 1,
                    opacity: dimmed ? 0.4 : 1,
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {skill}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StackOrbit() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return isMobile ? <GridView /> : <OrbitView />;
}
