import React, { useState, useEffect, useRef } from "react";

const EMAILJS_PUBLIC_KEY = "wauCG7fDFn2GHkSvW";
const EMAILJS_SERVICE_ID = "service_v41ksrk";
const EMAILJS_TEMPLATE_ID = "template_xplgwel";

const FIVERR_URL = "https://www.fiverr.com/reazy213";
const CALENDLY_URL = "https://calendly.com/reazy2133/30min";

function GlitchText({ text, style = {} }) {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => { setGlitching(true); setTimeout(() => setGlitching(false), 200); }, Math.random() * 4000 + 3000);
    return () => clearInterval(iv);
  }, []);
  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      <span style={{ position: "relative", zIndex: 2 }}>{text}</span>
      {glitching && (<>
        <span style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", color: "#00ffcc", zIndex: 1, clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)", transform: "translate(-3px, -1px)", opacity: 0.8 }}>{text}</span>
        <span style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", color: "#ff3366", zIndex: 1, clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)", transform: "translate(3px, 1px)", opacity: 0.8 }}>{text}</span>
      </>)}
    </span>
  );
}

function ScrambleText({ text, style = {} }) {
  const [display, setDisplay] = useState(text);
  const chars = "!@#$%^&*_+-=[]{}|;:<>?/~01";
  const refs = useRef([]);
  const scramble = () => {
    text.split("").forEach((_, i) => {
      const t1 = setTimeout(() => setDisplay(p => { const a = p.split(""); a[i] = chars[Math.floor(Math.random() * chars.length)]; return a.join(""); }), i * 30);
      const t2 = setTimeout(() => setDisplay(p => { const a = p.split(""); a[i] = text[i]; return a.join(""); }), i * 30 + 200);
      refs.current.push(t1, t2);
    });
  };
  const reset = () => { refs.current.forEach(clearTimeout); refs.current = []; setDisplay(text); };
  return <span onMouseEnter={scramble} onMouseLeave={reset} style={{ cursor: "default", ...style }}>{display}</span>;
}

function Drifter({ children, x, y, speed = 1, delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    let frame, t = delay;
    const go = () => { t += 0.005 * speed; if (ref.current) ref.current.style.transform = `translate(${Math.sin(t) * 12}px, ${Math.cos(t * 0.7) * 8}px) rotate(${Math.sin(t * 0.3) * 2}deg)`; frame = requestAnimationFrame(go); };
    go(); return () => cancelAnimationFrame(frame);
  }, [speed, delay]);
  return <div ref={ref} style={{ position: "absolute", left: x, top: y, pointerEvents: "none", zIndex: 1 }}>{children}</div>;
}

function MagneticLink({ href, children, style = {}, onClick }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const move = (e) => { const r = ref.current.getBoundingClientRect(); setOffset({ x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.25 }); };
  return (
    <a ref={ref} href={href} onClick={onClick} target={href && href.startsWith("http") ? "_blank" : undefined} rel={href && href.startsWith("http") ? "noopener noreferrer" : undefined}
      onMouseMove={move} onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      style={{ ...style, transform: `translate(${offset.x}px, ${offset.y}px)`, transition: offset.x === 0 ? "transform 0.6s cubic-bezier(0.16,1,0.3,1)" : "none", display: "inline-block", textDecoration: "none" }}>
      {children}
    </a>
  );
}

function Reveal({ children, delay = 0, direction = "up" }) {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.15 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  const t = { up: "translateY(40px)", left: "translateX(-40px)", right: "translateX(40px)" };
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translate(0,0)" : (t[direction] || t.up), transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>{children}</div>;
}

const SCAN_STEPS = [
  { t: "$ reazy --scan target.com", c: "#00ffcc" },
  { t: "[■■■■■■■■■■] scanning...", c: "#3a3a5a" },
  { t: "✓ SSL valid", c: "#00ff88" },
  { t: "✗ CSP missing", c: "#ff3366" },
  { t: "✗ jQuery 2.1.4 — 3 CVEs", c: "#ff3366" },
  { t: "⚠ X-Frame-Options absent", c: "#ffcc00" },
  { t: "✓ HSTS enabled", c: "#00ff88" },
  { t: "─────────────────────", c: "#1a1a2e" },
  { t: "72/100 — 2 crit · 1 warn", c: "#fff" },
];

