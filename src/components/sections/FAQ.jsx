import React, { useEffect, useRef } from "react";
import { gsap } from "../../utils/animations";
import FAQRow from "../ui/FAQRow";
import { FAQS } from "../../utils/constants";
import { FloatingKey } from "../effects/FloatingGeometry";
import useReducedMotion from "../../hooks/useReducedMotion";
import useMediaQuery from "../../hooks/useMediaQuery";

export default function FAQ() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const rows = sectionRef.current.querySelectorAll(".faq-row");
      gsap.from(rows, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
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
      id="faq"
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
        alignItems: isMobile ? "flex-start" : "center",
        gap: isMobile ? 0 : 48,
        maxWidth: 900,
      }}>
        {/* FAQ content */}
        <div style={{ flex: "1 1 550px", maxWidth: 550 }}>
          <span style={{
            fontSize: 10,
            letterSpacing: 3,
            color: "rgba(0,255,204,0.4)",
            textTransform: "uppercase",
          }}>
            FAQ
          </span>
          <div style={{ marginTop: 24 }} role="region" aria-label="Frequently asked questions">
            {FAQS.map((f, i) => (
              <div key={i} className="faq-row">
                <FAQRow faq={f} />
              </div>
            ))}
          </div>
        </div>

        {/* 3D Key visual */}
        {!isMobile && (
          <div style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <FloatingKey size={280} />
          </div>
        )}
      </div>
    </section>
  );
}
