import React, { useState, useRef } from "react";

const CHARS = "!@#$%^&*_+-=[]{}|;:<>?/~01";

export default function ScrambleText({ text, style = {} }) {
  const [display, setDisplay] = useState(text);
  const timeouts = useRef([]);

  const scramble = () => {
    text.split("").forEach((_, i) => {
      const t1 = setTimeout(() => {
        setDisplay(p => {
          const a = p.split("");
          a[i] = CHARS[Math.floor(Math.random() * CHARS.length)];
          return a.join("");
        });
      }, i * 30);
      const t2 = setTimeout(() => {
        setDisplay(p => {
          const a = p.split("");
          a[i] = text[i];
          return a.join("");
        });
      }, i * 30 + 200);
      timeouts.current.push(t1, t2);
    });
  };

  const reset = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setDisplay(text);
  };

  return (
    <span onMouseEnter={scramble} onMouseLeave={reset} style={{ cursor: "default", ...style }}>
      {display}
    </span>
  );
}