function MiniTerminal() {
  const [lines, setLines] = useState([]);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.4 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, [started]);
  useEffect(() => { if (!started) return; let i = 0; const iv = setInterval(() => { if (i < SCAN_STEPS.length) { setLines(p => [...p, SCAN_STEPS[i]]); i++; } else clearInterval(iv); }, 350); return () => clearInterval(iv); }, [started]);
  return (
    <div ref={ref} style={{ background: "#08081a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "16px 20px", fontFamily: "'Courier New', monospace", fontSize: 12, lineHeight: 1.9, minHeight: 240, position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
      </div>
      {lines.map((l, i) => <div key={i} style={{ color: l.c, animation: "rFadeIn 0.25s forwards", opacity: 0 }}>{l.t}</div>)}
      {started && lines.length < scan.length && <span style={{ color: "#00ffcc", animation: "rBlink 1s infinite" }}>▊</span>}
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,204,0.015) 2px, rgba(0,255,204,0.015) 4px)", pointerEvents: "none" }} />
    </div>
  );
}

function FAQRow({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "16px 0", textAlign: "left" }}>
        <span style={{ fontSize: 14, color: open ? "#00ffcc" : "rgba(255,255,255,0.5)", fontWeight: 500, transition: "color 0.3s", fontFamily: "system-ui, sans-serif" }}>{faq.q}</span>
        <span style={{ color: "#00ffcc", fontSize: 16, transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.3s", fontWeight: 300, flexShrink: 0, marginLeft: 16 }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: "hidden", transition: "max-height 0.4s ease" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", lineHeight: 1.7, paddingBottom: 16, fontFamily: "'Courier New', monospace" }}>{faq.a}</p>
      </div>
    </div>
  );
}

function ServiceCell({ item }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      padding: "36px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", borderRight: "1px solid rgba(255,255,255,0.06)",
      cursor: "pointer", transition: "all 0.4s ease", background: hovered ? "rgba(0,255,204,0.02)" : "transparent",
    }}
      onClick={() => { const el = document.getElementById("contact"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
    >
      <span style={{ fontSize: 10, color: "rgba(0,255,204,0.3)", letterSpacing: 2, fontFamily: "'Courier New', monospace" }}>{item.n}</span>
      <h3 style={{ fontSize: 20, fontWeight: 600, color: hovered ? "#00ffcc" : "#fff", margin: "8px 0 6px", letterSpacing: -0.5, transition: "color 0.3s", fontFamily: "system-ui, sans-serif" }}>
        <ScrambleText text={item.title} />
      </h3>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", lineHeight: 1.5, marginBottom: 16, fontFamily: "'Courier New', monospace" }}>{item.sub}</p>
      <span style={{ fontSize: 18, fontWeight: 700, color: "#00ffcc", fontFamily: "'Courier New', monospace" }}>{item.price}</span>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", marginLeft: 8 }}>{item.delivery}</span>
    </div>
  );
}

function StackTag({ text }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      fontSize: 11, padding: "6px 14px", fontFamily: "'Courier New', monospace",
      border: `1px solid ${hovered ? "rgba(0,255,204,0.3)" : "rgba(255,255,255,0.06)"}`,
      borderRadius: 2, color: hovered ? "#00ffcc" : "rgba(255,255,255,0.25)",
      transition: "all 0.3s", cursor: "default", letterSpacing: 1,
    }}>{text}</span>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", service: "", msg: "" });
  const [status, setStatus] = useState("idle");
  const inp = {
    width: "100%", padding: "12px 0", background: "transparent", border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.08)", color: "#e8e8f0",
    fontFamily: "'Courier New', monospace", fontSize: 13, outline: "none",
    transition: "border-color 0.3s", letterSpacing: 0.5,
  };

  const sendEmail = async () => {
    if (!form.name || !form.email || !form.msg) { setStatus("error"); setTimeout(() => setStatus("idle"), 2000); return; }
    setStatus("sending");
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID, template_id: EMAILJS_TEMPLATE_ID, user_id: EMAILJS_PUBLIC_KEY,
          template_params: { from_name: form.name, from_email: form.email, service: form.service || "Not specified", message: form.msg }
        }),
      });
      if (res.ok || res.status === 200) { setStatus("sent"); setForm({ name: "", email: "", service: "", msg: "" }); }
      else throw new Error("Failed");
    } catch (err) {
      const subject = encodeURIComponent(`New inquiry from ${form.name}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nService: ${form.service}\n\nMessage:\n${form.msg}`);
      window.open(`mailto:rezay2133@gmail.com?subject=${subject}&body=${body}`, "_blank");
      setStatus("sent"); setForm({ name: "", email: "", service: "", msg: "" });
    }
  };

  if (status === "sent") return (
    <div style={{ padding: "40px 0", textAlign: "center" }}>
      <span style={{ fontSize: 32, color: "#00ffcc" }}>✓</span>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 12, fontFamily: "'Courier New', monospace" }}>Sent. I'll reply within 24h.</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <input style={inp} placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} onFocus={e => e.target.style.borderBottomColor = "rgba(0,255,204,0.4)"} onBlur={e => e.target.style.borderBottomColor = "rgba(255,255,255,0.08)"} />
      <input style={inp} placeholder="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onFocus={e => e.target.style.borderBottomColor = "rgba(0,255,204,0.4)"} onBlur={e => e.target.style.borderBottomColor = "rgba(255,255,255,0.08)"} />
      <select style={{ ...inp, cursor: "pointer", appearance: "none", color: form.service ? "#e8e8f0" : "rgba(255,255,255,0.35)" }} value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} onFocus={e => e.target.style.borderBottomColor = "rgba(0,255,204,0.4)"} onBlur={e => e.target.style.borderBottomColor = "rgba(255,255,255,0.08)"}>
        <option value="" style={{ background: "#050508" }}>Select a service</option>
        <option value="Security Audit" style={{ background: "#050508" }}>Security Audit — $199</option>
        <option value="Web Development" style={{ background: "#050508" }}>Web Development — $499</option>
        <option value="UX Review" style={{ background: "#050508" }}>UX/UI Review — $99</option>
        <option value="Full Package" style={{ background: "#050508" }}>Full Package — $749</option>
      </select>
      <textarea style={{ ...inp, minHeight: 80, resize: "none", marginTop: 4 }} placeholder="Tell me about your project *" value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} onFocus={e => e.target.style.borderBottomColor = "rgba(0,255,204,0.4)"} onBlur={e => e.target.style.borderBottomColor = "rgba(255,255,255,0.08)"} />
      {status === "error" && <p style={{ fontSize: 11, color: "#ff3366", marginTop: 4, fontFamily: "'Courier New', monospace" }}>Please fill in all required fields.</p>}
      <button onClick={sendEmail} disabled={status === "sending"} style={{ marginTop: 20, padding: "12px 0", background: status === "sending" ? "rgba(0,255,204,0.15)" : "transparent", border: "1px solid rgba(0,255,204,0.2)", color: "#00ffcc", fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: 2, cursor: status === "sending" ? "wait" : "pointer", transition: "all 0.3s", borderRadius: 2, opacity: status === "sending" ? 0.6 : 1 }}>
        {status === "sending" ? "SENDING..." : "SEND →"}
      </button>
    </div>
  );
}

