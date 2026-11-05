/// <reference types="node" />
import { loadEnv, type Plugin } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Serves /api/* from the same functions Vercel runs in production, so the
// contact form works with a plain `npm run dev`.
const MAX_BODY = 16_000;

function devApi(): Plugin {
  return {
    name: "dev-api",
    apply: "serve",
    configureServer(server) {
      Object.assign(
        process.env,
        loadEnv(server.config.mode, process.cwd(), "")
      );

      server.middlewares.use("/api/contact", async (req, res) => {
        const fail = (status: number) => {
          if (!res.headersSent) res.statusCode = status;
          res.end();
        };

        try {
          if (req.method !== "POST") return fail(405);

          const chunks: Buffer[] = [];
          let size = 0;
          for await (const chunk of req) {
            size += (chunk as Buffer).length;
            if (size > MAX_BODY) return fail(413);
            chunks.push(chunk as Buffer);
          }

          const headers = new Headers();
          for (const [name, value] of Object.entries(req.headers)) {
            if (Array.isArray(value)) {
              value.forEach((v) => headers.append(name, v));
            } else if (value !== undefined) {
              headers.set(name, value);
            }
          }

          const module = await server.ssrLoadModule("/api/contact.ts");
          const response: Response = await module.POST(
            new Request(`http://localhost${req.url ?? ""}`, {
              method: "POST",
              headers,
              body: Buffer.concat(chunks),
            })
          );

          res.statusCode = response.status;
          response.headers.forEach((value, name) => res.setHeader(name, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch {
          // A dropped connection or a bug in the handler must never take the
          // dev server down with it.
          fail(500);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devApi()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "api/**/*.test.ts"],
    css: false,
  },
});
