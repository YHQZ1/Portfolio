import { useEffect, useId, useRef, useState } from "react";
import {
  SIGNATURE_OUTLINE,
  SIGNATURE_STROKES,
  SIGNATURE_VIEWBOX,
} from "../../data/signature";

const DURATION = 2.6;
const START_DELAY = 0.5;
const TOTAL = SIGNATURE_STROKES.reduce((sum, stroke) => sum + stroke.len, 0);

export default function Signature() {
  const maskId = `signature-${useId().replace(/:/g, "")}`;
  const ref = useRef<SVGSVGElement>(null);
  const [seen, setSeen] = useState(false);
  const [run, setRun] = useState(0);
  const [drawing, setDrawing] = useState(false);

  // Wait until the signature is on screen, so it is drawn in front of the
  // reader instead of while it is still below the fold.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return;
    setDrawing(true);
    const timer = setTimeout(
      () => setDrawing(false),
      (DURATION + START_DELAY + 0.3) * 1000
    );
    return () => clearTimeout(timer);
  }, [run, seen]);

  const replay = () => {
    if (seen && !drawing) setRun((value) => value + 1);
  };

  let elapsed = 0;

  return (
    <svg
      ref={ref}
      key={run}
      role="img"
      aria-label="Uttkarsh's signature"
      viewBox={SIGNATURE_VIEWBOX}
      onMouseEnter={replay}
      onClick={replay}
      className="h-auto w-36 cursor-pointer text-fg sm:w-44"
    >
      <defs>
        <mask id={maskId}>
          <g
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
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
                  className="sig-stroke"
                  style={{
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                    animationPlayState: seen ? "running" : "paused",
                  }}
                />
              );
            })}
          </g>
        </mask>
      </defs>

      <path
        d={SIGNATURE_OUTLINE}
        fill="currentColor"
        fillRule="evenodd"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
