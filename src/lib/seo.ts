import { products as staticCatalog, type Product } from "@/lib/products";
import { LOCALE_TAGS, LOCALES, OG_LOCALES, localizePath, type Locale } from "@/lib/i18n/locale";
import { INSTAGRAM_URL, TIKTOK_URL } from "@/lib/social";

export const SITE_NAME = "AHAB Clothing";
export const DEFAULT_TITLE = "AHAB Suits & Tops — Made in Addis Ababa";
export const DEFAULT_DESCRIPTION =
  "Discover tailored women's suits and sculpted tops, designed and sewn by hand in Addis Ababa.";
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

const FALLBACK_ORIGIN = "https://www.ahabclothing.com";

export function getSiteOrigin(request?: Request) {
  const fromEnv = import.meta.env["VITE_SITE_URL"];
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
  /** Page language; sets the canonical /am/ address, og:locale and hreflang alternates. */
  locale?: Locale;
  image?: string | undefined;
  type?: "website" | "product" | "article";
  index?: boolean;
  jsonLd?: unknown | unknown[];
  titleTemplate?: boolean;
};

type HeadResult = {
  meta: Array<Record<string, string>>;
  links: Array<{ rel: string; href: string; hrefLang?: string }>;
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
    locale = "en",
  } = options;

  const full = titleTemplate ? `${title} — ${SITE_NAME}` : title;
  const url = absoluteUrl(localizePath(path, locale));
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
      { property: "og:locale", content: OG_LOCALES[locale] },
      {
        property: "og:locale:alternate",
        content: OG_LOCALES[locale === "en" ? "am" : "en"],
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: full },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [
      { rel: "canonical", href: url },
      // Tell search engines each page exists in both languages.
      ...(index
        ? [
            ...LOCALES.map((l) => ({
              rel: "alternate",
              hrefLang: LOCALE_TAGS[l],
              href: absoluteUrl(localizePath(path, l)),
            })),
            {
              rel: "alternate",
              hrefLang: "x-default",
              href: absoluteUrl(localizePath(path, "en")),
            },
          ]
        : []),
    ],
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

export function productJsonLd(
  product: Product,
  origin = SITE_URL,
  reviews: { reviewerName: string; rating: number; reviewText: string; createdAt: string }[] = [],
) {
  const url = absoluteUrl(`/product/${product.slug}`, origin);
  const aggregateRating =
    reviews.length > 0
      ? {
          "@type": "AggregateRating",
          ratingValue:
            Math.round(
              (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length) * 10,
            ) / 10,
          reviewCount: reviews.length,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined;
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
    category: product.categories.includes("suits") ? "Apparel > Suits" : "Apparel > Tops",
    ...(aggregateRating ? { aggregateRating } : {}),
    ...(reviews.length > 0
      ? {
          review: reviews.map((review) => ({
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
              bestRating: 5,
              worstRating: 1,
            },
            author: { "@type": "Person", name: review.reviewerName },
            reviewBody: review.reviewText,
            datePublished: review.createdAt.slice(0, 10),
          })),
        }
      : {}),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "ETB",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${origin}/#organization` },
    },
  };
}

type CatalogEntry = Pick<Product, "slug" | "name" | "createdAt">;

export function collectionJsonLd(
  origin = SITE_URL,
  products: readonly Pick<Product, "slug" | "name">[] = staticCatalog,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Shop — ${SITE_NAME}`,
    url: absoluteUrl("/shop", origin),
    description:
      "Shop AHAB tailored women's suits and sculpted tops, designed and sewn in Addis Ababa.",
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

/** One <url> per page per language, each listing its translations (hreflang). */
function sitemapEntry(path: string, origin: string, extra: string) {
  const alternates = [...LOCALES, "x-default" as const]
    .map((l) => {
      const href = absoluteUrl(localizePath(path, l === "x-default" ? "en" : l), origin);
      return `    <xhtml:link rel="alternate" hreflang="${l === "x-default" ? l : LOCALE_TAGS[l]}" href="${xmlEscape(href)}"/>`;
    })
    .join("\n");
  return LOCALES.map(
    (locale) => `  <url>
    <loc>${xmlEscape(absoluteUrl(localizePath(path, locale), origin))}</loc>
${alternates}
${extra}
  </url>`,
  );
}

export function buildSitemapXml(
  origin = SITE_URL,
  products: readonly CatalogEntry[] = staticCatalog,
) {
  const staticUrls = PUBLIC_SITEMAP_PAGES.flatMap((page) =>
    sitemapEntry(
      page.path,
      origin,
      `    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`,
    ),
  );

  const productUrls = products.flatMap((product) =>
    sitemapEntry(
      `/product/${product.slug}`,
      origin,
      `    <lastmod>${product.createdAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`,
    ),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...staticUrls, ...productUrls].join("\n")}
</urlset>
`;
}

const PRIVATE_PATHS = ["/checkout", "/account", "/wishlist", "/payment/", "/tracking/"];

export function buildRobotsTxt(origin = SITE_URL) {
  // Private pages are hidden in both languages; /admin/ has no Amharic version.
  const disallow = [
    ...PRIVATE_PATHS.flatMap((path) => LOCALES.map((locale) => localizePath(path, locale))),
    "/admin/",
  ];
  return `User-agent: *
Allow: /
${disallow.map((path) => `Disallow: ${path}`).join("\n")}

Sitemap: ${origin}/sitemap.xml
`;
}
