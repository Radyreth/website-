import React, { useState } from "react";
import { useCursor } from "../../context/CursorContext";
import { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, FALLBACK_EMAIL } from "../../utils/constants";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", service: "", msg: "" });
  const [status, setStatus] = useState("idle");
  const { setCursorType } = useCursor();

  const inp = {
    width: "100%",
    padding: "12px 0",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    color: "#e8e8f0",
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    outline: "none",
    transition: "border-color 0.3s",
    letterSpacing: 0.5,
  };

  const sendEmail = async () => {
    if (!form.name || !form.email || !form.msg) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            from_name: form.name,
            from_email: form.email,
            service: form.service || "Not specified",
            message: form.msg,
          },
        }),
      });
      if (res.ok || res.status === 200) {
        setStatus("sent");
        setForm({ name: "", email: "", service: "", msg: "" });
      } else {
        throw new Error("Failed");
      }
    } catch {
      const subject = encodeURIComponent(`New inquiry from ${form.name}`);
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nService: ${form.service}\n\nMessage:\n${form.msg}`
      );
      window.open(`mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`, "_blank");
      setStatus("sent");
      setForm({ name: "", email: "", service: "", msg: "" });
    }
  };

  if (status === "sent") {
    return (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <span style={{ fontSize: 32, color: "var(--cyan)" }}>&#10003;</span>
        <p style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.3)",
          marginTop: 12,
          fontFamily: "'Courier New', monospace",
        }}>
          Sent. I'll reply within 24h.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <input
        style={inp}
        placeholder="Name *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        onFocus={(e) => { e.target.style.borderBottomColor = "var(--cyan-dim)"; setCursorType("input"); }}
        onBlur={(e) => { e.target.style.borderBottomColor = "rgba(255,255,255,0.08)"; setCursorType("default"); }}
        aria-label="Your name"
      />
      <input
        style={inp}
        placeholder="Email *"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        onFocus={(e) => { e.target.style.borderBottomColor = "var(--cyan-dim)"; setCursorType("input"); }}
        onBlur={(e) => { e.target.style.borderBottomColor = "rgba(255,255,255,0.08)"; setCursorType("default"); }}
        aria-label="Your email"
      />
      <select
        style={{
          ...inp,
          cursor: "pointer",
          appearance: "none",
          color: form.service ? "#e8e8f0" : "rgba(255,255,255,0.35)",
        }}
        value={form.service}
        onChange={(e) => setForm({ ...form, service: e.target.value })}
        onFocus={(e) => { e.target.style.borderBottomColor = "var(--cyan-dim)"; setCursorType("input"); }}
        onBlur={(e) => { e.target.style.borderBottomColor = "rgba(255,255,255,0.08)"; setCursorType("default"); }}
        aria-label="Select a service"
      >
        <option value="" style={{ background: "var(--bg-card)" }}>Select a service</option>
        <option value="Security Audit" style={{ background: "var(--bg-card)" }}>Security Audit — $199</option>
        <option value="Web Development" style={{ background: "var(--bg-card)" }}>Web Development — $499</option>
        <option value="UX Review" style={{ background: "var(--bg-card)" }}>UX/UI Review — $99</option>
        <option value="Full Package" style={{ background: "var(--bg-card)" }}>Full Package — $749</option>
      </select>
      <textarea
        style={{ ...inp, minHeight: 80, resize: "none", marginTop: 4 }}
        placeholder="Tell me about your project *"
        value={form.msg}
        onChange={(e) => setForm({ ...form, msg: e.target.value })}
        onFocus={(e) => { e.target.style.borderBottomColor = "var(--cyan-dim)"; setCursorType("input"); }}
        onBlur={(e) => { e.target.style.borderBottomColor = "rgba(255,255,255,0.08)"; setCursorType("default"); }}
        aria-label="Your message"
      />
      {status === "error" && (
        <p style={{
          fontSize: 11,
          color: "var(--pink)",
          marginTop: 4,
          fontFamily: "'Courier New', monospace",
        }}>
          Please fill in all required fields.
        </p>
      )}
      <button
        onClick={sendEmail}
        disabled={status === "sending"}
        onMouseEnter={() => setCursorType("button")}
        onMouseLeave={() => setCursorType("default")}
        style={{
          marginTop: 20,
          padding: "12px 0",
          background: status === "sending" ? "var(--cyan-ghost)" : "transparent",
          border: "1px solid var(--cyan-dim)",
          color: "var(--cyan)",
          fontFamily: "'Courier New', monospace",
          fontSize: 12,
          letterSpacing: 2,
          cursor: status === "sending" ? "wait" : "pointer",
          transition: "all 0.3s",
          borderRadius: 2,
          opacity: status === "sending" ? 0.6 : 1,
        }}
      >
        {status === "sending" ? "SENDING..." : "SEND \u2192"}
      </button>
    </div>
  );
}
