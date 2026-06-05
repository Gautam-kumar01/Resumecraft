import puppeteer from 'puppeteer';
import handler from 'serve-handler';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [
    '/',
    '/templates',
    '/cover-letter-templates',
    '/resume-builder-dashboard',
    '/ats-resume-checker-preview',
    '/free-resume-templates',
    '/about',
    '/contact',
    '/terms',
    '/privacy'
];

const PORT = 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const server = http.createServer((request, response) => {
    return handler(request, response, {
        public: DIST_DIR,
        rewrites: [
            { source: '**', destination: '/index.html' }
        ]
    });
});

async function prerender() {
    console.log('Starting prerender server...');
    await new Promise(resolve => server.listen(PORT, resolve));
    console.log(`Server listening on http://localhost:${PORT}`);

    console.log('Launching puppeteer...');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    for (const route of routes) {
        console.log(`Prerendering ${route}...`);
        
        page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
        page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
        
        await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0' });
        
        // Wait an extra second for Helmet to inject tags
        await new Promise(resolve => setTimeout(resolve, 2000));

        const html = await page.content();
        
        page.removeAllListeners('console');
        page.removeAllListeners('pageerror');
        
        // Save to dist/route/index.html or dist/index.html
        const dirPath = path.join(DIST_DIR, route);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        
        fs.writeFileSync(path.join(dirPath, 'index.html'), html);
        console.log(`Saved ${route}`);
    }

    await browser.close();
    server.close();
    console.log('Prerendering complete!');
}

prerender().catch(console.error);
