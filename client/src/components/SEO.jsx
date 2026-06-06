import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = '',
    description = '',
    keywords = '',
    image = '',
    url = '',
    type = 'website',
    noindex = false
}) => {
    const siteTitle = "ResumeCraft – #1 Best Free Resume Maker Online 2026 | AI Resume Builder";
    const defaultDescription = "Create professional, ATS-friendly resumes and cover letters in minutes with ResumeCraft. The top-rated free AI resume builder with MNC-ready templates and instant PDF download.";
    const defaultKeywords = "resume build, resume making, resume maker, cv maker, resume, free resume builder, AI resume builder, CV maker online, ATS friendly resume, professional resume, job resume maker, online resume generator, free CV templates, MNC resume formats, fresher resume builder, experience resume maker, best resume builder 2026";
    const siteUrl = "https://resumecraft.co.in/"; // Updating to a more likely current URL
    const defaultImage = "https://resumecraft.co.in/og-image.png";

    const metaTitle = title ? `${title} | ResumeCraft` : siteTitle;
    const metaDescription = description || defaultDescription;
    const metaKeywords = keywords || defaultKeywords;
    const metaImage = image || defaultImage;

    // Ensure URL doesn't start with a slash if siteUrl has a trailing slash
    const cleanUrl = url ? (url.startsWith('/') ? url.substring(1) : url) : '';
    const metaUrl = `${siteUrl}${cleanUrl}`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow, imageindex" />
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

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Google Site Name Schema */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "ResumeCraft",
                    "alternateName": ["Resume Craft"],
                    "url": siteUrl
                })}
            </script>

            {/* Schema.org JSON-LD for Software Application */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": "ResumeCraft",
                    "applicationCategory": "BusinessApplication",
                    "operatingSystem": "Web",
                    "url": siteUrl,
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                    },
                    "description": defaultDescription,
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.8",
                        "ratingCount": "15884"
                    }
                })}
            </script>

            {/* Breadcrumb Schema */}
            <script type="application/ld+json">
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
            </script>

            {/* ImageObject Schema */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "ImageObject",
                    "contentUrl": metaImage,
                    "description": metaDescription,
                    "name": metaTitle
                })}
            </script>
        </Helmet>
    );
};

export default SEO;
