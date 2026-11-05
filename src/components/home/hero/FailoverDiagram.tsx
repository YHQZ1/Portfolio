import { useEffect, useReducer, useState } from "react";
import { useSound } from "../../../context/useSound";

type Service = "a" | "b";
type Failed = Record<Service, boolean>;

interface State {
  failed: Failed;
  log: string[];
  served: number;
  errors: number;
}

type Action =
  { type: "toggle"; service: Service; down?: boolean } | { type: "tick" };

const ROUTES: Record<Service, string> = {
  a: "M50 150 H166 H236 V70 H306 H368 V150 H430",
  b: "M50 150 H166 H236 V230 H306 H368 V150 H430",
};

const NODE_W = 88;
const NODE_H = 44;

const pickRoute = (failed: Failed): Service | null =>
  !failed.a ? "a" : !failed.b ? "b" : null;

function reducer(state: State, action: Action): State {
  if (action.type === "tick") {
    return pickRoute(state.failed)
      ? { ...state, served: state.served + 3 }
      : { ...state, errors: state.errors + 3 };
  }

  const { service } = action;
  const down = action.down ?? !state.failed[service];
  if (state.failed[service] === down) return state;

  const failed = { ...state.failed, [service]: down };
  const route = pickRoute(failed);
  const lines = [
    down ? `service-${service}   timeout` : `service-${service}   healthy`,
  ];

  if (down && route) lines.push(`gateway   retry → service-${route}`);
  if (down && !route) lines.push("gateway   503 no healthy upstream");
  if (!down && route) lines.push(`gateway → service-${route}   200`);

  return { ...state, failed, log: [...state.log, ...lines].slice(-5) };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

interface NodeProps {
  x: number;
  y: number;
  title: string;
  sub: string;
  failed?: boolean;
  store?: boolean;
  onToggle?: () => void;
  label?: string;
}

function Node({ x, y, title, sub, failed, store, onToggle, label }: NodeProps) {
  const interactive = Boolean(onToggle);

  return (
    <g
      className={interactive ? "group cursor-pointer outline-none" : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? failed : undefined}
      aria-label={label}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (onToggle && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onToggle();
        }
      }}
    >
      {interactive && (
        <rect
          x={x - 10}
          y={y - 10}
          width={NODE_W + 20}
          height={NODE_H + 20}
          fill="transparent"
        />
      )}
      <rect
        x={x}
        y={y}
        width={NODE_W}
        height={NODE_H}
        rx="2"
        strokeWidth="1"
        strokeDasharray={failed ? "4 3" : undefined}
        className={`transition-colors duration-300 ${
          store ? "fill-raised" : "fill-surface"
        } ${
          interactive
            ? "stroke-line-strong group-hover:stroke-fg group-focus-visible:stroke-fg"
            : "stroke-line-strong"
        }`}
      />
      <text
        x={x + 10}
        y={y + 19}
        fontSize="12"
        fontWeight="500"
        className={failed ? "fill-faint" : "fill-fg"}
      >
        {title}
      </text>
      <text x={x + 10} y={y + 34} fontSize="10" className="fill-muted">
        {sub}
      </text>
    </g>
  );
}

function Dots({ path }: { path: string }) {
  return (
    <>
      {[0, 1, 2, 3].map((index) => (
        <circle key={index} r="2.5" className="fill-fg">
          <animateMotion
            dur="2.2s"
            repeatCount="indefinite"
            begin={`${-index * 0.55}s`}
            path={path}
          />
        </circle>
      ))}
    </>
  );
}

export default function FailoverDiagram() {
  const reduced = usePrefersReducedMotion();
  const { play } = useSound();
  const [touched, setTouched] = useState(false);
  const [state, dispatch] = useReducer(
    reducer,
    reduced,
    (initialReduced): State => ({
      failed: { a: initialReduced, b: false },
      log: initialReduced
        ? ["service-a   timeout", "gateway   retry → service-b"]
        : ["gateway → service-a   200   14ms"],
      served: 1204,
      errors: 0,
    })
  );

  const route = pickRoute(state.failed);

  useEffect(() => {
    const timer = setInterval(() => dispatch({ type: "tick" }), 500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (touched || reduced) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const loop = () => {
      timers.push(
        setTimeout(() => {
          dispatch({ type: "toggle", service: "a", down: true });
          timers.push(
            setTimeout(() => {
              dispatch({ type: "toggle", service: "a", down: false });
              loop();
            }, 3400)
          );
        }, 5200)
      );
    };

    loop();
    return () => timers.forEach(clearTimeout);
  }, [touched, reduced]);

  const toggle = (service: Service) => {
    setTouched(true);
    play(state.failed[service] ? "recover" : "fail");
    dispatch({ type: "toggle", service });
  };

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <p className="eyebrow">Live system</p>
        <p className="text-xs text-faint">Click a service to break it</p>
      </div>

      <svg
        role="group"
        aria-label="A small system. Click a service to make it fail."
        viewBox="0 34 480 232"
        className="h-auto w-full"
      >
        {(["a", "b"] as const).map((service) => (
          <path
            key={service}
            d={ROUTES[service]}
            fill="none"
            strokeWidth="1"
            className={`transition-colors duration-300 ${
              route === service ? "stroke-faint" : "stroke-line"
            }`}
          />
        ))}

        {!reduced && route && <Dots key={route} path={ROUTES[route]} />}

        <Node x={6} y={128} title="Client" sub="requests" />
        <Node
          x={122}
          y={128}
          title="Gateway"
          sub={route ? `→ service-${route}` : "503"}
        />
        <Node
          x={262}
          y={48}
          title="Service A"
          sub={
            state.failed.a ? "timeout" : route === "a" ? "200 · 14ms" : "idle"
          }
          failed={state.failed.a}
          onToggle={() => toggle("a")}
          label="Break or restore Service A"
        />
        <Node
          x={262}
          y={208}
          title="Service B"
          sub={
            state.failed.b
              ? "timeout"
              : route === "b"
                ? "200 · 18ms"
                : "standby"
          }
          failed={state.failed.b}
          onToggle={() => toggle("b")}
          label="Break or restore Service B"
        />
        <Node x={386} y={128} title="Database" sub="primary" store />
      </svg>

      <dl className="mt-3 flex items-baseline gap-x-10 border-t border-line pt-3 text-sm">
        <div className="flex items-baseline gap-3">
          <dt className="eyebrow">Served</dt>
          <dd className="text-fg tabular-nums">
            {state.served.toLocaleString()}
          </dd>
        </div>
        <div className="flex items-baseline gap-3">
          <dt className="eyebrow">Errors</dt>
          <dd className="text-fg tabular-nums">
            {state.errors.toLocaleString()}
          </dd>
        </div>
      </dl>

      <pre
        aria-live="off"
        className="mt-3 min-h-[5.25rem] overflow-hidden border-t border-line pt-3 font-mono text-[11px] leading-[1.7] text-muted"
      >
        {state.log.slice(-4).join("\n")}
      </pre>
    </div>
  );
}
