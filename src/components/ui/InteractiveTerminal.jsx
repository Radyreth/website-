import React, { useReducer, useEffect, useRef, useCallback } from "react";
import { SCAN_STEPS, TERMINAL_COMMANDS, FIVERR_URL } from "../../utils/constants";

const initialState = {
  history: [],
  input: "",
  mode: "idle", // idle | autoplay | interactive
  scanIndex: 0,
  typing: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "START_AUTOPLAY":
      return { ...state, mode: "autoplay", history: [], scanIndex: 0 };
    case "ADD_SCAN_LINE":
      return {
        ...state,
        history: [...state.history, { text: SCAN_STEPS[state.scanIndex].t, color: SCAN_STEPS[state.scanIndex].c }],
        scanIndex: state.scanIndex + 1,
      };
    case "FINISH_AUTOPLAY":
      return {
        ...state,
        mode: "interactive",
        history: [
          ...state.history,
          { text: "", color: "transparent" },
          { text: "Scan complete. Terminal ready.", color: "var(--cyan-dim)" },
          { text: 'Type "help" for available commands.', color: "var(--muted)" },
        ],
      };
    case "SET_INPUT":
      return { ...state, input: action.payload };
    case "ADD_OUTPUT":
      return {
        ...state,
        history: [...state.history, ...action.payload],
        input: "",
      };
    case "CLEAR":
      return { ...state, history: [], input: "" };
    case "SET_TYPING":
      return { ...state, typing: action.payload };
    default:
      return state;
  }
}

export default function InteractiveTerminal() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const startedRef = useRef(false);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.history]);

  // IntersectionObserver for autoplay
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          dispatch({ type: "START_AUTOPLAY" });
        }
      },
      { threshold: 0.4 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Autoplay scan lines
  useEffect(() => {
    if (state.mode !== "autoplay") return;

    if (state.scanIndex < SCAN_STEPS.length) {
      const timer = setTimeout(() => {
        dispatch({ type: "ADD_SCAN_LINE" });
      }, 350);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        dispatch({ type: "FINISH_AUTOPLAY" });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.mode, state.scanIndex]);

  const processCommand = useCallback((cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    const prompt = { text: `reazy@portfolio:~$ ${cmd}`, color: "var(--cyan)" };

    if (trimmed === "clear") {
      dispatch({ type: "CLEAR" });
      return;
    }

    if (trimmed === "contact") {
      dispatch({
        type: "ADD_OUTPUT",
        payload: [prompt, { text: "Scrolling to contact...", color: "var(--cyan-dim)" }],
      });
      setTimeout(() => {
        const el = document.getElementById("contact");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 500);
      return;
    }

    if (trimmed === "sudo hire reazy") {
      dispatch({
        type: "ADD_OUTPUT",
        payload: [
          prompt,
          { text: "[sudo] password for visitor: ********", color: "var(--muted)" },
          { text: "Access granted. Redirecting to Fiverr...", color: "var(--cyan)" },
          { text: "Just kidding. But seriously, let's work together!", color: "var(--cyan)" },
        ],
      });
      setTimeout(() => {
        window.open(FIVERR_URL, "_blank");
      }, 2000);
      return;
    }

    // Handle cat projects/xxx
    const catMatch = trimmed.match(/^cat\s+projects\/(.+)$/);
    if (catMatch) {
      const key = `cat projects/${catMatch[1]}`;
      const output = TERMINAL_COMMANDS[key];
      if (output) {
        dispatch({
          type: "ADD_OUTPUT",
          payload: [prompt, ...output.map((t) => ({ text: t, color: "rgba(255,255,255,0.55)" }))],
        });
      } else {
        dispatch({
          type: "ADD_OUTPUT",
          payload: [prompt, { text: `cat: projects/${catMatch[1]}: No such file`, color: "var(--pink)" }],
        });
      }
      return;
    }

    const output = TERMINAL_COMMANDS[trimmed];
    if (output) {
      dispatch({
        type: "ADD_OUTPUT",
        payload: [prompt, ...output.map((t) => ({ text: t, color: "rgba(255,255,255,0.55)" }))],
      });
    } else {
      dispatch({
        type: "ADD_OUTPUT",
        payload: [
          prompt,
          { text: `bash: ${cmd}: command not found. Type 'help'`, color: "#ff3366" },
        ],
      });
    }
  }, []);

  const handleKeyDown = (e) => {
    if (state.mode !== "interactive" || state.typing) return;

    if (e.key === "Enter") {
      e.preventDefault();
      if (state.input.trim()) {
        processCommand(state.input);
      }
    }
  };

  const focusInput = () => {
    if (state.mode === "interactive") {
      inputRef.current?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={focusInput}
      role="application"
      aria-label="Interactive terminal"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "16px 20px",
        fontFamily: "'Courier New', monospace",
        fontSize: 12,
        lineHeight: 1.9,
        minHeight: 280,
        maxHeight: 400,
        position: "relative",
        overflow: "hidden",
        cursor: state.mode === "interactive" ? "text" : "default",
      }}
    >
      {/* macOS dots */}
      <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
      </div>

      {/* Scrollable output */}
      <div style={{ maxHeight: 320, overflowY: "auto", paddingRight: 8 }}>
        {state.history.map((line, i) => (
          <div
            key={i}
            className="term-line"
            style={{
              color: line.color,
              animation: state.mode === "autoplay" ? "fadeIn 0.25s forwards" : undefined,
              opacity: state.mode === "autoplay" ? 0 : 1,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {line.text}
          </div>
        ))}

        {/* Interactive prompt */}
        {state.mode === "interactive" && !state.typing && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: "var(--cyan)", marginRight: 4, flexShrink: 0 }}>
              reazy@portfolio:~$
            </span>
            <span style={{ color: "#e8e8f0" }}>{state.input}</span>
            <span style={{
              color: "var(--cyan)",
              animation: "blink 1s infinite",
              marginLeft: 1,
            }}>
              &#9610;
            </span>
          </div>
        )}

        {/* Cursor during autoplay */}
        {state.mode === "autoplay" && state.scanIndex < SCAN_STEPS.length && (
          <span style={{ color: "var(--cyan)", animation: "blink 1s infinite" }}>&#9610;</span>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Hidden input */}
      {state.mode === "interactive" && (
        <input
          ref={inputRef}
          value={state.input}
          onChange={(e) => dispatch({ type: "SET_INPUT", payload: e.target.value })}
          onKeyDown={handleKeyDown}
          style={{
            position: "absolute",
            opacity: 0,
            width: 0,
            height: 0,
            border: "none",
            outline: "none",
          }}
          autoFocus
          aria-label="Terminal input"
        />
      )}

      {/* Scanlines overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, var(--cyan-ghost) 2px, var(--cyan-ghost) 4px)",
        pointerEvents: "none",
      }} />
    </div>
  );
}
