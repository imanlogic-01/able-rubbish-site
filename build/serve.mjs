// Local preview server that mirrors Vercel's cleanUrls behaviour.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT) || 4321;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };

const exists = async (p) => { try { return (await stat(p)).isFile(); } catch { return false; } };

http
  .createServer(async (req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(dist, url);
    if (url === '/') file = path.join(dist, 'index.html');
    else if (!(await exists(file))) file = path.join(dist, `${url}.html`);
    let status = 200;
    if (!file.startsWith(dist) || !(await exists(file))) { file = path.join(dist, '404.html'); status = 404; }
    res.writeHead(status, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  })
  .listen(port, () => console.log(`Preview: http://localhost:${port}`));
