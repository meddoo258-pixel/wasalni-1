import { useEffect } from "react";

export interface OpenGraphConfig {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: "website" | "article" | "business.business";
  locale?: string;
  siteName?: string;
  twitterHandle?: string;
}

export function useOpenGraph(config: OpenGraphConfig) {
  useEffect(() => {
    // Remove existing Open Graph meta tags
    const existingTags = document.querySelectorAll(
      'meta[property^="og:"], meta[name^="twitter:"]'
    );
    existingTags.forEach((tag) => tag.remove());

    // Set document title
    document.title = config.title;

    // Helper function to add meta tag
    const addMeta = (name: string, content: string, isProperty = false) => {
      const meta = document.createElement("meta");
      if (isProperty) {
        meta.setAttribute("property", name);
      } else {
        meta.setAttribute("name", name);
      }
      meta.setAttribute("content", content);
      document.head.appendChild(meta);
    };

    // Add Open Graph tags
    addMeta("og:title", config.title, true);
    addMeta("og:description", config.description, true);
    addMeta("og:type", config.type || "website", true);
    addMeta("og:locale", config.locale || "ar_SA", true);
    addMeta("og:site_name", config.siteName || "وصلني - Wasalni", true);

    if (config.url) {
      addMeta("og:url", config.url, true);
    }

    if (config.image) {
      addMeta("og:image", config.image, true);
      addMeta("og:image:width", "1200", true);
      addMeta("og:image:height", "630", true);
      addMeta("og:image:type", "image/jpeg", true);
    }

    // Add Twitter Card tags
    addMeta("twitter:card", "summary_large_image");
    addMeta("twitter:title", config.title);
    addMeta("twitter:description", config.description);
    if (config.image) {
      addMeta("twitter:image", config.image);
    }
    if (config.twitterHandle) {
      addMeta("twitter:creator", config.twitterHandle);
    }

    // Add canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.remove();
    }
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = config.url || window.location.href;
    document.head.appendChild(link);
  }, [config]);
}
