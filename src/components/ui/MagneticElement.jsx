import React, { useRef, useState } from "react";
import { useCursor } from "../../context/CursorContext";

export default function MagneticElement({
  children,
  as: Tag = "div",
  href,
  onClick,
  style = {},
  strength = 0.25,
  cursorType = "link",
  className,
  ...props
}) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const { setCursorType } = useCursor();

  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    setOffset({
      x: (e.clientX - r.left - r.width / 2) * strength,
      y: (e.clientY - r.top - r.height / 2) * strength,
    });
  };

  const leave = () => {
    setOffset({ x: 0, y: 0 });
    setCursorType("default");
  };

  const enter = () => {
    setCursorType(cursorType);
  };

  const linkProps = {};
  if (Tag === "a") {
    if (href) linkProps.href = href;
    if (href && href.startsWith("http")) {
      linkProps.target = "_blank";
      linkProps.rel = "noopener noreferrer";
    }
  }

  return (
    <Tag
      ref={ref}
      onClick={onClick}
      onMouseMove={move}
      onMouseLeave={leave}
      onMouseEnter={enter}
      className={className}
      {...linkProps}
      {...props}
      style={{
        ...style,
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${offset.x !== 0 ? 1.02 : 1})`,
        transition: offset.x === 0
          ? "transform 0.6s cubic-bezier(0.16,1,0.3,1)"
          : "none",
        display: Tag === "a" ? "inline-block" : style.display,
        textDecoration: Tag === "a" ? "none" : undefined,
      }}
    >
      {children}
    </Tag>
  );
}
