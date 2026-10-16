import heroCampaign from "@/assets/hero-campaign-tops.jpg";
import topSquareNeck from "@/assets/top-square-neck.jpg";
import topSquareNeckCrimson from "@/assets/top-square-neck-crimson.jpg";
import topSquareNeckIvory from "@/assets/top-square-neck-ivory.jpg";
import topOneShoulder from "@/assets/top-one-shoulder.jpg";
import topOneShoulderBlack from "@/assets/top-one-shoulder-black.jpg";
import topOneShoulderBurgundy from "@/assets/top-one-shoulder-burgundy.jpg";
import topCowl from "@/assets/top-cowl.jpg";
import topCowlSand from "@/assets/top-cowl-sand.jpg";
import topCowlBlack from "@/assets/top-cowl-black.jpg";
import topCorset from "@/assets/top-corset.jpg";
import topCorsetIvory from "@/assets/top-corset-ivory.jpg";
import topCorsetBurgundy from "@/assets/top-corset-burgundy.jpg";
import topCutout from "@/assets/top-cutout.jpg";
import topCutoutBlack from "@/assets/top-cutout-black.jpg";
import topCutoutIvory from "@/assets/top-cutout-ivory.jpg";
import topMockNeck from "@/assets/top-mock-neck.jpg";
import topMockNeckChocolate from "@/assets/top-mock-neck-chocolate.jpg";
import topMockNeckBlack from "@/assets/top-mock-neck-black.jpg";
import topHalter from "@/assets/top-halter.jpg";
import topHalterIvory from "@/assets/top-halter-ivory.jpg";
import topHalterBlack from "@/assets/top-halter-black.jpg";
import topOffShoulder from "@/assets/top-off-shoulder.jpg";
import topOffShoulderBlack from "@/assets/top-off-shoulder-black.jpg";
import topOffShoulderIvory from "@/assets/top-off-shoulder-ivory.jpg";
import topCrew from "@/assets/top-crew.jpg";
import topCrewBlack from "@/assets/top-crew-black.jpg";
import topCrewRose from "@/assets/top-crew-rose.jpg";
import topWrap from "@/assets/top-wrap.jpg";
import topWrapChocolate from "@/assets/top-wrap-chocolate.jpg";
import topWrapBlack from "@/assets/top-wrap-black.jpg";
import craftStudio from "@/assets/craft-studio.jpg";

export const images = {
  heroCampaign,
  topSquareNeck,
  topOneShoulder,
  topCowl,
  topCorset,
  topCutout,
  topMockNeck,
  topHalter,
  topOffShoulder,
  topCrew,
  topWrap,
  craftStudio,
};

export type Category = "sleeveless" | "long-sleeve" | "one-shoulder" | "off-shoulder" | "cutout" | "basics";

