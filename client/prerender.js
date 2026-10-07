/* global process */
import puppeteer from 'puppeteer';
import handler from 'serve-handler';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { roleTemplates } from './src/data/roleTemplates.js';
import { blogPosts } from './src/data/blogPosts.js';

const routes = [
    '/',
    '/templates',
    '/cover-letter-templates',
    '/resume-builder-dashboard',
    '/ats-resume-checker-preview',
    '/resume-score-checker',
    '/job-match',
    '/job-description-matcher',
    '/fresher-resume-builder',
    '/resume-guide/software-engineer',
    '/resume-guide/data-analyst',
    '/resume-guide/marketing',
    '/interview-prep/software-engineer',
    '/interview-prep/frontend-developer',
    '/interview-prep/backend-developer',
    '/interview-prep/data-analyst',
    '/interview-prep/devops-engineer',
    '/free-resume-templates',
    '/resume-examples',
    ...['software-engineer', 'frontend-developer', 'backend-developer', 'data-analyst', 'data-scientist', 'web-developer', 'bca-fresher', 'mba', 'student', 'internship', 'accountant', 'teacher'].map((slug) => `/resume-examples/${slug}`),
    '/resume-templates',
    ...['ats', 'fresher', 'student', 'software-engineer', 'modern', 'professional'].map((slug) => `/resume-templates/${slug}`),
    ...['resume-builder-for-freshers', 'resume-builder-for-students', 'resume-builder-india', 'resume-format-for-freshers', 'resume-format-for-bca-students', 'resume-format-for-mba-students', 'resume-format-for-engineering-students', 'ats-resume-for-freshers', 'resume-builder-for-career-changers', 'resume-builder-for-internships', 'resume-builder-for-tech-jobs'].map((slug) => `/${slug}`),
    '/cover-letter-examples',
    '/interview-prep',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/cookies',
    ...roleTemplates.map(template => `/resume-template/${template.slug}`),
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

const generateSitemap = () => {
    try {
        console.log('Generating sitemap.xml...');
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
            }
        };

        roleTemplates.forEach(template => {
            if (template.imageUrl) {
                routeImages[`/resume-template/${template.slug}`] = {
                    loc: template.imageUrl,
                    title: template.title || `${template.roleName} Resume Template`,
                    caption: template.subheading || template.description
                };
            }
        });

        blogPosts.forEach(post => {
            if (post.coverImage) {
                routeImages[`/blog/${post.slug}`] = {
                    loc: post.coverImage,
                    title: post.title,
                    caption: post.description
                };
            }
        });

        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${routes.map(route => {
        const changefreq = route === '/' || route.startsWith('/blog') ? 'daily' : 'weekly';
        const priority = route === '/' ? '1.0' : (route === '/blog' || route.startsWith('/resume-template')) ? '0.9' : '0.8';
        const img = routeImages[route];
        const imageTag = img ? `    <image:image>
        <image:loc>${img.loc.replace(/&/g, '&amp;')}</image:loc>
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
        if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });
        fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapContent);
        console.log('Saved sitemap.xml');
    } catch (err) {
        console.error('Error generating sitemap:', err);
    }
};

const server = http.createServer((request, response) => {
    return handler(request, response, {
        public: DIST_DIR,
        rewrites: [
            { source: '**', destination: '/index.html' }
        ]
    });
});

async function prerender() {
    // Generate sitemap immediately
    generateSitemap();

    // Set safety timeout to prevent hanging on CI/Vercel builds
    const safetyTimeout = setTimeout(() => {
        console.warn('Prerender safety timeout reached. Exiting gracefully.');
        try { server.close(); } catch (_) {}
        process.exit(0);
    }, process.env.VERCEL ? 60000 : 180000);

    console.log('Starting prerender server...');
    await new Promise(resolve => server.listen(PORT, resolve));
    console.log(`Server listening on http://localhost:${PORT}`);

    let browser;
    try {
        console.log('Launching puppeteer...');
        const launchOptions = {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
            timeout: 15000,
        };

        if (process.env.VERCEL) {
            try {
                const chromium = (await import('@sparticuz/chromium')).default;
                const puppeteerCore = (await import('puppeteer-core')).default;
                browser = await puppeteerCore.launch({
                    args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
                    defaultViewport: chromium.defaultViewport,
                    executablePath: await chromium.executablePath(),
                    headless: chromium.headless,
                    ignoreHTTPSErrors: true,
                    timeout: 15000,
                });
            } catch (err) {
                console.warn('Sparticuz Chromium launch failed on Vercel, falling back to standard puppeteer:', err.message);
                browser = await puppeteer.launch(launchOptions);
            }
        } else {
            const detectedExecutable = process.env.PUPPETEER_EXECUTABLE_PATH || [
                '/usr/bin/chromium',
                '/usr/bin/chromium-browser',
                '/usr/bin/google-chrome-stable',
                '/usr/bin/google-chrome'
            ].find((candidate) => fs.existsSync(candidate));

            browser = await puppeteer.launch({
                ...launchOptions,
                ...(detectedExecutable ? { executablePath: detectedExecutable } : {}),
            });
        }
    } catch (e) {
        console.warn('Puppeteer launch skipped. SPA build and sitemap are ready:', e.message);
        clearTimeout(safetyTimeout);
        try { server.close(); } catch (_) {}
        process.exit(0);
    }

    const renderRoute = async (route) => {
        let page;
        try {
            page = await browser.newPage();
            page.on('pageerror', err => console.error(`PAGE ERROR ON ${route}:`, err.message));
            page.on('console', msg => {
                if (msg.type() === 'error') console.error(`CONSOLE ERROR ON ${route}:`, msg.text());
            });
            console.log(`Prerendering ${route}...`);
            await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
            await page.waitForFunction(() => {
                const root = document.querySelector('#root');
                return root && root.children && root.children.length > 0 && root.textContent.trim().length > 50;
            }, { timeout: 8000 }).catch(() => {});
            
            const hasRealContent = await page.evaluate(() => {
                const root = document.querySelector('#root');
                return Boolean(root && root.children && root.children.length > 0 && root.textContent.trim().length > 50);
            });

            if (!hasRealContent) {
                console.warn(`Skipping saving ${route} because root content is empty.`);
                return;
            }

            const html = await page.content();
            const filePath = route === '/' ? path.join(DIST_DIR, 'index.html') : path.join(DIST_DIR, `${route}.html`);
            const dirPath = path.dirname(filePath);
            if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
            fs.writeFileSync(filePath, html);
            console.log(`Saved ${route}`);
        } catch (routeErr) {
            console.warn(`Could not prerender ${route}:`, routeErr.message);
        } finally {
            if (page) await page.close().catch(() => {});
        }
    };

    const renderRoutes = routes;

    const concurrency = Math.min(4, renderRoutes.length);
    console.log(`Rendering ${renderRoutes.length} routes...`);
    for (let index = 0; index < renderRoutes.length; index += concurrency) {
        await Promise.all(renderRoutes.slice(index, index + concurrency).map(renderRoute));
    }

    clearTimeout(safetyTimeout);
    try { await browser.close(); } catch (_) {}
    try { server.close(); } catch (_) {}
    console.log('Prerendering complete!');
    process.exit(0);
}

prerender().catch((err) => {
    console.error('Prerender error:', err);
    generateSitemap();
    process.exit(0);
});
