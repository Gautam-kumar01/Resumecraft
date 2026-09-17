/* global process */
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
    '/resume-template/software-engineer',
    '/resume-template/data-analyst',
    '/resume-template/marketing-manager',
    '/resume-template/fresher',
    '/resume-template/teacher',
    '/resume-template/frontend-developer',
    '/resume-template/backend-developer',
    '/resume-template/product-manager',
    '/resume-template/hr-manager',
    '/resume-template/ai-engineer',
    '/resume-template/machine-learning-engineer',
    '/resume-template/devops-engineer',
    '/resume-template/cloud-engineer',
    '/resume-template/qa-test-engineer',
    '/resume-template/cybersecurity-analyst',
    '/resume-template/full-stack-developer',
    '/resume-template/ui-ux-designer',
    '/resume-template/business-analyst',
    '/resume-template/project-manager',
    '/resume-template/digital-marketing-executive',
    '/resume-template/customer-support-specialist',
    '/resource/resume-formats',
    '/resource/resume-examples',
    '/resource/how-to-write-a-resume',
    '/resource/career-advice',
    '/resource/interview-tips',
    '/blog',
    ...blogPosts.map(post => `/blog/${post.slug}`)
];

// Vercel's serverless build environment has much less CPU than local builds.
// Keep the complete route inventory for sitemap generation, but prerender the
// highest-value landing pages there. Local builds still prerender every route.
const vercelCriticalRoutes = new Set([
    '/', '/templates', '/free-resume-templates', '/resume-examples',
    '/resume-templates', '/cover-letter-templates', '/cover-letter-examples',
    '/resume-score-checker', '/job-description-matcher', '/fresher-resume-builder',
    '/job-match', '/interview-prep', '/interview-prep/software-engineer',
    '/interview-prep/frontend-developer', '/interview-prep/backend-developer',
    '/interview-prep/data-analyst', '/interview-prep/devops-engineer',
    '/resume-guide/software-engineer', '/resume-guide/data-analyst',
    '/resume-guide/marketing', '/about', '/contact', '/blog',
]);
const renderRoutes = process.env.VERCEL ? routes.filter((route) => vercelCriticalRoutes.has(route)) : routes;

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
            const detectedExecutable = process.env.PUPPETEER_EXECUTABLE_PATH || [
                '/usr/bin/chromium',
                '/usr/bin/chromium-browser',
                '/usr/bin/google-chrome-stable',
                '/usr/bin/google-chrome'
            ].find((candidate) => fs.existsSync(candidate));

            browser = await puppeteer.launch({
                headless: true,
                ...(detectedExecutable ? { executablePath: detectedExecutable } : {}),
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
            });
        }
    } catch (e) {
        console.error('Failed to launch Puppeteer. Failing the build:', e);
        server.close();
        process.exit(1);
    }

    const renderRoute = async (route) => {
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', request => {
            if (['image', 'font', 'media'].includes(request.resourceType())) request.abort();
            else request.continue();
        });
        try {
            console.log(`Prerendering ${route}...`);
            await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
            // Wait only for the lazy route and Helmet title; never wait on media or a fixed timer.
            await page.waitForFunction(() => document.title && document.title !== 'ResumeCraft' && document.querySelector('#root')?.textContent?.trim(), { timeout: 10000 }).catch(() => {});
            const html = await page.content();
            const filePath = route === '/' ? path.join(DIST_DIR, 'index.html') : path.join(DIST_DIR, `${route}.html`);
            const dirPath = path.dirname(filePath);
            if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
            fs.writeFileSync(filePath, html);
            console.log(`Saved ${route}`);
        } finally {
            await page.close();
        }
    };
    const concurrency = Math.min(6, routes.length);
    console.log(`Rendering ${renderRoutes.length} of ${routes.length} routes${process.env.VERCEL ? ' on Vercel' : ''}...`);
    for (let index = 0; index < renderRoutes.length; index += concurrency) {
        await Promise.all(renderRoutes.slice(index, index + concurrency).map(renderRoute));
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
        },
        '/resume-template/frontend-developer': {
            loc: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
            title: 'Frontend Developer Resume Template',
            caption: 'Frontend developer resume blueprint for React, TypeScript, accessibility, and performance work'
        },
        '/resume-template/backend-developer': {
            loc: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
            title: 'Backend Developer Resume Template',
            caption: 'Backend developer resume blueprint for APIs, databases, reliability, and cloud systems'
        },
        '/resume-template/product-manager': {
            loc: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=800&auto=format&fit=crop',
            title: 'Product Manager Resume Template',
            caption: 'Product manager resume blueprint for discovery, roadmaps, experiments, and launches'
        },
        '/resume-template/hr-manager': {
            loc: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop',
            title: 'HR Manager Resume Template',
            caption: 'HR manager resume blueprint for hiring, onboarding, employee experience, and people operations'
        }
    };

    // Dynamically add blog post images to the sitemap
    blogPosts.forEach(post => {
        routeImages[`/blog/${post.slug}`] = {
            loc: post.coverImage,
            title: post.title,
            caption: post.description
        };
    });

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
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapContent);
    console.log('Saved sitemap.xml');

    await browser.close();
    server.close();
    console.log('Prerendering complete!');
}

prerender().catch(console.error);
