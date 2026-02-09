import React, { useEffect, useRef } from "react";
import { gsap } from "../../utils/animations";
import StackOrbit from "../ui/StackOrbit";
import useReducedMotion from "../../hooks/useReducedMotion";

export default function Stack() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current.querySelector(".stack-content"), {
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
      id="stack"
      ref={sectionRef}
      style={{
        padding: "10vh 32px",
        position: "relative",
        zIndex: 2,
      }}
    >
      <span className="section-number" style={{ right: 32, top: 0 }}>03</span>

      <div className="stack-content" style={{ maxWidth: 900 }}>
        <span style={{
          fontSize: 10,
          letterSpacing: 3,
          color: "rgba(0,255,204,0.4)",
          textTransform: "uppercase",
        }}>
          Stack
        </span>
        <div style={{ marginTop: 32 }}>
          <StackOrbit />
        </div>
      </div>
    </section>
  );
}
