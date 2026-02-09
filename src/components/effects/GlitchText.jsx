import React, { useState, useEffect } from "react";

export default function GlitchText({ text, style = {}, as: Tag = "span" }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, Math.random() * 4000 + 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <Tag style={{ position: "relative", display: "inline-block", ...style }}>
      <span style={{ position: "relative", zIndex: 2 }}>{text}</span>
      {glitching && (
        <>
          <span style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            color: "#00ffcc", zIndex: 1,
            clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
            transform: "translate(-3px, -1px)", opacity: 0.8,
          }}>{text}</span>
          <span style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            color: "#ff3366", zIndex: 1,
            clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
            transform: "translate(3px, 1px)", opacity: 0.8,
          }}>{text}</span>
        </>
      )}
    </Tag>
  );
}
