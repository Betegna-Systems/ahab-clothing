import heroCampaign from "@/assets/hero-campaign.jpg";
import collectionTraditional from "@/assets/collection-traditional.jpg";
import collectionWomen from "@/assets/collection-women.jpg";
import collectionMen from "@/assets/collection-men.jpg";
import collectionKids from "@/assets/collection-kids.jpg";
import collectionCustom from "@/assets/collection-custom.jpg";
import productShawl from "@/assets/product-shawl.jpg";
import productShirt from "@/assets/product-shirt.jpg";

export const images = {
  heroCampaign,
  collectionTraditional,
  collectionWomen,
  collectionMen,
  collectionKids,
  collectionCustom,
  productShawl,
  productShirt,
};

export type Category = "women" | "men" | "kids" | "traditional" | "modern";

export type Product = {
  slug: string;
  name: string;
  price: number;
  compareAt?: number;
  categories: Category[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  images: string[];
  description: string;
  fabric: string;
  care: string;
  badge?: "new" | "sale" | "bestseller";
  rating: number;
  reviews: number;
  inStock: boolean;
  createdAt: string;
  popularity: number;
};

export const products: Product[] = [
  {
    slug: "tibeb-wrap-gown",
    name: "Tibeb Wrap Gown",
    price: 12400,
    categories: ["women", "traditional"],
    colors: [
      { name: "Ivory", hex: "#F3EADB" },
      { name: "Soft Gold", hex: "#B68A4C" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [collectionTraditional, heroCampaign, productShawl],
    description:
      "A floor-length gown in hand-spun cotton, finished with a wide tibeb border woven thread by thread in Addis Ababa. Cut to fall softly from the shoulder, it moves like something remembered.",
    fabric: "100% hand-spun Ethiopian cotton, hand-woven gold tibeb border",
    care: "Dry clean only. Store folded in the cotton bag provided, away from direct sun.",
    badge: "bestseller",
    rating: 5,
    reviews: 42,
    inStock: true,
    createdAt: "2026-08-02",
    popularity: 98,
  },
  {
    slug: "meskel-linen-suit",
    name: "Meskel Linen Suit",
    price: 15800,
    categories: ["men", "modern"],
    colors: [
      { name: "Chocolate", hex: "#2A0D08" },
      { name: "Sand", hex: "#EFE5D6" },
    ],
    sizes: ["46", "48", "50", "52", "54"],
    images: [collectionMen, productShirt],
    description:
      "A relaxed two-piece in washed linen with a woven cultural trim along the collar. Tailored loosely through the shoulder so it wears as easily at a wedding as on a Saturday in Kazanchis.",
    fabric: "Washed European linen with hand-woven cotton trim",
    care: "Gentle machine wash at 30°C. Cool iron while slightly damp.",
    badge: "new",
    rating: 5,
    reviews: 17,
    inStock: true,
    createdAt: "2026-09-12",
    popularity: 81,
  },
  {
    slug: "addis-draped-dress",
    name: "Addis Draped Dress",
    price: 9600,
    compareAt: 12000,
    categories: ["women", "modern"],
    colors: [
      { name: "Champagne", hex: "#E8D8BE" },
      { name: "Chocolate", hex: "#2A0D08" },
    ],
    sizes: ["XS", "S", "M", "L"],
    images: [collectionWomen, heroCampaign],
    description:
      "Liquid silk cut on the bias, gathered at one shoulder and held with a slim hand-braided gold belt. Weightless, unlined, and quietly assured.",
    fabric: "100% sand-washed silk, braided metallic belt",
    care: "Dry clean only. Hang on a padded hanger.",
    badge: "sale",
    rating: 4,
    reviews: 28,
    inStock: true,
    createdAt: "2026-07-19",
    popularity: 90,
  },
  {
    slug: "habesha-kemis-heritage",
    name: "Habesha Kemis Heritage",
    price: 18900,
    categories: ["women", "traditional"],
    colors: [{ name: "Ivory", hex: "#F8F3EB" }],
    sizes: ["S", "M", "L", "XL"],
    images: [heroCampaign, collectionTraditional],
    description:
      "Our most considered piece. Sixty hours of weaving, a full skirt of pleated cotton, and a netela edged in matching gold. Made to be worn at the moments you will talk about for years.",
    fabric: "Hand-woven Ethiopian cotton, gold-thread tibeb",
    care: "Dry clean only. Never machine wash the tibeb border.",
    badge: "bestseller",
    rating: 5,
    reviews: 61,
    inStock: true,
    createdAt: "2026-06-04",
    popularity: 99,
  },
  {
    slug: "lalibela-kids-set",
    name: "Lalibela Kids Set",
    price: 4800,
    categories: ["kids", "traditional"],
    colors: [{ name: "Cream", hex: "#F8F3EB" }],
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"],
    images: [collectionKids],
    description:
      "A soft two-piece for small people, in gauzy cotton with a gentle gold trim. Roomy enough to run in, lovely enough for the family portrait.",
    fabric: "Double-gauze Ethiopian cotton",
    care: "Machine wash cold, tumble dry low.",
    badge: "new",
    rating: 5,
    reviews: 12,
    inStock: true,
    createdAt: "2026-09-20",
    popularity: 64,
  },
  {
    slug: "gold-thread-netela",
    name: "Gold Thread Netela",
    price: 3600,
    categories: ["women", "traditional"],
    colors: [
      { name: "Ivory", hex: "#F3EADB" },
      { name: "Soft Gold", hex: "#B68A4C" },
    ],
    sizes: ["One size"],
    images: [productShawl, collectionTraditional],
    description:
      "A fine shawl to finish everything. Light as breath, edged with a narrow band of gold tibeb, and endlessly wearable over both our traditional and modern pieces.",
    fabric: "Hand-spun cotton gauze with gold tibeb border",
    care: "Hand wash cold, dry flat in shade.",
    rating: 5,
    reviews: 34,
    inStock: true,
    createdAt: "2026-08-25",
    popularity: 87,
  },
  {
    slug: "entoto-linen-shirt",
    name: "Entoto Linen Shirt",
    price: 5400,
    categories: ["men", "modern"],
    colors: [
      { name: "Cream", hex: "#F8F3EB" },
      { name: "Clay", hex: "#B68A4C" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [productShirt, collectionMen],
    description:
      "An easy oversized shirt with a hand-embroidered placket. Worn open over a tee or buttoned for the evening — the piece our customers come back for in a second colour.",
    fabric: "Garment-washed linen, hand-embroidered placket",
    care: "Machine wash 30°C. Line dry.",
    rating: 4,
    reviews: 23,
    inStock: true,
    createdAt: "2026-09-01",
    popularity: 76,
  },
  {
    slug: "atelier-bridal-commission",
    name: "Atelier Bridal Commission",
    price: 42000,
    categories: ["women", "traditional"],
    colors: [{ name: "Ivory", hex: "#F8F3EB" }],
    sizes: ["Made to measure"],
    images: [collectionCustom, heroCampaign],
    description:
      "A commission, not a purchase. Three fittings in our Addis Ababa atelier, a fabric chosen with you, and a silhouette drawn for your body alone.",
    fabric: "Chosen with you — silk, hand-woven cotton or blended organza",
    care: "Dry clean only. Preservation boxing available.",
    rating: 5,
    reviews: 9,
    inStock: true,
    createdAt: "2026-05-10",
    popularity: 70,
  },
];

export const collections = [
  {
    title: "Traditional",
    copy: "Habesha kemis, netela and tibeb, woven by hand.",
    href: "/shop",
    filter: "traditional",
    image: collectionTraditional,
  },
  {
    title: "Women",
    copy: "Silk, linen and cotton cut for movement.",
    href: "/shop",
    filter: "women",
    image: collectionWomen,
  },
  {
    title: "Men",
    copy: "Relaxed tailoring with cultural detail.",
    href: "/shop",
    filter: "men",
    image: collectionMen,
  },
  {
    title: "Kids",
    copy: "Soft gauze pieces for the youngest.",
    href: "/shop",
    filter: "kids",
    image: collectionKids,
  },
  {
    title: "Custom Designs",
    copy: "Commissioned in our atelier, for you alone.",
    href: "/custom",
    filter: "custom",
    image: collectionCustom,
  },
] as const;

export const testimonials = [
  {
    name: "Selam T.",
    city: "Addis Ababa",
    quote:
      "I wore my kemis to my sister's wedding and three people asked me where it was from before the ceremony even started. The weaving is extraordinary.",
  },
  {
    name: "Yonas G.",
    city: "Bahir Dar",
    quote:
      "The linen suit fits like it was drawn for me. I ordered a second one in sand two weeks later.",
  },
  {
    name: "Hiwot A.",
    city: "London",
    quote:
      "They took my measurements over video, sent fabric photos every few days, and the dress arrived perfect. Worth every birr.",
  },
];

export function formatPrice(birr: number) {
  return `ETB ${birr.toLocaleString("en-US")}`;
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