function smoothScrollTo(e, id) { e.preventDefault(); const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }

export default function App() {
  const [time, setTime] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    setLoaded(true);
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick(); const iv = setInterval(tick, 1000);
    const onScroll = () => setScrollY(window.scrollY);
    const onMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", onScroll); window.addEventListener("mousemove", onMouse);
    return () => { clearInterval(iv); window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMouse); };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#e8e8f0", fontFamily: "'Courier New', Courier, monospace", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @keyframes rFadeIn { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes rBlink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes rScrollPulse { 0% { opacity: 0.4; } 50% { opacity: 0.1; } 100% { opacity: 0.4; } }
        html { scroll-behavior: smooth; }
        body { margin: 0; padding: 0; background: #050508; }
      `}</style>

      <div style={{ position: "fixed", left: mousePos.x - 100, top: mousePos.y - 100, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,204,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <Drifter x="85%" y="12vh" speed={0.7}><div style={{ width: 1, height: 80, background: "rgba(0,255,204,0.12)" }} /></Drifter>
      <Drifter x="7%" y="28vh" speed={1.2} delay={2}><div style={{ width: 36, height: 36, border: "1px solid rgba(0,255,204,0.06)", transform: "rotate(45deg)" }} /></Drifter>
      <Drifter x="91%" y="52vh" speed={0.5} delay={4}><span style={{ fontSize: 10, color: "rgba(0,255,204,0.12)" }}>01001</span></Drifter>
      <Drifter x="4%" y="68vh" speed={0.9} delay={1}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,51,102,0.15)" }} /></Drifter>

      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", mixBlendMode: "difference" }}>
        <a href="#hero" onClick={(e) => smoothScrollTo(e, "hero")} style={{ textDecoration: "none" }}>
          <GlitchText text="REAZY" style={{ fontSize: 15, fontWeight: 700, letterSpacing: 6, color: "#fff" }} />
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }}>{time}</span>
          <a href="#services" onClick={(e) => smoothScrollTo(e, "services")} style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase", textDecoration: "none" }}>Services</a>
          <a href="#proof" onClick={(e) => smoothScrollTo(e, "proof")} style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase", textDecoration: "none" }}>Proof</a>
          <a href="#faq" onClick={(e) => smoothScrollTo(e, "faq")} style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase", textDecoration: "none" }}>FAQ</a>
          <MagneticLink href="#contact" onClick={(e) => smoothScrollTo(e, "contact")} style={{ fontSize: 11, color: "#00ffcc", letterSpacing: 2, textTransform: "uppercase", padding: "6px 0", borderBottom: "1px solid rgba(0,255,204,0.3)" }}>Contact</MagneticLink>
        </div>
      </header>

      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "flex-end", padding: "0 32px 14vh", position: "relative" }}>
        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "rgba(0,255,204,0.4)", textTransform: "uppercase", marginBottom: 20, marginLeft: 4 }}>Cybersecurity × Web Development</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "min(9vw, 100px)", fontWeight: 700, color: "#fff", lineHeight: 0.95, letterSpacing: -3, fontFamily: "system-ui, -apple-system, sans-serif" }}><GlitchText text="I break" /></span>
            <span style={{ fontSize: "min(9vw, 100px)", fontWeight: 700, lineHeight: 0.95, letterSpacing: -3, paddingLeft: "min(5vw, 80px)", background: "linear-gradient(135deg, #00ffcc, #00aaff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "system-ui, -apple-system, sans-serif" }}>things<span style={{ WebkitTextFillColor: "#ff3366" }}>.</span></span>
          </div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.2)", marginTop: 32, maxWidth: 300, lineHeight: 1.7, marginLeft: "min(5vw, 80px)" }}>Then I rebuild them stronger.</p>
          <div style={{ display: "flex", gap: 16, marginTop: 32, marginLeft: "min(5vw, 80px)", flexWrap: "wrap" }}>
            <MagneticLink href={FIVERR_URL} style={{ padding: "12px 28px", background: "#00ffcc", color: "#050508", fontWeight: 700, fontSize: 12, letterSpacing: 1, borderRadius: 2, fontFamily: "'Courier New', monospace" }}>HIRE ON FIVERR →</MagneticLink>
            <MagneticLink href="#contact" onClick={(e) => smoothScrollTo(e, "contact")} style={{ padding: "12px 28px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)", fontSize: 12, letterSpacing: 1, borderRadius: 2, fontFamily: "'Courier New', monospace" }}>GET IN TOUCH</MagneticLink>
          </div>
        </div>
        <div style={{ position: "absolute", right: 32, bottom: "14vh", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: scrollY > 50 ? 0 : 0.3, transition: "opacity 0.5s" }}>
          <span style={{ fontSize: 10, letterSpacing: 3, writingMode: "vertical-rl", color: "rgba(255,255,255,0.3)" }}>SCROLL</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(0,255,204,0.4), transparent)", animation: "rScrollPulse 2s infinite" }} />
        </div>
      </section>

      <section id="services" style={{ padding: "14vh 32px", position: "relative", zIndex: 2 }}>
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", maxWidth: 900, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { n: "01", title: "Security Audit", sub: "Break your app before hackers do", price: "$199", delivery: "2-3 days" },
              { n: "02", title: "Web Dev", sub: "Ship fast. Ship secure.", price: "$499", delivery: "7-14 days" },
              { n: "03", title: "UX Review", sub: "Find what kills conversions", price: "$99", delivery: "1-2 days" },
              { n: "04", title: "Full Package", sub: "Audit + Fix + Review", price: "$749", delivery: "10-14 days" },
            ].map((item, i) => <ServiceCell key={i} item={item} />)}
          </div>
        </Reveal>
      </section>

      <section id="proof" style={{ padding: "10vh 32px", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 900, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "center" }}>
          <Reveal direction="left"><div>
            <span style={{ fontSize: 10, letterSpacing: 3, color: "rgba(0,255,204,0.4)", textTransform: "uppercase" }}>Live proof</span>
            <h2 style={{ fontSize: "min(4vw, 40px)", fontWeight: 700, color: "#fff", letterSpacing: -1, margin: "12px 0 16px", lineHeight: 1.1, fontFamily: "system-ui, sans-serif" }}>Don't trust words<span style={{ color: "#ff3366" }}>.</span><br /><span style={{ color: "rgba(255,255,255,0.25)" }}>Trust output.</span></h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.18)", lineHeight: 1.7, maxWidth: 280 }}>Real tools. Real findings.</p>
          </div></Reveal>
          <Reveal direction="right" delay={200}><MiniTerminal /></Reveal>
        </div>
      </section>

      <section style={{ padding: "10vh 32px", position: "relative", zIndex: 2 }}>
        <Reveal><div style={{ maxWidth: 900 }}>
          <span style={{ fontSize: 10, letterSpacing: 3, color: "rgba(0,255,204,0.4)", textTransform: "uppercase" }}>Stack</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 12px", marginTop: 20, maxWidth: 600 }}>
            {["Python", "C++", "React", "Node", "Burp Suite", "ZAP", "Nmap", "Docker", "Linux", "Java", "Git", "Next.js"].map(t => <StackTag key={t} text={t} />)}
          </div>
        </div></Reveal>
      </section>

      <section style={{ padding: "10vh 32px", position: "relative", zIndex: 2 }}>
        <Reveal><div style={{ maxWidth: 550, marginLeft: "auto" }}>
          <div style={{ fontSize: 60, color: "rgba(0,255,204,0.08)", fontFamily: "Georgia, serif", lineHeight: 0.5, marginBottom: 16 }}>"</div>
          <p style={{ fontSize: "min(2.5vw, 20px)", fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontStyle: "italic", fontFamily: "Georgia, serif" }}>Found vulnerabilities our previous auditor completely missed. Fixed everything in under a week.</p>
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00ffcc20, #00aaff20)", border: "1px solid rgba(0,255,204,0.15)" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Sarah M.</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>CTO, FinTrack</span>
          </div>
        </div></Reveal>
      </section>

      <section id="faq" style={{ padding: "10vh 32px", position: "relative", zIndex: 2 }}>
        <Reveal><div style={{ maxWidth: 550 }}>
          <span style={{ fontSize: 10, letterSpacing: 3, color: "rgba(0,255,204,0.4)", textTransform: "uppercase" }}>FAQ</span>
          <div style={{ marginTop: 24 }}>
            {[
              { q: "What's in an audit?", a: "OWASP Top 10, SSL, dependencies, headers. PDF report with prioritized fixes + debrief call." },
              { q: "How fast?", a: "Audits: 2-3 days. UX: 1-2 days. Dev: 7-14 days. Rush available." },
              { q: "NDA?", a: "Always. Signed before we start." },
              { q: "Sample report?", a: "Reach out. I'll send a redacted one." },
              { q: "Revisions included?", a: "Yes. All packages include one round of revisions. Additional rounds at discounted rate." },
            ].map((f, i) => <FAQRow key={i} faq={f} />)}
          </div>
        </div></Reveal>
      </section>

      <section id="contact" style={{ padding: "14vh 32px", position: "relative", zIndex: 2, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <Reveal><div style={{ maxWidth: 900, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 64, alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: "min(5vw, 48px)", fontWeight: 700, color: "#fff", letterSpacing: -2, lineHeight: 1.05, fontFamily: "system-ui, sans-serif" }}>Your site is<br /><span style={{ background: "linear-gradient(135deg, #ff3366, #ff6633)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>probably</span> vulnerable<span style={{ color: "#00ffcc" }}>.</span></h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.18)", marginTop: 16, lineHeight: 1.7, maxWidth: 320 }}>Let's find out before someone else does.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
              <MagneticLink href={FIVERR_URL} style={{ padding: "14px 32px", background: "#00ffcc", color: "#050508", fontWeight: 700, fontSize: 13, letterSpacing: 1, borderRadius: 2, textAlign: "center", fontFamily: "'Courier New', monospace" }}>HIRE ON FIVERR →</MagneticLink>
              <MagneticLink href={CALENDLY_URL} style={{ padding: "14px 32px", border: "1px solid rgba(0,255,204,0.2)", color: "#00ffcc", fontWeight: 500, fontSize: 13, letterSpacing: 1, borderRadius: 2, textAlign: "center", fontFamily: "'Courier New', monospace" }}>📅 BOOK A DISCOVERY CALL</MagneticLink>
            </div>
          </div>
          <ContactForm />
        </div></Reveal>
      </section>

      <footer style={{ padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.03)", position: "relative", zIndex: 2, flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.08)", letterSpacing: 2 }}>REAZY © 2026</span>
        <div style={{ display: "flex", gap: 20 }}>
          <a href={FIVERR_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: "rgba(255,255,255,0.12)", letterSpacing: 1, textDecoration: "none" }}>FIVERR</a>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: "rgba(255,255,255,0.12)", letterSpacing: 1, textDecoration: "none" }}>CALENDLY</a>
        </div>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.06)", letterSpacing: 1 }}>Paris, FR</span>
      </footer>

      <div style={{ position: "fixed", inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`, pointerEvents: "none", zIndex: 998, opacity: 0.4 }} />
    </div>
  );
}
