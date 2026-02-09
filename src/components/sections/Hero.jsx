import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../utils/animations";
import GlitchText from "../effects/GlitchText";
import MagneticElement from "../ui/MagneticElement";
import CyberShield3D from "../effects/CyberShield3D";
import { FIVERR_URL } from "../../utils/constants";
import useMediaQuery from "../../hooks/useMediaQuery";
import useReducedMotion from "../../hooks/useReducedMotion";

export default function Hero() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const lineRef = useRef(null);
  const ctaRef = useRef(null);
  const tagRef = useRef(null);
  const scrollRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // Letter-by-letter animation for title
      const line1 = titleRef.current?.querySelector(".hero-line1");
      const line2 = titleRef.current?.querySelector(".hero-line2");

      if (line1 && line2) {
        const chars1 = line1.querySelectorAll(".char");
        const chars2 = line2.querySelectorAll(".char");

        gsap.set([...chars1, ...chars2], { y: "100%", opacity: 0 });

        const tl = gsap.timeline({ delay: 0.5 });

        tl.to(tagRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "expo.out",
        });

        tl.to(chars1, {
          y: "0%",
          opacity: 1,
          stagger: 0.03,
          duration: 0.6,
          ease: "expo.out",
        }, "-=0.2");

        tl.to(chars2, {
          y: "0%",
          opacity: 1,
          stagger: 0.03,
          duration: 0.6,
          ease: "expo.out",
        }, "-=0.3");

        // Cyan line
        tl.fromTo(lineRef.current,
          { scaleX: 0, transformOrigin: "left" },
          { scaleX: 1, duration: 0.8, ease: "expo.out" },
          "-=0.3"
        );

        // Subtitle
        tl.to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "expo.out",
        }, "-=0.4");

        // CTA
        tl.to(ctaRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "expo.out",
        }, "-=0.3");
      }

      // Parallax on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (titleRef.current) {
            titleRef.current.style.transform = `translateY(${progress * 80}px)`;
            titleRef.current.style.opacity = 1 - progress * 1.5;
          }
          if (subtitleRef.current) {
            subtitleRef.current.style.transform = `translateY(${progress * 50}px)`;
          }
          if (ctaRef.current) {
            ctaRef.current.style.transform = `translateY(${progress * 30}px)`;
            ctaRef.current.style.opacity = 1 - progress * 2;
          }
          if (scrollRef.current) {
            scrollRef.current.style.opacity = Math.max(0, 0.3 - progress * 2);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const renderChars = (text) =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className="char"
        style={{
          display: "inline-block",
          willChange: "transform",
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "flex-end",
        padding: isMobile ? "0 16px 10vh" : "0 32px 14vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 3D Shield */}
      <div style={{
        position: "absolute",
        right: isMobile ? "-10%" : "5%",
        top: isMobile ? "10%" : "15%",
        opacity: 0.7,
        zIndex: 1,
      }}>
        <CyberShield3D />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div
          ref={tagRef}
          style={{
            fontSize: 11,
            letterSpacing: 3,
            color: "var(--cyan-dim)",
            textTransform: "uppercase",
            marginBottom: 20,
            marginLeft: 4,
            opacity: reducedMotion ? 1 : 0,
            transform: reducedMotion ? "none" : "translateY(20px)",
          }}
        >
          Cybersecurity &times; Web Development
        </div>

        <div ref={titleRef} style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div className="hero-line1" style={{
            fontSize: isMobile ? "12vw" : "min(9vw, 100px)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 0.95,
            letterSpacing: -3,
            fontFamily: "system-ui, -apple-system, sans-serif",
            overflow: "hidden",
          }}>
            <GlitchText text="I break" style={{ display: "inline" }} />
            {reducedMotion ? null : (
              <span style={{ position: "absolute", opacity: 0 }}>
                {renderChars("I break")}
              </span>
            )}
          </div>
          <div className="hero-line2" style={{
            fontSize: isMobile ? "12vw" : "min(9vw, 100px)",
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: -3,
            paddingLeft: isMobile ? "5vw" : "min(5vw, 80px)",
            background: "linear-gradient(135deg, var(--cyan), var(--blue))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "system-ui, -apple-system, sans-serif",
            overflow: "hidden",
          }}>
            things<span style={{ WebkitTextFillColor: "var(--pink)" }}>.</span>
          </div>
        </div>

        {/* Cyan line under title */}
        <div
          ref={lineRef}
          style={{
            width: isMobile ? 120 : 200,
            height: 1,
            background: "linear-gradient(90deg, var(--cyan), transparent)",
            marginTop: 16,
            marginLeft: isMobile ? "5vw" : "min(5vw, 80px)",
            transform: reducedMotion ? "none" : "scaleX(0)",
          }}
        />

        <p
          ref={subtitleRef}
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.2)",
            marginTop: 24,
            maxWidth: 300,
            lineHeight: 1.7,
            marginLeft: isMobile ? "5vw" : "min(5vw, 80px)",
            opacity: reducedMotion ? 1 : 0,
            transform: reducedMotion ? "none" : "translateY(20px)",
          }}
        >
          Then I rebuild them stronger.
        </p>

        <div
          ref={ctaRef}
          style={{
            display: "flex",
            gap: 16,
            marginTop: 32,
            marginLeft: isMobile ? "5vw" : "min(5vw, 80px)",
            flexWrap: "wrap",
            flexDirection: isMobile ? "column" : "row",
            opacity: reducedMotion ? 1 : 0,
            transform: reducedMotion ? "none" : "translateY(20px)",
          }}
        >
          <MagneticElement
            as="a"
            href={FIVERR_URL}
            cursorType="button"
            className="fiverr-btn"
            style={{
              padding: "12px 28px",
              background: "var(--cyan)",
              color: "var(--bg)",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: 1,
              borderRadius: 2,
              fontFamily: "'Courier New', monospace",
              textAlign: "center",
            }}
          >
            HIRE ON FIVERR &rarr;
          </MagneticElement>
          <MagneticElement
            as="a"
            href="#contact"
            cursorType="button"
            className="cta-glow"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              padding: "12px 28px",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.35)",
              fontSize: 12,
              letterSpacing: 1,
              borderRadius: 2,
              fontFamily: "'Courier New', monospace",
              textAlign: "center",
            }}
          >
            GET IN TOUCH
          </MagneticElement>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        style={{
          position: "absolute",
          right: 32,
          bottom: "14vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: 0.3,
        }}
      >
        <span style={{
          fontSize: 10,
          letterSpacing: 3,
          writingMode: "vertical-rl",
          color: "rgba(255,255,255,0.3)",
        }}>
          SCROLL
        </span>
        <div style={{
          width: 1,
          height: 40,
          background: "linear-gradient(to bottom, var(--cyan-dim), transparent)",
          animation: "scrollPulse 2s infinite",
        }} />
      </div>
    </section>
  );
}
