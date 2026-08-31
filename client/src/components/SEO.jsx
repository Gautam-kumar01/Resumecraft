import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({
    title = '',
    description = '',
    keywords = '',
    image = '',
    url = '',
    type = 'website',
    noindex = false
}) => {
    const location = useLocation();
    const siteTitle = "Free AI Resume Builder | ATS-Friendly Resume Maker | ResumeCraft";
    const defaultDescription = "Create a professional, ATS-friendly resume online with ResumeCraft. Use AI guidance, modern templates, live editing, and reliable PDF download to prepare for your next job.";
    const defaultKeywords = "free AI resume builder, ATS-friendly resume maker, online CV maker, professional resume templates, resume PDF download, fresher resume builder, resume builder India";
    const siteUrl = "https://resumecraft.co.in/";
    const defaultImage = "https://resumecraft.co.in/og-image.png";

    const metaTitle = title ? `${title} | ResumeCraft` : siteTitle;
    const metaDescription = description || defaultDescription;
    const metaKeywords = keywords || defaultKeywords;
    const metaImage = image || defaultImage;
    const pathname = location?.pathname || '/';
    const isHomepage = pathname === '/';
    const privateRoute = /^\/(login|register|dashboard|editor|forgot-password|reset-password|cover-letter-editor|cover-letter-builder|applications)(\/|$)/.test(pathname);
    const shouldNoindex = noindex || privateRoute;
    const metaUrl = url
        ? (url.startsWith('http') ? url : new URL(url, siteUrl).toString())
        : new URL(pathname, siteUrl).toString();

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            {shouldNoindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow, max-image-preview:large" />
            )}
            <link rel="canonical" href={metaUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="ResumeCraft" />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Site identity and application schema */}
            {isHomepage && <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "WebSite",
                            "name": "ResumeCraft",
                            "alternateName": ["Resume Craft"],
                            "url": siteUrl
                        },
                        {
                            "@type": "Organization",
                            "name": "ResumeCraft",
                            "url": siteUrl,
                            "logo": `${siteUrl}logo.svg`
                        },
                        {
                            "@type": "SoftwareApplication",
                            "name": "ResumeCraft AI Resume Builder",
                            "applicationCategory": "BusinessApplication",
                            "operatingSystem": "Web",
                            "url": siteUrl,
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            },
                            "description": defaultDescription
                        }
                    ]
                })}
            </script>}

            {/* Breadcrumb schema belongs on internal public pages, not the homepage or private screens. */}
            {!isHomepage && !shouldNoindex && <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": siteUrl
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": title || "Current Page",
                            "item": metaUrl
                        }
                    ]
                })}
            </script>}

            {/* ImageObject Schema */}
            {!shouldNoindex && <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "ImageObject",
                    "contentUrl": metaImage,
                    "description": metaDescription,
                    "name": metaTitle
                })}
            </script>}
        </Helmet>
    );
};

export default SEO;
