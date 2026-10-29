import { useEffect } from "react";

const SITE_URL = "https://uttkarsh.dev";

function setAttribute(selector, attribute, value) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

export function usePageMeta({ title, description, path, noindex = false }) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;

    document.title = title;
    setAttribute('meta[name="description"]', "content", description);
    setAttribute('link[rel="canonical"]', "href", url);
    setAttribute('meta[property="og:url"]', "content", url);
    setAttribute('meta[property="og:title"]', "content", title);
    setAttribute('meta[property="og:description"]', "content", description);
    setAttribute('meta[name="twitter:title"]', "content", title);
    setAttribute('meta[name="twitter:description"]', "content", description);
    setAttribute(
      'meta[name="robots"]',
      "content",
      noindex ? "noindex, follow" : "index, follow"
    );
  }, [title, description, path, noindex]);
}
