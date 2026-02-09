import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, FIVERR_URL, CALENDLY_URL } from "../../utils/constants";

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function MobileMenu({ isOpen, onClose }) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", onKey);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          aria-label="Mobile navigation"
          aria-hidden={!isOpen}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "rgba(5,5,8,0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
          }}
        >
          <nav style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            alignItems: "center",
            marginBottom: 48,
          }}>
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.id}
                href={`#${link.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo(link.id);
                  onClose();
                }}
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontFamily: "system-ui, sans-serif",
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              width: "100%",
              maxWidth: 280,
            }}
          >
            <a
              href={FIVERR_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "14px 0",
                background: "#00ffcc",
                color: "#050508",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: 2,
                textAlign: "center",
                borderRadius: 2,
                textDecoration: "none",
                fontFamily: "'Courier New', monospace",
              }}
            >
              HIRE ON FIVERR
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "14px 0",
                border: "1px solid rgba(0,255,204,0.3)",
                color: "#00ffcc",
                fontSize: 12,
                letterSpacing: 2,
                textAlign: "center",
                borderRadius: 2,
                textDecoration: "none",
                fontFamily: "'Courier New', monospace",
              }}
            >
              BOOK A CALL
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
