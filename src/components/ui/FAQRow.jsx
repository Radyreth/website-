import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useCursor } from "../../context/CursorContext";

export default function FAQRow({ faq }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const { setCursorType } = useCursor();

  useEffect(() => {
    if (!contentRef.current) return;
    if (open) {
      gsap.to(contentRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }, [open]);

  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setCursorType("link")}
        onMouseLeave={() => setCursorType("default")}
        aria-expanded={open}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "16px 0",
          textAlign: "left",
        }}
      >
        <span style={{
          fontSize: 14,
          color: open ? "var(--cyan)" : "var(--dim)",
          fontWeight: 500,
          transition: "color 0.3s",
          fontFamily: "system-ui, sans-serif",
        }}>
          {faq.q}
        </span>
        <span style={{
          color: "var(--cyan)",
          fontSize: 16,
          transform: open ? "rotate(45deg)" : "rotate(0)",
          transition: "transform 0.3s",
          fontWeight: 300,
          flexShrink: 0,
          marginLeft: 16,
        }}>
          +
        </span>
      </button>
      <div
        ref={contentRef}
        role="region"
        style={{
          height: 0,
          overflow: "hidden",
          opacity: 0,
        }}
      >
        <p style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.25)",
          lineHeight: 1.7,
          paddingBottom: 16,
          fontFamily: "'Courier New', monospace",
        }}>
          {faq.a}
        </p>
      </div>
    </div>
  );
}
