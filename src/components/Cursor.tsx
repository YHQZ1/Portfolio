import { useEffect, useRef } from "react";

export default function Cursor() {
  const cursorRef = useRef<HTMLImageElement>(null);

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      ((navigator as Navigator & { msMaxTouchPoints?: number })
        .msMaxTouchPoints ?? 0) > 0);

  useEffect(() => {
    if (isTouchDevice || !cursorRef.current) return;

    const cursor = cursorRef.current;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let rafId: number | null = null;

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = "1";
    };

    const handleLeave = () => {
      cursor.style.opacity = "0";
    };

    const updateCursorPosition = () => {
      cursor.style.left = `${mouseX - 4}px`;
      cursor.style.top = `${mouseY - 2}px`;
      rafId = requestAnimationFrame(updateCursorPosition);
    };

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleLeave);

    updateCursorPosition();

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) {
    return null;
  }

  return (
    <img
      ref={cursorRef}
      src="/custom-cursor.svg"
      className="custom-cursor"
      alt=""
    />
  );
}
