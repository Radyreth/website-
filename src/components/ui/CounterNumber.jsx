import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CounterNumber({ value, suffix = "", prefix = "", duration = 2 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: value,
            duration,
            ease: "power2.out",
            onUpdate: () => setDisplay(Math.round(obj.val)),
          });
        }
      },
      { threshold: 0.3 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} style={{
      fontSize: "clamp(36px, 5vw, 56px)",
      fontWeight: 700,
      color: "#00ffcc",
      fontFamily: "'Courier New', monospace",
      lineHeight: 1,
    }}>
      {prefix}{display}{suffix}
    </span>
  );
}
