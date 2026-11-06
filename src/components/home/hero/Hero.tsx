import { useTypewriter } from "../../../hooks/useTypewriter";
import SiteStats from "../SiteStats";
import FailoverDiagram from "./FailoverDiagram";
import LocalTime from "./LocalTime";
import WorkTiles from "./WorkTiles";
import { GREETING, TAGLINE_LEAD, TAGLINE_TAIL } from "./content";

export default function Hero() {
  const typed = useTypewriter(GREETING, 80);

  return (
    <section className="flex min-h-[640px] flex-col justify-between gap-14 lg:min-h-[calc(100vh-9rem)]">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col justify-between gap-12 lg:col-span-7">
          <div>
            <p className="mb-8 text-xl font-extralight tracking-tight text-fg sm:text-2xl">
              {typed}
              <span className="ml-1 animate-pulse">|</span>
            </p>

            <h1 className="text-5xl leading-[1.02] font-extralight tracking-tighter text-fg sm:text-6xl xl:text-7xl 2xl:text-8xl">
              {TAGLINE_LEAD}
              <br />
              <span className="text-fg/40">{TAGLINE_TAIL}</span>
            </h1>
          </div>

          <div className="max-w-3xl border-t border-line pt-6">
            <dl className="flex flex-wrap gap-x-14 gap-y-8">
              <div className="max-w-[17rem]">
                <dt className="mb-2 eyebrow">Currently</dt>
                <dd className="text-sm leading-[1.6] text-fg">
                  Software engineering intern at TraceLink
                  <span className="mt-1 block text-muted">
                    Final-year CS student at SIT Pune
                  </span>
                </dd>
              </div>

              <div>
                <dt className="mb-2 eyebrow">Based in</dt>
                <dd className="text-sm leading-[1.6] text-fg">
                  Pune, India
                  <span className="mt-1 block text-muted">
                    <LocalTime />
                  </span>
                </dd>
              </div>

              <SiteStats />
            </dl>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="border border-line bg-surface p-6 sm:p-8">
            <FailoverDiagram />
          </div>
        </div>
      </div>

      <WorkTiles />
    </section>
  );
}
