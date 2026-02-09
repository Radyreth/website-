import React, { useEffect, useRef } from "react";
import { gsap } from "../../utils/animations";
import CounterNumber from "../ui/CounterNumber";
import { STATS } from "../../utils/constants";
import { FloatingGlobe } from "../effects/FloatingGeometry";
import useReducedMotion from "../../hooks/useReducedMotion";
import useMediaQuery from "../../hooks/useMediaQuery";

const ICONS = {
  shield: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00ffcc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4" opacity="0.6"/>
    </svg>
  ),
  school: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00ffcc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c0 0 3 3 6 3s6-3 6-3v-5"/>
    </svg>
  ),
  lock: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00ffcc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
      <circle cx="12" cy="16" r="1" fill="#00ffcc" opacity="0.5"/>
    </svg>
  ),
};

export default function Stats() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const items = sectionRef.current.querySelectorAll(".stat-item");
      gsap.from(items, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="stats"
      ref={sectionRef}
      style={{
        padding: "10vh 32px",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: 900,
        gap: isMobile ? 0 : 32,
      }}>
        {/* Stats grid */}
        <div style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: isMobile ? 32 : 48,
        }}>
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="stat-item"
              style={{ textAlign: "center" }}
            >
              {stat.type === "badge" ? (
                <>
                  <div style={{ marginBottom: 10, opacity: 0.8 }}>
                    {ICONS[stat.icon]}
                  </div>
                  <div style={{
                    fontSize: "clamp(18px, 3vw, 24px)",
                    fontWeight: 700,
                    color: "#00ffcc",
                    fontFamily: "'Courier New', monospace",
                    lineHeight: 1,
                    letterSpacing: 2,
                  }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.25)",
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: 1,
                    marginTop: 6,
                    textTransform: "uppercase",
                  }}>
                    {stat.sublabel}
                  </div>
                </>
              ) : (
                <>
                  <CounterNumber
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix || ""}
                  />
                  <div style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.25)",
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: 1,
                    marginTop: 8,
                    textTransform: "uppercase",
                  }}>
                    {stat.label}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* 3D Globe visual */}
        {!isMobile && (
          <div style={{ flex: "0 0 auto" }}>
            <FloatingGlobe size={250} />
          </div>
        )}
      </div>
    </section>
  );
}
