// Renders scripts/capture.html in headless Chromium and screenshots each
// `.scene` element into assets/<id>.png — the README's targeted feature images.
// Run: npm run build && node scripts/capture.mjs

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { chromium } from "playwright";

const ROOT = process.cwd();
const MIME = {
	".html": "text/html",
	".js": "application/javascript",
	".mjs": "application/javascript",
	".css": "text/css",
	".json": "application/json",
	".map": "application/json",
	".png": "image/png",
	".woff2": "font/woff2",
};

const server = createServer(async (req, res) => {
	try {
		const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
		const path = join(ROOT, url === "/" ? "/scripts/capture.html" : url);
		const data = await readFile(path);
		res.writeHead(200, { "Content-Type": MIME[extname(path)] ?? "application/octet-stream" });
		res.end(data);
	} catch {
		res.writeHead(404);
		res.end("not found");
	}
});

await new Promise((r) => server.listen(0, r));
const { port } = server.address();

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });
await page.goto(`http://localhost:${port}/scripts/capture.html`, { waitUntil: "networkidle" });
await page.evaluate(() => window.__ready);
await page.waitForTimeout(600); // let colour/variable fonts paint

const ids = await page.$$eval(".scene", (els) => els.map((e) => e.id));
for (const id of ids) {
	const el = await page.$(`#${id}`);
	// omitBackground keeps the rounded-corner area outside each card transparent.
	await el.screenshot({ path: `assets/${id}.png`, omitBackground: true });
	console.log("captured assets/%s.png", id);
}

await browser.close();
server.close();
