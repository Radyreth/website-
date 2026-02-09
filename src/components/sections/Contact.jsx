import React, { useEffect, useRef } from "react";
import { gsap } from "../../utils/animations";
import ContactForm from "../ui/ContactForm";
import MagneticElement from "../ui/MagneticElement";
import { FIVERR_URL, CALENDLY_URL } from "../../utils/constants";
import useReducedMotion from "../../hooks/useReducedMotion";

export default function Contact() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current.querySelector(".contact-inner"), {
        y: 40,
        opacity: 0,
        duration: 1,
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
      id="contact"
      ref={sectionRef}
      style={{
        padding: "14vh 32px",
        position: "relative",
        zIndex: 2,
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div
        className="contact-inner"
        style={{
          maxWidth: 900,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 64,
          alignItems: "start",
        }}
      >
        <div>
          <h2 style={{
            fontSize: "min(5vw, 48px)",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: -2,
            lineHeight: 1.05,
            fontFamily: "system-ui, sans-serif",
          }}>
            Your site is<br />
            <span style={{
              background: "linear-gradient(135deg, var(--cyan), var(--blue))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              probably
            </span>{" "}
            vulnerable<span style={{ color: "var(--pink)" }}>.</span>
          </h2>
          <p style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.18)",
            marginTop: 16,
            lineHeight: 1.7,
            maxWidth: 320,
          }}>
            Let's find out before someone else does.
          </p>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 32,
          }}>
            <MagneticElement
              as="a"
              href={FIVERR_URL}
              cursorType="button"
              className="fiverr-btn"
              style={{
                padding: "14px 32px",
                background: "var(--cyan)",
                color: "var(--bg)",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: 1,
                borderRadius: 2,
                textAlign: "center",
                fontFamily: "'Courier New', monospace",
              }}
            >
              HIRE ON FIVERR &rarr;
            </MagneticElement>
            <MagneticElement
              as="a"
              href={CALENDLY_URL}
              cursorType="button"
              className="cta-glow"
              style={{
                padding: "14px 32px",
                border: "1px solid var(--cyan-ghost)",
                color: "var(--cyan)",
                fontWeight: 500,
                fontSize: 13,
                letterSpacing: 1,
                borderRadius: 2,
                textAlign: "center",
                fontFamily: "'Courier New', monospace",
              }}
            >
              BOOK A DISCOVERY CALL
            </MagneticElement>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
