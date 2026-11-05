import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import type { Architecture, DiagramNode } from "../../data/projects";
import { getLogo } from "../../data/logos";
import ThemedImage from "../ui/ThemedImage";

const NODE_W = 188;
const NODE_H = 80;
const GAP_X = 48;
const GAP_Y = 28;
const PAD = 16;
const HEAD = 34;

const x = (col: number) => PAD + col * (NODE_W + GAP_X);
const y = (row: number) => PAD + HEAD + row * (NODE_H + GAP_Y);

const NODE_CLASS: Record<NonNullable<DiagramNode["kind"]>, string> = {
  service: "border-line-strong bg-surface",
  store: "border-line-strong bg-raised",
  external: "border-dashed border-line-strong bg-transparent",
};

function route(from: DiagramNode, to: DiagramNode): string {
  const sx = x(from.col);
  const sy = y(from.row);
  const tx = x(to.col);
  const ty = y(to.row);

  if (from.col === to.col) {
    const cx = sx + NODE_W / 2;
    return to.row > from.row
      ? `M${cx} ${sy + NODE_H} V${ty}`
      : `M${cx} ${sy} V${ty + NODE_H}`;
  }

  const x1 = sx + NODE_W;
  const y1 = sy + NODE_H / 2;
  const y2 = ty + NODE_H / 2;

  if (y1 === y2) return `M${x1} ${y1} H${tx}`;

  const xm = tx - GAP_X / 2;
  return `M${x1} ${y1} H${xm} V${y2} H${tx}`;
}

function useRevealed() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}

export default function ArchitectureDiagram({
  architecture,
  title,
}: {
  architecture: Architecture;
  title: string;
}) {
  const markerId = useId();
  const { ref, revealed } = useRevealed();
  const { stages, nodes, edges } = architecture;
  const maxRow = Math.max(...nodes.map((node) => node.row));

  const width = PAD * 2 + stages.length * NODE_W + (stages.length - 1) * GAP_X;
  const height = y(maxRow) + NODE_H + PAD;
  const byId = new Map(nodes.map((node) => [node.id, node]));

  // Everything is laid out in the same coordinate space as the SVG viewBox and
  // converted to percentages / container-query units so text scales with it.
  const pctX = (value: number) => `${(value / width) * 100}%`;
  const pctY = (value: number) => `${(value / height) * 100}%`;
  const unit = (value: number) => `${(value / width) * 100}cqw`;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`${title} architecture diagram`}
      className="relative mx-auto w-full min-w-(--diagram-min-phone) sm:min-w-(--diagram-min)"
      style={
        {
          containerType: "inline-size",
          aspectRatio: `${width} / ${height}`,
          maxWidth: width * 1.3,
          "--diagram-min-phone": `${width}px`,
          "--diagram-min": `${width * 0.75}px`,
        } as CSSProperties
      }
    >
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path
              d="M1 1.5 L8 5 L1 8.5"
              fill="none"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-faint"
            />
          </marker>
        </defs>

        <g
          className="transition-opacity duration-700 motion-reduce:transition-none"
          style={{
            opacity: revealed ? 1 : 0,
            transitionDelay: revealed ? "350ms" : "0ms",
          }}
        >
          {edges.map((edge) => {
            const from = byId.get(edge.from);
            const to = byId.get(edge.to);
            if (!from || !to) return null;
            const d = route(from, to);

            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  d={d}
                  fill="none"
                  strokeWidth="1.2"
                  className="stroke-line-strong"
                  markerEnd={`url(#${markerId})`}
                />
                <path
                  d={d}
                  fill="none"
                  strokeWidth="1.4"
                  className="edge-flow stroke-faint"
                />
              </g>
            );
          })}
        </g>
      </svg>

      {stages.map((stage, index) => (
        <div
          key={stage}
          className="absolute border-b border-line-strong text-faint uppercase"
          style={{
            left: pctX(x(index)),
            top: pctY(PAD),
            width: pctX(NODE_W),
            height: pctY(HEAD - 12),
            fontSize: unit(10.5),
            letterSpacing: "0.15em",
          }}
        >
          {stage}
        </div>
      ))}

      {nodes.map((node) => {
        const icons = (node.icons ?? [])
          .map((name) => ({ name, source: getLogo(name) }))
          .filter((icon) => icon.source !== undefined);

        return (
          <div
            key={node.id}
            className={`absolute flex flex-col items-center justify-center border text-center transition-[opacity,translate,border-color] duration-500 hover:border-fg/50 motion-reduce:transition-none ${
              NODE_CLASS[node.kind ?? "service"]
            } ${revealed ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
            style={{
              left: pctX(x(node.col)),
              top: pctY(y(node.row)),
              width: pctX(NODE_W),
              height: pctY(NODE_H),
              padding: `0 ${unit(12)}`,
              gap: unit(5),
              transitionDelay: revealed
                ? `${node.col * 110 + node.row * 50}ms`
                : "0ms",
            }}
          >
            <span
              className="flex flex-wrap items-center justify-center"
              style={{ gap: unit(7) }}
            >
              {icons.map(({ name, source }) => (
                <span
                  key={name}
                  className="inline-flex shrink-0"
                  style={{ width: unit(18), height: unit(18) }}
                >
                  <ThemedImage
                    light={source!.logo}
                    dark={source!.darkLogo}
                    alt=""
                    className="size-full"
                  />
                </span>
              ))}
              <span
                className="font-medium text-fg"
                style={{ fontSize: unit(14.5), lineHeight: 1.25 }}
              >
                {node.title}
              </span>
            </span>
            {node.sub && (
              <span
                className="text-muted"
                style={{ fontSize: unit(12), lineHeight: 1.3 }}
              >
                {node.sub}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
