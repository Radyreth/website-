import React from "react";
import { FIVERR_URL, CALENDLY_URL } from "../../utils/constants";
import { useCursor } from "../../context/CursorContext";

export default function Footer() {
  const { setCursorType } = useCursor();

  const linkStyle = {
    fontSize: 10,
    color: "rgba(255,255,255,0.12)",
    letterSpacing: 1,
    textDecoration: "none",
    position: "relative",
    paddingBottom: 2,
    transition: "color 0.3s",
  };

  return (
    <footer style={{
      padding: "24px 32px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderTop: "1px solid rgba(255,255,255,0.03)",
      position: "relative",
      zIndex: 2,
      flexWrap: "wrap",
      gap: 12,
    }}>
      <span style={{
        fontSize: 11,
        color: "rgba(255,255,255,0.08)",
        letterSpacing: 2,
      }}>
        REAZY &copy; 2026
      </span>
      <div style={{ display: "flex", gap: 20 }}>
        {[
          { href: FIVERR_URL, label: "FIVERR" },
          { href: CALENDLY_URL, label: "CALENDLY" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={(e) => {
              setCursorType("link");
              e.currentTarget.style.color = "rgba(0,255,204,0.5)";
              const underline = e.currentTarget.querySelector(".footer-underline");
              if (underline) underline.style.transform = "scaleX(1)";
            }}
            onMouseLeave={(e) => {
              setCursorType("default");
              e.currentTarget.style.color = "rgba(255,255,255,0.12)";
              const underline = e.currentTarget.querySelector(".footer-underline");
              if (underline) underline.style.transform = "scaleX(0)";
            }}
            style={linkStyle}
          >
            {link.label}
            <span
              className="footer-underline"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: 1,
                background: "rgba(0,255,204,0.3)",
                transform: "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </a>
        ))}
      </div>
      <span style={{
        fontSize: 10,
        color: "rgba(255,255,255,0.06)",
        letterSpacing: 1,
      }}>
        Paris, FR
      </span>
    </footer>
  );
}
