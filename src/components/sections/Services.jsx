import React, { useEffect, useRef } from "react";
import { gsap } from "../../utils/animations";
import ServiceCell from "../ui/ServiceCell";
import { SERVICES } from "../../utils/constants";
import { FloatingTorusKnot } from "../effects/FloatingGeometry";
import useReducedMotion from "../../hooks/useReducedMotion";
import useMediaQuery from "../../hooks/useMediaQuery";

export default function Services() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current.querySelectorAll(".service-card");
      gsap.from(cards, {
        y: 30,
        opacity: 0,
        duration: 0.8,
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
      id="services"
      ref={sectionRef}
      style={{
        padding: "14vh 32px",
        position: "relative",
        zIndex: 2,
      }}
    >
      <span className="section-number" style={{ right: 32, top: 0 }}>01</span>

      {/* Section header with 3D visual */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: 900,
        marginBottom: 40,
      }}>
        <div>
          <span style={{
            fontSize: 10,
            letterSpacing: 3,
            color: "var(--cyan-dim)",
            textTransform: "uppercase",
          }}>
            Services
          </span>
          <h2 style={{
            fontSize: "min(4vw, 36px)",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: -1,
            margin: "12px 0 0",
            lineHeight: 1.1,
            fontFamily: "system-ui, sans-serif",
          }}>
            What I do<span style={{ color: "var(--pink)" }}>.</span>
          </h2>
          <p style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.18)",
            marginTop: 8,
            lineHeight: 1.7,
            maxWidth: 300,
          }}>
            Security-first development. Every line of code reviewed.
          </p>
        </div>
        {!isMobile && (
          <div style={{ opacity: 0.8, flexShrink: 0 }}>
            <FloatingTorusKnot size={220} />
          </div>
        )}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        maxWidth: 900,
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        {SERVICES.map((item, i) => (
          <div key={i} className="service-card">
            <ServiceCell item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
