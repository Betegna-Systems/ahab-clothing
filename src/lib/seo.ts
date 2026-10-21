import { products, type Product } from "@/lib/products";
import { INSTAGRAM_URL, TIKTOK_URL } from "@/lib/social";

export const SITE_NAME = "AHAB Clothing";
export const DEFAULT_TITLE = "AHAB Clothing — Bodycon Tops Made in Addis Ababa";
export const DEFAULT_DESCRIPTION =
  "Fitted bodycon tops — ribbed, one-shoulder, cowl and cutout styles — designed and sewn by hand in Addis Ababa.";
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

const FALLBACK_ORIGIN = "https://ahabclothing.com";

export function getSiteOrigin(request?: Request) {
  const fromEnv = import.meta.env.VITE_SITE_URL;
  if (typeof fromEnv === "string" && fromEnv.trim()) {
    return fromEnv.replace(/\/$/, "");
  }
  if (request) return new URL(request.url).origin;
  return FALLBACK_ORIGIN;
}

export const SITE_URL = getSiteOrigin();

export function absoluteUrl(path = "/", origin = SITE_URL) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized}`;
}

export type SeoOptions = {
  path?: string;
  image?: string;
  type?: "website" | "product" | "article";
  index?: boolean;
  jsonLd?: unknown | unknown[];
  titleTemplate?: boolean;
};

type HeadResult = {
  meta: Array<Record<string, string>>;
  links: Array<{ rel: string; href: string }>;
  scripts: Array<{ type: string; children: string }>;
};

export function jsonLdScript(data: unknown) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(data),
  };
}

export function seo(title: string, description: string, options: SeoOptions = {}): HeadResult {
  const {
    path = "/",
    image = DEFAULT_OG_IMAGE,
    type = "website",
    index = true,
    jsonLd,
    titleTemplate = true,
  } = options;

  const full = titleTemplate ? `${title} — ${SITE_NAME}` : title;
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image);
  const jsonLdItems = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { name: "robots", content: index ? "index, follow" : "noindex, nofollow" },
      { name: "author", content: SITE_NAME },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:image", content: ogImage },
      { property: "og:image:alt", content: full },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_ET" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: full },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: jsonLdItems.map(jsonLdScript),
  };
}

export function organizationJsonLd(origin = SITE_URL) {
  return {
    "@type": "ClothingStore",
    "@id": `${origin}/#organization`,
    name: SITE_NAME,
    url: origin,
    image: absoluteUrl(DEFAULT_OG_IMAGE, origin),
    logo: absoluteUrl("/favicon.svg", origin),
    description: DEFAULT_DESCRIPTION,
    email: "hello@ahabclothing.com",
    telephone: "+251941219026",
    priceRange: "ETB",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Addis Ababa",
      addressCountry: "ET",
    },
    sameAs: [INSTAGRAM_URL, TIKTOK_URL],
  };
}

export function websiteJsonLd(origin = SITE_URL) {
  return {
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    url: origin,
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": `${origin}/#organization` },
  };
}

export function siteGraphJsonLd(origin = SITE_URL) {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(origin), websiteJsonLd(origin)],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[], origin = SITE_URL) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, origin),
    })),
  };
}

export function productJsonLd(product: Product, origin = SITE_URL) {
  const url = absoluteUrl(`/product/${product.slug}`, origin);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.slug,
    url,
    image: product.images.map((src) => absoluteUrl(src, origin)),
    brand: { "@type": "Brand", name: SITE_NAME },
    material: product.fabric,
    color: product.colors.map((color) => color.name),
    category: "Apparel > Tops",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "ETB",
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${origin}/#organization` },
    },
  };
}

export function collectionJsonLd(origin = SITE_URL) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Shop — ${SITE_NAME}`,
    url: absoluteUrl("/shop", origin),
    description: "Shop AHAB bodycon tops — ribbed, cowl, one-shoulder and cutout styles, sewn in Addis Ababa.",
    isPartOf: { "@id": `${origin}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/product/${product.slug}`, origin),
        name: product.name,
      })),
    },
  };
}

export const PUBLIC_SITEMAP_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/shop", changefreq: "weekly", priority: "0.9" },
  { path: "/lookbook", changefreq: "monthly", priority: "0.8" },
  { path: "/custom", changefreq: "monthly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/size-guide", changefreq: "monthly", priority: "0.5" },
  { path: "/shipping", changefreq: "monthly", priority: "0.5" },
  { path: "/returns", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
] as const;

function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildSitemapXml(origin = SITE_URL) {
  const staticUrls = PUBLIC_SITEMAP_PAGES.map(
    (page) => `  <url>
    <loc>${xmlEscape(absoluteUrl(page.path, origin))}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  );

  const productUrls = products.map(
    (product) => `  <url>
    <loc>${xmlEscape(absoluteUrl(`/product/${product.slug}`, origin))}</loc>
    <lastmod>${product.createdAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...productUrls].join("\n")}
</urlset>
`;
}

export function buildRobotsTxt(origin = SITE_URL) {
  return `User-agent: *
Allow: /
Disallow: /checkout
Disallow: /account
Disallow: /wishlist

Sitemap: ${origin}/sitemap.xml
`;
}
