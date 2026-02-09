import React, { useState, useEffect, useCallback } from "react";
import GlitchText from "../effects/GlitchText";
import MagneticElement from "../ui/MagneticElement";
import MobileMenu from "./MobileMenu";
import { NAV_LINKS } from "../../utils/constants";
import useMediaQuery from "../../hooks/useMediaQuery";

function smoothScrollTo(e, id) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Header() {
  const [time, setTime] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Clock
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  // Scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section detection
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" }
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      const next = !prev;
      document.body.classList.toggle("menu-open", next);
      return next;
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    document.body.classList.remove("menu-open");
  }, []);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: isMobile ? "16px 16px" : "20px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.3s ease",
          background: scrolled ? "rgba(5,5,8,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <a
          href="#hero"
          onClick={(e) => smoothScrollTo(e, "hero")}
          style={{ textDecoration: "none" }}
        >
          <GlitchText
            text="REAZY"
            style={{ fontSize: 15, fontWeight: 700, letterSpacing: 6, color: "#fff" }}
          />
        </a>

        {isMobile ? (
          /* Hamburger */
          <button
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              width: 28,
              height: 20,
              position: "relative",
              zIndex: 200,
              padding: 0,
            }}
          >
            <span style={{
              display: "block",
              width: 28,
              height: 1.5,
              background: "#fff",
              position: "absolute",
              top: menuOpen ? 9 : 0,
              left: 0,
              transition: "all 0.3s ease",
              transform: menuOpen ? "rotate(45deg)" : "none",
            }} />
            <span style={{
              display: "block",
              width: 28,
              height: 1.5,
              background: "#fff",
              position: "absolute",
              top: 9,
              left: 0,
              transition: "all 0.3s ease",
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: "block",
              width: 28,
              height: 1.5,
              background: "#fff",
              position: "absolute",
              top: menuOpen ? 9 : 18,
              left: 0,
              transition: "all 0.3s ease",
              transform: menuOpen ? "rotate(-45deg)" : "none",
            }} />
          </button>
        ) : (
          /* Desktop nav */
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <span style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: 2,
            }}>
              {time}
            </span>
            {NAV_LINKS.filter(l => l.id !== "contact").map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => smoothScrollTo(e, link.id)}
                style={{
                  fontSize: 11,
                  color: activeSection === link.id ? "#00ffcc" : "rgba(255,255,255,0.4)",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "color 0.3s",
                  position: "relative",
                  paddingBottom: 2,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector(".nav-underline").style.transform = "scaleX(1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector(".nav-underline").style.transform = "scaleX(0)";
                }}
              >
                {link.label}
                <span
                  className="nav-underline"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: 1,
                    background: "#00ffcc",
                    transform: "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
              </a>
            ))}
            <MagneticElement
              as="a"
              href="#contact"
              cursorType="button"
              onClick={(e) => smoothScrollTo(e, "contact")}
              style={{
                fontSize: 11,
                color: "#00ffcc",
                letterSpacing: 2,
                textTransform: "uppercase",
                padding: "6px 0",
                borderBottom: "1px solid rgba(0,255,204,0.3)",
              }}
            >
              Contact
            </MagneticElement>
          </div>
        )}
      </header>

      {isMobile && (
        <MobileMenu isOpen={menuOpen} onClose={closeMenu} />
      )}
    </>
  );
}