export type Product = {
  slug: string;
  name: string;
  price: number;
  compareAt?: number;
  categories: Category[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  /** One photo per color, in the same order as `colors`. */
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
    slug: "bete-seamless-crew",
    name: "Bete Seamless Crew",
    price: 1900,
    categories: ["basics", "sleeveless"],
    colors: [
      { name: "Ivory", hex: "#F8F3EB" },
      { name: "Black", hex: "#1A1714" },
      { name: "Dusty Rose", hex: "#D8A79A" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [topCrew, topCrewBlack, topCrewRose],
    description:
      "The top our customers buy in every colour. A seamless crew with a second-skin fit that disappears under a blazer and holds its own on its own.",
    fabric: "Seamless stretch jersey, bonded edges",
    care: "Machine wash cold. Dry flat to keep the shape.",
    badge: "bestseller",
    rating: 5,
    reviews: 46,
    inStock: true,
    createdAt: "2026-08-15",
    popularity: 95,
  },
  {
    slug: "meri-ribbed-square-neck",
    name: "Meri Ribbed Square Neck",
    price: 2400,
    categories: ["sleeveless", "basics"],
    colors: [
      { name: "Black", hex: "#1A1714" },
      { name: "Crimson", hex: "#8E2A2A" },
      { name: "Ivory", hex: "#F8F3EB" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [topSquareNeck, topSquareNeckCrimson, topSquareNeckIvory],
    description:
      "A clean square neck and soft ribbing that follows every line. Cut to skim the body without clinging, from desk to dinner without a change.",
    fabric: "Ribbed stretch knit, viscose-spandex blend",
    care: "Machine wash cold. Dry flat.",
    badge: "bestseller",
    rating: 5,
    reviews: 38,
    inStock: true,
    createdAt: "2026-09-28",
    popularity: 92,
  },
  {
    slug: "saba-one-shoulder-top",
    name: "Saba One-Shoulder Top",
    price: 3200,
    categories: ["one-shoulder"],
    colors: [
      { name: "Ivory", hex: "#F3EADB" },
      { name: "Black", hex: "#1A1714" },
      { name: "Burgundy", hex: "#4A1420" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [topOneShoulder, topOneShoulderBlack, topOneShoulderBurgundy],
    description:
      "One shoulder, full presence. The diagonal neckline does the talking while bonded seams keep the line absolutely clean underneath.",
    fabric: "Premium stretch knit with bonded seams",
    care: "Hand wash cold. Dry flat in shade.",
    badge: "new",
    rating: 5,
    reviews: 21,
    inStock: true,
    createdAt: "2026-10-05",
    popularity: 88,
  },
  {
    slug: "addis-cowl-knit",
    name: "Addis Cowl Knit Top",
    price: 2900,
    categories: ["long-sleeve"],
    colors: [
      { name: "Chocolate", hex: "#2A0D08" },
      { name: "Sand", hex: "#EFE5D6" },
      { name: "Black", hex: "#1A1714" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [topCowl, topCowlSand, topCowlBlack],
    description:
      "A bodycon cut with a softer face. The draped cowl falls exactly where it should, and the brushed rib keeps warm evenings warm.",
    fabric: "Brushed rib knit with fluid drape",
    care: "Machine wash cold, gentle cycle. Dry flat.",
    rating: 4,
    reviews: 16,
    inStock: true,
    createdAt: "2026-09-14",
    popularity: 74,
  },
  {
    slug: "entoto-corset-top",
    name: "Entoto Corset Top",
    price: 4200,
    categories: ["sleeveless"],
    colors: [
      { name: "Soft Gold", hex: "#B68A4C" },
      { name: "Ivory", hex: "#F3EADB" },
      { name: "Burgundy", hex: "#4A1420" },
    ],
    sizes: ["XS", "S", "M", "L"],
    images: [topCorset, topCorsetIvory, topCorsetBurgundy],
    description:
      "Our most sculpting piece. Internal boning and structured seaming hold the silhouette, while the stretch crepe keeps it comfortable all evening.",
    fabric: "Bonded stretch crepe with internal boning",
    care: "Dry clean recommended. Store flat, never folded at the boning.",
    badge: "new",
    rating: 5,
    reviews: 11,
    inStock: true,
    createdAt: "2026-10-08",
    popularity: 84,
  },
  {
    slug: "hana-cutout-top",
    name: "Hana Cutout Top",
    price: 3600,
    compareAt: 4200,
    categories: ["cutout"],
    colors: [
      { name: "Crimson", hex: "#8E2A2A" },
      { name: "Black", hex: "#1A1714" },
      { name: "Ivory", hex: "#F8F3EB" },
    ],
    sizes: ["XS", "S", "M", "L"],
    images: [topCutout, topCutoutBlack, topCutoutIvory],
    description:
      "A single cutout at the waist, placed to catch the light and the eye. Sculpting jersey holds everything else exactly in place.",
    fabric: "Sculpting stretch jersey",
    care: "Hand wash cold. Do not wring the cutout seams.",
    badge: "sale",
    rating: 4,
    reviews: 19,
    inStock: true,
    createdAt: "2026-08-30",
    popularity: 79,
  },
  {
    slug: "selam-mock-neck",
    name: "Selam Mock Neck Top",
    price: 2600,
    categories: ["long-sleeve", "basics"],
    colors: [
      { name: "Sand", hex: "#EFE5D6" },
      { name: "Chocolate", hex: "#2A0D08" },
      { name: "Black", hex: "#1A1714" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [topMockNeck, topMockNeckChocolate, topMockNeckBlack],
    description:
      "The quiet one. A slim mock neck and second-skin rib that layers under everything and looks deliberate standing alone.",
    fabric: "Second-skin rib knit",
    care: "Machine wash cold. Dry flat.",
    rating: 5,
    reviews: 27,
    inStock: true,
    createdAt: "2026-09-02",
    popularity: 81,
  },
  {
    slug: "tsion-halter-top",
    name: "Tsion Halter Top",
    price: 2800,
    categories: ["sleeveless"],
    colors: [
      { name: "Olive", hex: "#6F6B45" },
      { name: "Ivory", hex: "#F3EADB" },
      { name: "Black", hex: "#1A1714" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [topHalter, topHalterIvory, topHalterBlack],
    description:
      "A halter that frames the shoulders and a tie you can knot your way. Cut close through the ribs, easy through the attitude.",
    fabric: "Stretch jersey with self-tie neck",
    care: "Hand wash cold. Untie the neck strap before washing.",
    badge: "new",
    rating: 4,
    reviews: 14,
    inStock: true,
    createdAt: "2026-10-02",
    popularity: 76,
  },
  {
    slug: "meron-off-shoulder-top",
    name: "Meron Off-Shoulder Top",
    price: 3000,
    categories: ["off-shoulder"],
    colors: [
      { name: "Dusty Rose", hex: "#D8A79A" },
      { name: "Black", hex: "#1A1714" },
      { name: "Ivory", hex: "#F3EADB" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [topOffShoulder, topOffShoulderBlack, topOffShoulderIvory],
    description:
      "Sits off the shoulder and stays there. A soft elastic band keeps the neckline honest without pinching, hour after hour.",
    fabric: "Ribbed stretch knit with soft elastic neckline",
    care: "Machine wash cold. Dry flat to protect the neckline.",
    rating: 5,
    reviews: 23,
    inStock: true,
    createdAt: "2026-09-20",
    popularity: 83,
  },
  {
    slug: "abyssinia-wrap-top",
    name: "Abyssinia Wrap Top",
    price: 3400,
    compareAt: 3900,
    categories: ["one-shoulder", "cutout"],
    colors: [
      { name: "Burgundy", hex: "#4A1420" },
      { name: "Chocolate", hex: "#2A0D08" },
      { name: "Black", hex: "#1A1714" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [topWrap, topWrapChocolate, topWrapBlack],
    description:
      "A wrap front drawn across the body like a brushstroke, in our deepest burgundy. The piece for the nights that deserve an entrance.",
    fabric: "Sculpting ponte with wrap front",
    care: "Hand wash cold. Dry flat.",
    badge: "sale",
    rating: 4,
    reviews: 12,
    inStock: true,
    createdAt: "2026-08-08",
    popularity: 71,
  },
];

export const collections = [
  {
    title: "Sleeveless",
    copy: "Square necks, halters and corsets for warm evenings.",
    href: "/shop",
    filter: "sleeveless",
    image: topSquareNeck,
  },
  {
    title: "One Shoulder",
    copy: "Diagonal necklines that do the talking.",
    href: "/shop",
    filter: "one-shoulder",
    image: topOneShoulder,
  },
  {
    title: "Long Sleeve",
    copy: "Cowl, mock neck and rib, cut close to the body.",
    href: "/shop",
    filter: "long-sleeve",
    image: topCowl,
  },
  {
    title: "Cutouts",
    copy: "A single opening, placed to catch the eye.",
    href: "/shop",
    filter: "cutout",
    image: topCutout,
  },
  {
    title: "Everyday Basics",
    copy: "The pieces you will buy in a second colour.",
    href: "/shop",
    filter: "basics",
    image: topCrew,
  },
] as const;

export const testimonials = [
  {
    name: "Selam T.",
    city: "Addis Ababa",
    quote:
      "I wore the Meri square neck to dinner in Bole and two people asked where it was from before the starters arrived. The fit is unreal.",
  },
  {
    name: "Yonas G.",
    city: "Bahir Dar",
    quote:
      "I ordered the Saba one-shoulder for my sister's birthday and she has not taken it off since. Ordered a second one in black two weeks later.",
  },
  {
    name: "Hiwot A.",
    city: "London",
    quote:
      "They took my measurements over video and the corset top arrived fitting like it was made for me. Worth every penny.",
  },
];

export function formatPrice(birr: number) {
  return `ETB ${birr.toLocaleString("en-US")}`;
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
