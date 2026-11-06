import { useEffect, useReducer, useState } from "react";
import { useSound } from "../../../context/useSound";
import {
  errorRate,
  hitRate,
  initialState,
  pickRoute,
  rollsNeeded,
  step,
  toggle,
  type Failed,
  type Service,
  type SimState,
} from "./systemSim";

type Action =
  | { type: "tick"; rolls: number[]; now: Date }
  | { type: "toggle"; service: Service; down?: boolean; now: Date };

const ROUTES = {
  a: "M46 150 H204 V70 H262 H316 V150 H468",
  b: "M46 150 H204 V230 H262 H316 V150 H468",
} as const;

const NODE_W = 80;
const NODE_H = 44;

// Incidents the idle panel plays on its own until someone clicks it.
const SCRIPT: Service[] = ["a", "cache", "db", "a"];

function reducer(state: SimState, action: Action): SimState {
  if (action.type === "tick") return step(state, action.rolls, action.now);

  const down = action.down ?? !state.failed[action.service];
  return toggle(state, action.service, down, action.now);
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
          x={x - 8}
          y={y - 8}
          width={NODE_W + 16}
          height={NODE_H + 16}
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
        x={x + 9}
        y={y + 19}
        fontSize="11"
        fontWeight="500"
        className={failed ? "fill-faint" : "fill-fg"}
      >
        {title}
      </text>
      <text x={x + 9} y={y + 34} fontSize="9" className="fill-muted">
        {sub}
      </text>
    </g>
  );
}

function Dots({ path }: { path: string }) {
  return (
    <>
      {[0, 1, 2, 3, 4].map((index) => (
        <circle key={index} r="2.5" className="fill-fg">
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            begin={`${-index * 0.6}s`}
            path={path}
          />
        </circle>
      ))}
    </>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const width = 120;
  const height = 28;
  const max = Math.max(60, ...values);
  const points = values
    .map(
      (value, index) =>
        `${((index / Math.max(1, values.length - 1)) * width).toFixed(1)},${(
          height -
          2 -
          (value / max) * (height - 4)
        ).toFixed(1)}`
    )
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Recent request latency"
      className="h-7 w-full"
    >
      <polyline
        points={points}
        fill="none"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
        className="stroke-muted"
      />
    </svg>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="mb-1 eyebrow">{label}</dt>
      <dd className="text-lg leading-none font-light text-fg tabular-nums">
        {value}
      </dd>
    </div>
  );
}

const FADE = [0.18, 0.28, 0.4, 0.55, 0.7, 0.85, 1];

export default function FailoverDiagram() {
  const reduced = usePrefersReducedMotion();
  const { play } = useSound();
  const [touched, setTouched] = useState(false);
  const [state, dispatch] = useReducer(
    reducer,
    reduced,
    (initialReduced): SimState =>
      initialState(
        { a: initialReduced, b: false, cache: false, db: false } as Failed,
        new Date()
      )
  );

  const route = pickRoute(state.failed);

  useEffect(() => {
    const timer = setInterval(
      () =>
        dispatch({
          type: "tick",
          rolls: Array.from({ length: rollsNeeded }, Math.random),
          now: new Date(),
        }),
      reduced ? 2000 : 600
    );
    return () => clearInterval(timer);
  }, [reduced]);

  useEffect(() => {
    if (touched || reduced) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let index = 0;
    const loop = () => {
      const service = SCRIPT[index % SCRIPT.length];
      index += 1;
      timers.push(
        setTimeout(() => {
          dispatch({ type: "toggle", service, down: true, now: new Date() });
          timers.push(
            setTimeout(() => {
              dispatch({
                type: "toggle",
                service,
                down: false,
                now: new Date(),
              });
              loop();
            }, 3400)
          );
        }, 5200)
      );
    };

    loop();
    return () => timers.forEach(clearTimeout);
  }, [touched, reduced]);

  const flip = (service: Service) => {
    setTouched(true);
    play(state.failed[service] ? "recover" : "fail");
    dispatch({ type: "toggle", service, now: new Date() });
  };

  const errors = errorRate(state);

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <p className="eyebrow">Live system</p>
        <p className="text-xs text-faint">Click a component to break it</p>
      </div>

      <svg
        role="group"
        aria-label="A small system. Click a component to make it fail."
        viewBox="0 34 514 232"
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
          x={104}
          y={128}
          title="Gateway"
          sub={route ? `→ service-${route}` : "503"}
        />
        <Node
          x={222}
          y={48}
          title="Service A"
          sub={
            state.failed.a
              ? "timeout"
              : route === "a"
                ? `${state.p99}ms p99`
                : "idle"
          }
          failed={state.failed.a}
          onToggle={() => flip("a")}
          label="Break or restore Service A"
        />
        <Node
          x={222}
          y={208}
          title="Service B"
          sub={
            state.failed.b
              ? "timeout"
              : route === "b"
                ? `${state.p99}ms p99`
                : "standby"
          }
          failed={state.failed.b}
          onToggle={() => flip("b")}
          label="Break or restore Service B"
        />
        <Node
          x={330}
          y={128}
          title="Cache"
          sub={state.failed.cache ? "bypassed" : `${hitRate(state)}% hits`}
          failed={state.failed.cache}
          onToggle={() => flip("cache")}
          label="Break or restore the cache"
        />
        <Node
          x={428}
          y={128}
          title="Database"
          sub={state.failed.db ? "unreachable" : "primary"}
          store
          failed={state.failed.db}
          onToggle={() => flip("db")}
          label="Break or restore the database"
        />
      </svg>

      <dl className="mt-4 grid grid-cols-3 items-end gap-x-6 gap-y-4 border-t border-line pt-4 sm:grid-cols-[auto_auto_auto_1fr] sm:gap-x-8">
        <Stat label="Req/s" value={String(state.rps)} />
        <Stat label="p99" value={`${state.p99}ms`} />
        <Stat label="Errors" value={`${errors}%`} />
        <div className="col-span-3 sm:col-span-1">
          <Sparkline values={state.samples} />
        </div>
      </dl>

      <ol
        aria-live="off"
        className="mt-4 space-y-0.5 overflow-hidden border-t border-line pt-4 font-mono text-[11px] leading-[1.7] text-muted"
      >
        {state.log.slice(-FADE.length).map((line, index, lines) => (
          <li
            key={`${index}-${line}`}
            className="truncate whitespace-pre"
            style={{ opacity: FADE[FADE.length - lines.length + index] }}
          >
            {line}
          </li>
        ))}
      </ol>
    </div>
  );
}
