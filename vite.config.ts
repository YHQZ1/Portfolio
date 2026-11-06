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

      const routes = [
        { path: "/api/contact", file: "/api/contact.ts", methods: ["POST"] },
        {
          path: "/api/visits",
          file: "/api/visits.ts",
          methods: ["GET", "POST"],
        },
      ];

      for (const { path, file, methods } of routes) {
        server.middlewares.use(path, async (req, res) => {
          const fail = (status: number) => {
            if (!res.headersSent) res.statusCode = status;
            res.end();
          };

          try {
            const method = req.method ?? "GET";
            if (!methods.includes(method)) return fail(405);

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

            const module = await server.ssrLoadModule(file);
            const hasBody = method !== "GET" && method !== "HEAD";
            const response: Response = await module[method](
              new Request(`http://localhost${req.url ?? ""}`, {
                method,
                headers,
                body: hasBody ? Buffer.concat(chunks) : undefined,
              })
            );

            res.statusCode = response.status;
            response.headers.forEach((value, name) =>
              res.setHeader(name, value)
            );
            res.end(Buffer.from(await response.arrayBuffer()));
          } catch {
            // A dropped connection or a bug in the handler must never take the
            // dev server down with it.
            fail(500);
          }
        });
      }
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
