import { Helmet } from 'react-helmet-async';

const SEO = ({ 
    title, 
    description, 
    keywords, 
    image, 
    url,
    type = 'website'
}) => {
    const siteTitle = "ResumeCraft - AI Powered Resume Builder";
    const defaultDescription = "Create professional resumes in minutes with ResumeCraft. AI-powered content, MNC-approved templates, and ATS-friendly formats. Get hired by top companies like Google, Amazon, and more.";
    const defaultKeywords = "resume builder, ai resume, free resume templates, cv maker, professional resume, mnc resume formats, ats friendly resume, job search, career growth";
    const siteUrl = "https://resumecraft-beta-blush.vercel.app"; // Using the deployed URL
    const defaultImage = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop";

    const metaTitle = title ? `${title} | ResumeCraft` : siteTitle;
    const metaDescription = description || defaultDescription;
    const metaKeywords = keywords || defaultKeywords;
    const metaImage = image || defaultImage;
    const metaUrl = url ? `${siteUrl}${url}` : siteUrl;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <link rel="canonical" href={metaUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:site_name" content="ResumeCraft" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />
            
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
        </Helmet>
    );
};

export default SEO;
