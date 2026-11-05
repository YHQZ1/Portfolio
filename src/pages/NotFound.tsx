import { usePageMeta } from "../hooks/usePageMeta";
import TextLink from "../components/ui/TextLink";

const PAGE_META = {
  title: "Page not found | Uttkarsh Ruparel",
  description: "The page you were looking for does not exist.",
  path: "/",
  noindex: true,
};

export default function NotFound() {
  usePageMeta(PAGE_META);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-5 text-center">
      <h1 className="text-[8rem] leading-none font-extralight tracking-tighter text-fg sm:text-[12rem] lg:text-[16rem]">
        404
      </h1>
      <p className="mt-8 text-lg font-light text-muted sm:text-xl">
        This page doesn't exist.
      </p>
      <div className="mt-8">
        <TextLink to="/">Back home</TextLink>
      </div>
    </main>
  );
}
