import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(__dirname, "..", "..", "client", "index.html");

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // In Railway production, the structure is dist/index.js and dist/public/
  // Since index.js is in dist/, public is at the same level as index.js
  const distPath = path.resolve(__dirname, "public");
  
  if (!fs.existsSync(distPath)) {
    console.error(`Could not find the build directory: ${distPath}`);
    // Try fallback to ../public if not found (local testing)
    const fallbackPath = path.resolve(__dirname, "..", "public");
    if (fs.existsSync(fallbackPath)) {
      console.log(`Using fallback dist path: ${fallbackPath}`);
      app.use(express.static(fallbackPath));
      app.use("*", (_req, res) => {
        res.sendFile(path.resolve(fallbackPath, "index.html"));
      });
      return;
    }
  }

  console.log(`Serving static files from: ${distPath}`);
  app.use(express.static(distPath));

  // IMPORTANT: Fallback to index.html for SPA routing
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Index file not found");
    }
  });
}
