import { useEffect, useState } from "react";
import { SIGNATURE_STROKES, SIGNATURE_VIEWBOX } from "./signatureData";

const DURATION = 2.6;
const START_DELAY = 0.5;
const TOTAL = SIGNATURE_STROKES.reduce((sum, stroke) => sum + stroke.len, 0);

export default function Signature() {
  const [run, setRun] = useState(0);
  const [drawing, setDrawing] = useState(true);

  useEffect(() => {
    setDrawing(true);
    const timer = setTimeout(
      () => setDrawing(false),
      (DURATION + START_DELAY + 0.3) * 1000
    );
    return () => clearTimeout(timer);
  }, [run]);

  const replay = () => {
    if (!drawing) setRun((value) => value + 1);
  };

  let elapsed = 0;

  return (
    <svg
      key={run}
      role="img"
      aria-label="Uttkarsh's signature"
      viewBox={SIGNATURE_VIEWBOX}
      onMouseEnter={replay}
      onClick={replay}
      className="h-auto w-44 cursor-pointer text-fg sm:w-52"
    >
      {SIGNATURE_STROKES.map((stroke, index) => {
        const delay = START_DELAY + (elapsed / TOTAL) * DURATION;
        const duration = Math.max(0.1, (stroke.len / TOTAL) * DURATION);
        elapsed += stroke.len;

        return (
          <path
            key={index}
            d={stroke.d}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="sig-stroke"
            style={{
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </svg>
  );
}
