import puppeteer from 'puppeteer';
import handler from 'serve-handler';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { blogPosts } from './src/data/blogPosts.js';

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
    '/privacy',
    '/cookies',
    '/resume-template/software-engineer',
    '/resume-template/data-analyst',
    '/resume-template/marketing-manager',
    '/resume-template/fresher',
    '/resume-template/teacher',
    '/resource/resume-formats',
    '/resource/resume-examples',
    '/resource/how-to-write-a-resume',
    '/resource/career-advice',
    '/resource/interview-tips',
    '/blog',
    ...blogPosts.map(post => `/blog/${post.slug}`)
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

    let browser;
    try {
        console.log('Launching puppeteer...');
        if (process.env.VERCEL) {
            const chromium = (await import('@sparticuz/chromium')).default;
            const puppeteerCore = (await import('puppeteer-core')).default;
            browser = await puppeteerCore.launch({
                args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            });
        } else {
            browser = await puppeteer.launch({ 
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }
    } catch (e) {
        console.error('Failed to launch Puppeteer. Skipping prerender:', e);
        server.close();
        return;
    }

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
        
        // Save to dist/route.html (or dist/index.html if route is '/')
        if (route === '/') {
            fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html);
        } else {
            const filePath = path.join(DIST_DIR, `${route}.html`);
            const dirPath = path.dirname(filePath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            fs.writeFileSync(filePath, html);
        }
        console.log(`Saved ${route}`);
    }

    // Route to images mapping for Sitemap
    const routeImages = {
        '/': {
            loc: 'https://resumecraft.co.in/og-image.png',
            title: 'Free AI Resume Builder - ResumeCraft',
            caption: 'ResumeCraft free online resume maker and AI resume builder homepage'
        },
        '/resume-builder-dashboard': {
            loc: 'https://resumecraft.co.in/images/ai-resume-builder-dashboard.webp',
            title: 'Free AI Resume Builder Dashboard',
            caption: 'ResumeCraft AI resume builder dashboard with ATS-friendly resume editor'
        },
        '/ats-resume-checker-preview': {
            loc: 'https://resumecraft.co.in/images/free-online-resume-maker.webp',
            title: 'ATS Resume Checker Preview',
            caption: 'ATS Resume Checker UI preview showing mobile and desktop devices with resume score'
        },
        '/free-resume-templates': {
            loc: 'https://resumecraft.co.in/images/ats-friendly-resume-template.webp',
            title: 'Free ATS-Friendly Resume Templates',
            caption: 'Gallery of professional free ATS-friendly resume templates inside ResumeCraft'
        },
        '/resume-template/software-engineer': {
            loc: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
            title: 'Software Engineer Resume Template',
            caption: 'Professional Software Engineer resume template with pre-filled skills and summaries'
        },
        '/resume-template/data-analyst': {
            loc: 'https://images.unsplash.com/photo-1551288560-66936b61ee2b?q=80&w=800&auto=format&fit=crop',
            title: 'Data Analyst Resume Template',
            caption: 'ATS-optimized Data Analyst resume template with pre-filled skills and SQL highlights'
        },
        '/resume-template/marketing-manager': {
            loc: 'https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=800&auto=format&fit=crop',
            title: 'Marketing Manager Resume Template',
            caption: 'High-impact campaign-focused Marketing Manager resume blueprint'
        },
        '/resume-template/fresher': {
            loc: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
            title: 'Fresher / Entry-Level Resume Template',
            caption: 'Entry-level graduate resume blueprint emphasizing academic projects and skills'
        },
        '/resume-template/teacher': {
            loc: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop',
            title: 'Teacher / Educator Resume Template',
            caption: 'Academic teacher resume blueprint highlighting curriculum development and student growth'
        }
    };

    // Generate Sitemap
    console.log('Generating sitemap.xml...');
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${routes.map(route => {
    const changefreq = route === '/' || route.startsWith('/blog') ? 'daily' : 'weekly';
    const priority = route === '/' ? '1.0' : (route === '/blog' || route.startsWith('/resume-template')) ? '0.9' : '0.8';
    const img = routeImages[route];
    const imageTag = img ? `    <image:image>
        <image:loc>${img.loc}</image:loc>
        <image:title>${img.title}</image:title>
        <image:caption>${img.caption}</image:caption>
    </image:image>` : '';
    return `  <url>
    <loc>https://resumecraft.co.in${route === '/' ? '/' : route}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${imageTag ? '\n' + imageTag : ''}
  </url>`;
}).join('\n')}
</urlset>`;
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapContent);
    console.log('Saved sitemap.xml');

    await browser.close();
    server.close();
    console.log('Prerendering complete!');
}

prerender().catch(console.error);
