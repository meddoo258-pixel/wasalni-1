import "dotenv/config";
import express from "express";
import compression from "compression";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Performance: Enable Gzip compression
  app.use(compression());

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Sitemap.xml - Dynamic
  app.get("/sitemap.xml", (_req, res) => {
    const baseUrl = _req.protocol + "://" + _req.get("host");
    const pages = [
      { url: "/", changefreq: "daily", priority: "1.0" },
      { url: "/services", changefreq: "weekly", priority: "0.9" },
      { url: "/pricing", changefreq: "weekly", priority: "0.9" },
      { url: "/about", changefreq: "monthly", priority: "0.8" },
      { url: "/contact", changefreq: "monthly", priority: "0.8" },
      { url: "/subscribe", changefreq: "weekly", priority: "0.9" },
      { url: "/drivers", changefreq: "weekly", priority: "0.8" },
      { url: "/rental", changefreq: "weekly", priority: "0.8" },
      { url: "/corporate", changefreq: "weekly", priority: "0.8" },
      { url: "/coverage", changefreq: "monthly", priority: "0.7" },
    ];
    const today = new Date().toISOString().split("T")[0];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${baseUrl}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("\n")}
</urlset>`;
    res.set("Content-Type", "application/xml");
    res.send(xml);
  });

  // Robots.txt - Dynamic
  app.get("/robots.txt", (_req, res) => {
    const baseUrl = _req.protocol + "://" + _req.get("host");
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /passenger
Disallow: /driver
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`;
    res.set("Content-Type", "text/plain");
    res.send(robotsTxt);
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    // IMPORTANT: serveStatic handles the fallback to index.html for SPA routing
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer().catch(console.error);
