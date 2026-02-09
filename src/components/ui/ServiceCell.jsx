import React, { useState, useRef } from "react";
import ScrambleText from "../effects/ScrambleText";
import { useCursor } from "../../context/CursorContext";

export default function ServiceCell({ item }) {
  const [hovered, setHovered] = useState(false);
  const { setCursorType } = useCursor();
  const borderRef = useRef(null);

  return (
    <div
      onMouseEnter={() => { setHovered(true); setCursorType("link"); }}
      onMouseLeave={() => { setHovered(false); setCursorType("default"); }}
      onClick={() => {
        const el = document.getElementById("contact");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }}
      style={{
        padding: "36px 28px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        cursor: "pointer",
        transition: "all 0.4s ease",
        background: hovered ? "var(--cyan-ghost)" : "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated top border */}
      <div
        ref={borderRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 1,
          width: "100%",
          background: "var(--cyan)",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      <span style={{
        fontSize: 10,
        color: "var(--cyan-dim)",
        letterSpacing: 2,
        fontFamily: "'Courier New', monospace",
      }}>
        {item.n}
      </span>

      <h3 style={{
        fontSize: 20,
        fontWeight: 600,
        color: hovered ? "var(--cyan)" : "#fff",
        margin: "8px 0 6px",
        letterSpacing: -0.5,
        transition: "color 0.3s",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}>
        <ScrambleText text={item.title} />
      </h3>

      <p style={{
        fontSize: 12,
        color: "rgba(255,255,255,0.22)",
        lineHeight: 1.5,
        marginBottom: 16,
        fontFamily: "'Courier New', monospace",
      }}>
        {item.sub}
      </p>

      <div>
        <span style={{
          fontSize: 10,
          color: "rgba(255,255,255,0.15)",
          fontFamily: "'Courier New', monospace",
          marginRight: 4,
        }}>
          from
        </span>
        <span style={{
          fontSize: 18,
          fontWeight: 700,
          color: "var(--cyan)",
          fontFamily: "'Courier New', monospace",
        }}>
          {item.price}
        </span>
        <span style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.15)",
          marginLeft: 8,
        }}>
          {item.delivery}
        </span>
      </div>

      {/* Hover box shadow */}
      {hovered && (
        <div style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 30px var(--cyan-ghost)",
          pointerEvents: "none",
        }} />
      )}
    </div>
  );
}
