import React, { useState, useEffect, useRef, useCallback } from "react";

interface CursorProps {
  size?: number;
}

export const Cursor: React.FC<CursorProps> = ({ size = 60 }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(undefined);
  const previousPos = useRef({ x: -size, y: -size });
  const targetPos = useRef({ x: -size, y: -size });

  const [visible, setVisible] = useState(false);

  const animate = useCallback(() => {
    if (!cursorRef.current) return;

    const currentX = previousPos.current.x;
    const currentY = previousPos.current.y;
    const targetX = targetPos.current.x - size / 2;
    const targetY = targetPos.current.y - size / 2;

    const deltaX = (targetX - currentX) * 0.15;
    const deltaY = (targetY - currentY) * 0.15;

    const newX = currentX + deltaX;
    const newY = currentY + deltaY;

    previousPos.current = { x: newX, y: newY };
    cursorRef.current.style.transform = `translate(${newX}px, ${newY}px)`;

    requestRef.current = requestAnimationFrame(animate);
  }, [size]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setVisible(true);
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = () => setVisible(true);
    const handleMouseLeave = () => setVisible(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    document.body.style.cursor = "none";

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      document.body.style.cursor = "auto";
    };
  }, [animate]);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none rounded-full mix-blend-difference z-[9999] transition-opacity duration-300"
      style={{
        width: size,
        height: size,
        opacity: visible ? 1 : 0,
        top: 0,
        left: 0,
        backgroundColor: "#a0b4ff",
      }}
      aria-hidden="true"
    />
  );
};

export default Cursor;
