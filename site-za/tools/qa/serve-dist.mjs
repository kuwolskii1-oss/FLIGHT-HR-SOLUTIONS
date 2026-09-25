// Serves the production build locally for measurement: the Worker bundle (dist/server/server.js)
// answers page requests through a stub of the cloudflare:workers module, and dist/client is served
// as static files, gzip-compressed like a CDN would. Usage: node serve-dist.mjs <app dir> <port>
import { register } from "node:module";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { pathToFileURL } from "node:url";

const [,, appDir = "../../app", port = "4700"] = process.argv;
const root = path.resolve(appDir);
const clientDir = path.join(root, "dist/client");

// Loader hook: cloudflare:workers -> an empty env (no bindings are needed to render pages).
const hook = `export async function resolve(specifier, context, next) { if (specifier.startsWith('cloudflare:')) return { url: 'data:text/javascript,export const env = {}; export default {};', shortCircuit: true }; return next(specifier, context); }`;
register("data:text/javascript," + encodeURIComponent(hook), pathToFileURL("./"));

const worker = (await import(pathToFileURL(path.join(root, "dist/server/server.js")).href)).default;
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".html": "text/html", ".json": "application/json", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".txt": "text/plain", ".xml": "application/xml" };
const COMPRESS = new Set([".js", ".css", ".html", ".json", ".svg", ".webmanifest", ".txt", ".xml"]);

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);
  const file = path.join(clientDir, decodeURIComponent(url.pathname));
  if (url.pathname !== "/" && file.startsWith(clientDir) && fs.existsSync(file) && fs.statSync(file).isFile()) {
    const ext = path.extname(file);
    let body = fs.readFileSync(file);
    const headers = { "Content-Type": TYPES[ext] || "application/octet-stream", "Cache-Control": "public, max-age=31536000" };
    if (COMPRESS.has(ext) && /gzip/.test(req.headers["accept-encoding"] || "")) { body = zlib.gzipSync(body, { level: 6 }); headers["Content-Encoding"] = "gzip"; }
    headers["Content-Length"] = body.length;
    res.writeHead(200, headers); res.end(body); return;
  }
  try {
    let reqBody;
    if (!["GET", "HEAD"].includes(req.method)) { const chunks = []; for await (const c of req) chunks.push(c); reqBody = Buffer.concat(chunks); }
    const r = await worker.fetch(new Request(url.href, { method: req.method, headers: req.headers, body: reqBody }), {}, { waitUntil() {}, passThroughOnException() {} });
    let body = Buffer.from(await r.arrayBuffer());
    const headers = Object.fromEntries(r.headers.entries());
    delete headers["content-encoding"]; delete headers["content-length"];
    if (/text|json|javascript|xml/.test(headers["content-type"] || "") && /gzip/.test(req.headers["accept-encoding"] || "")) { body = zlib.gzipSync(body, { level: 6 }); headers["content-encoding"] = "gzip"; }
    headers["content-length"] = body.length;
    res.writeHead(r.status, headers); res.end(body);
  } catch (e) { res.writeHead(500, { "Content-Type": "text/plain" }); res.end(String(e && e.stack || e)); console.error(e); }
}).listen(+port, "127.0.0.1", () => console.log(`serving ${root} on http://127.0.0.1:${port}`));
