import { LINKEDIN_PROFILE_URL, SITE, SITE_AUTHOR } from "@/config/site";

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  inLanguage: "de",
  description: SITE.description,
};

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_AUTHOR,
  url: LINKEDIN_PROFILE_URL,
  sameAs: [
    "https://www.linkedin.com/in/michael-meierhoff-b5426458/",
    "https://github.com/mimeonline",
  ],
};
