import { useState, useEffect } from "react";

export default function useMousePosition() {
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    let rafId;
    let current = { x: -200, y: -200 };
    let dirty = false;

    const onMove = (e) => {
      current = { x: e.clientX, y: e.clientY };
      if (!dirty) {
        dirty = true;
        rafId = requestAnimationFrame(() => {
          setPos(current);
          dirty = false;
        });
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return pos;
}
