// Local fallbacks for suits not yet uploaded to Cloudinary. Once
// `bun run upload:cloudinary` runs, the manifest key takes over automatically.
import suitAlmazPinstripe from "@/assets/suit-almaz-pinstripe.jpg";
import suitAsterBeltedOlive from "@/assets/suit-aster-belted-olive.jpg";
import suitMakedaTuxedoBlack from "@/assets/suit-makeda-tuxedo-black.jpg";
import suitGenetLinenSand from "@/assets/suit-genet-linen-sand.jpg";
import suitBirtukanVelvetBurgundy from "@/assets/suit-birtukan-velvet-burgundy.jpg";
import suitSenaitWideLegGold from "@/assets/suit-senait-wide-leg-gold.jpg";
import {
  cloudinaryAssets,
  getCloudinaryAsset,
  hasAsset,
  buildCloudinaryUrl,
  type CloudinaryAsset,
} from "@/lib/cloudinary";

/** Prefer the Cloudinary manifest entry; fall back to the bundled photo until uploaded. */
function suitImage(manifestKey: string, localFallback: string): string {
  return hasAsset(manifestKey) ? getCloudinaryAsset(manifestKey).optimizedUrl : localFallback;
}

export { cloudinaryAssets, getCloudinaryAsset, buildCloudinaryUrl, type CloudinaryAsset };

export const images = {
  heroSuits: cloudinaryAssets.suitTaituChocolate.optimizedUrl,
  heroCampaign: cloudinaryAssets.heroCampaign.optimizedUrl,
  topSquareNeck: cloudinaryAssets.topSquareNeck.optimizedUrl,
  topOneShoulder: cloudinaryAssets.topOneShoulder.optimizedUrl,
  topCowl: cloudinaryAssets.topCowl.optimizedUrl,
  topCorset: cloudinaryAssets.topCorset.optimizedUrl,
  topCutout: cloudinaryAssets.topCutout.optimizedUrl,
  topMockNeck: cloudinaryAssets.topMockNeck.optimizedUrl,
  topHalter: cloudinaryAssets.topHalter.optimizedUrl,
  topOffShoulder: cloudinaryAssets.topOffShoulder.optimizedUrl,
  topCrew: cloudinaryAssets.topCrew.optimizedUrl,
  topWrap: cloudinaryAssets.topWrap.optimizedUrl,
  craftStudio: cloudinaryAssets.craftStudio.optimizedUrl,
};

export type Category =
  | "sleeveless"
  | "long-sleeve"
  | "one-shoulder"
  | "off-shoulder"
  | "cutout"
  | "basics"
  | "suits"
  | "tops";

/** "tops" matches anything not tagged as a suit, so admin can tag either "tops" or a cut. */
export function inCategory(p: { categories: Category[] }, c: Category): boolean {
  if (c === "tops") return !p.categories.includes("suits");
  return p.categories.includes(c);
}

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
  /** Full Cloudinary image metadata and details for each image */
  imageDetails?: CloudinaryAsset[];
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

const catalogProducts: Product[] = [
  {
    slug: "taitu-double-breasted-suit",
    name: "Taitu Double-Breasted Suit",
    price: 9800,
    categories: ["suits"],
    colors: [{ name: "Chocolate", hex: "#4A2F22" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [cloudinaryAssets.suitTaituChocolate.optimizedUrl],
    description:
      "A sharp-shouldered double-breasted blazer with a nipped waist, paired with high-rise wide-leg trousers. The signature AHAB suit — tailored in Addis Ababa.",
    fabric: "Two-piece suit · stretch wool-blend suiting, fully lined jacket",
    care: "Dry clean recommended. Steam to refresh; do not tumble dry.",
    badge: "new",
    rating: 5,
    reviews: 0,
    inStock: true,
    createdAt: "2026-11-01",
    popularity: 99,
  },
  {
    slug: "menen-single-breasted-suit",
    name: "Menen Single-Breasted Suit",
    price: 8900,
    categories: ["suits"],
    colors: [{ name: "Ivory", hex: "#F3ECDF" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [cloudinaryAssets.suitMenenIvory.optimizedUrl],
    description:
      "A clean one-button blazer and straight-leg trousers in soft ivory. Made for ceremonies, offices and every occasion in between.",
    fabric: "Two-piece suit · stretch wool-blend suiting, fully lined jacket",
    care: "Dry clean recommended. Steam to refresh; do not tumble dry.",
    badge: "new",
    rating: 5,
    reviews: 0,
    inStock: true,
    createdAt: "2026-11-01",
    popularity: 97,
  },
  {
    slug: "zewditu-oversized-suit",
    name: "Zewditu Oversized Suit",
    price: 9200,
    categories: ["suits"],
    colors: [{ name: "Black", hex: "#1A1714" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [cloudinaryAssets.suitZewdituBlack.optimizedUrl],
    description:
      "A relaxed oversized blazer over fluid wide-leg trousers. Effortless power dressing in classic black.",
    fabric: "Two-piece suit · stretch wool-blend suiting, fully lined jacket",
    care: "Dry clean recommended. Steam to refresh; do not tumble dry.",
    badge: "bestseller",
    rating: 5,
    reviews: 0,
    inStock: true,
    createdAt: "2026-10-30",
    popularity: 98,
  },
  {
    slug: "selam-cropped-suit",
    name: "Selam Cropped Suit",
    price: 8400,
    categories: ["suits"],
    colors: [{ name: "Camel", hex: "#C4A27F" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [cloudinaryAssets.suitSelamCamel.optimizedUrl],
    description:
      "A cropped blazer with high-waisted pleated trousers that lengthen the leg. Modern, light and easy to style.",
    fabric: "Two-piece suit · stretch wool-blend suiting, fully lined jacket",
    care: "Dry clean recommended. Steam to refresh; do not tumble dry.",
    badge: "new",
    rating: 5,
    reviews: 0,
    inStock: true,
    createdAt: "2026-10-30",
    popularity: 96,
  },
  {
    slug: "almaz-pinstripe-suit",
    name: "Almaz Pinstripe Suit",
    price: 10600,
    categories: ["suits"],
    colors: [{ name: "Chocolate Pinstripe", hex: "#3E2317" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [suitImage("suit-almaz-pinstripe", suitAlmazPinstripe)],
    description:
      "A nipped-waist pinstripe blazer over slim high-waisted trousers in our signature chocolate. Sharp lines for the days that ask for a statement.",
    fabric: "Two-piece suit · pinstripe wool-blend suiting, fully lined jacket",
    care: "Dry clean recommended. Steam to refresh; do not tumble dry.",
    badge: "new",
    rating: 5,
    reviews: 0,
    inStock: true,
    createdAt: "2026-11-02",
    popularity: 90,
  },
  {
    slug: "aster-belted-wrap-suit",
    name: "Aster Belted Wrap Suit",
    price: 9600,
    categories: ["suits"],
    colors: [{ name: "Olive", hex: "#5A5C3A" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [suitImage("suit-aster-belted-olive", suitAsterBeltedOlive)],
    description:
      "A wrap-front blazer cinched with its own belt, over wide-leg trousers that move like water. Polished, but never stiff.",
    fabric: "Two-piece suit · stretch wool-blend suiting, fully lined jacket",
    care: "Dry clean recommended. Steam to refresh; do not tumble dry.",
    badge: "new",
    rating: 5,
    reviews: 0,
    inStock: true,
    createdAt: "2026-11-02",
    popularity: 89,
  },
  {
    slug: "makeda-tuxedo-suit",
    name: "Makeda Tuxedo Suit",
    price: 10800,
    categories: ["suits"],
    colors: [{ name: "Black", hex: "#1A1714" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [suitImage("suit-makeda-tuxedo-black", suitMakedaTuxedoBlack)],
    description:
      "Satin shawl lapels on a fitted black blazer with straight-leg trousers. The evening suit that outdresses the room.",
    fabric: "Two-piece suit · wool-blend suiting with satin lapels, fully lined jacket",
    care: "Dry clean only. Steam the lapels gently; never iron the satin.",
    badge: "new",
    rating: 5,
    reviews: 0,
    inStock: true,
    createdAt: "2026-11-02",
    popularity: 88,
  },
  {
    slug: "genet-linen-suit",
    name: "Genet Linen Suit",
    price: 8200,
    categories: ["suits"],
    colors: [{ name: "Sand", hex: "#D9CBB6" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [suitImage("suit-genet-linen-sand", suitGenetLinenSand)],
    description:
      "An unstructured linen blazer and cropped trousers in warm sand. Made for Addis mornings that start at a café and end at a ceremony.",
    fabric: "Two-piece suit · breathable linen blend, unstructured blazer",
    care: "Dry clean recommended. Linen softens beautifully with wear.",
    badge: "new",
    rating: 5,
    reviews: 0,
    inStock: true,
    createdAt: "2026-11-02",
    popularity: 86,
  },
  {
    slug: "birtukan-velvet-collar-suit",
    name: "Birtukan Velvet-Collar Suit",
    price: 9900,
    categories: ["suits"],
    colors: [{ name: "Burgundy", hex: "#5A1A26" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [suitImage("suit-birtukan-velvet-burgundy", suitBirtukanVelvetBurgundy)],
    description:
      "Deep burgundy tailored to the waist, finished with a contrasting velvet collar. The suit for the nights that deserve an entrance.",
    fabric: "Two-piece suit · wool-blend suiting with velvet collar, fully lined jacket",
    care: "Dry clean only. Steam the velvet gently; never press it flat.",
    badge: "new",
    rating: 5,
    reviews: 0,
    inStock: true,
    createdAt: "2026-11-02",
    popularity: 87,
  },
  {
    slug: "senait-wide-leg-suit",
    name: "Senait Wide-Leg Suit",
    price: 9400,
    categories: ["suits"],
    colors: [{ name: "Soft Gold", hex: "#C8A668" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [suitImage("suit-senait-wide-leg-gold", suitSenaitWideLegGold)],
    description:
      "Champagne gold with a subtle sheen, cut into a fitted blazer and floor-sweeping wide legs. Our softest way to shine.",
    fabric: "Two-piece suit · lustrous suiting with a subtle sheen, fully lined jacket",
    care: "Dry clean recommended. Steam to refresh; do not tumble dry.",
    badge: "new",
    rating: 5,
    reviews: 0,
    inStock: true,
    createdAt: "2026-11-02",
    popularity: 85,
  },
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
    images: [
      cloudinaryAssets.topCrew.optimizedUrl,
      cloudinaryAssets.topCrewBlack.optimizedUrl,
      cloudinaryAssets.topCrewRose.optimizedUrl,
    ],
    imageDetails: [
      cloudinaryAssets.topCrew,
      cloudinaryAssets.topCrewBlack,
      cloudinaryAssets.topCrewRose,
    ],
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
    images: [
      cloudinaryAssets.topSquareNeck.optimizedUrl,
      cloudinaryAssets.topSquareNeckCrimson.optimizedUrl,
      cloudinaryAssets.topSquareNeckIvory.optimizedUrl,
    ],
    imageDetails: [
      cloudinaryAssets.topSquareNeck,
      cloudinaryAssets.topSquareNeckCrimson,
      cloudinaryAssets.topSquareNeckIvory,
    ],
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
    images: [
      cloudinaryAssets.topOneShoulder.optimizedUrl,
      cloudinaryAssets.topOneShoulderBlack.optimizedUrl,
      cloudinaryAssets.topOneShoulderBurgundy.optimizedUrl,
    ],
    imageDetails: [
      cloudinaryAssets.topOneShoulder,
      cloudinaryAssets.topOneShoulderBlack,
      cloudinaryAssets.topOneShoulderBurgundy,
    ],
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
    images: [
      cloudinaryAssets.topCowl.optimizedUrl,
      cloudinaryAssets.topCowlSand.optimizedUrl,
      cloudinaryAssets.topCowlBlack.optimizedUrl,
    ],
    imageDetails: [
      cloudinaryAssets.topCowl,
      cloudinaryAssets.topCowlSand,
      cloudinaryAssets.topCowlBlack,
    ],
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
    images: [
      cloudinaryAssets.topCorset.optimizedUrl,
      cloudinaryAssets.topCorsetIvory.optimizedUrl,
      cloudinaryAssets.topCorsetBurgundy.optimizedUrl,
    ],
    imageDetails: [
      cloudinaryAssets.topCorset,
      cloudinaryAssets.topCorsetIvory,
      cloudinaryAssets.topCorsetBurgundy,
    ],
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
    images: [
      cloudinaryAssets.topCutout.optimizedUrl,
      cloudinaryAssets.topCutoutBlack.optimizedUrl,
      cloudinaryAssets.topCutoutIvory.optimizedUrl,
    ],
    imageDetails: [
      cloudinaryAssets.topCutout,
      cloudinaryAssets.topCutoutBlack,
      cloudinaryAssets.topCutoutIvory,
    ],
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
    images: [
      cloudinaryAssets.topMockNeck.optimizedUrl,
      cloudinaryAssets.topMockNeckChocolate.optimizedUrl,
      cloudinaryAssets.topMockNeckBlack.optimizedUrl,
    ],
    imageDetails: [
      cloudinaryAssets.topMockNeck,
      cloudinaryAssets.topMockNeckChocolate,
      cloudinaryAssets.topMockNeckBlack,
    ],
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
    images: [
      cloudinaryAssets.topHalter.optimizedUrl,
      cloudinaryAssets.topHalterIvory.optimizedUrl,
      cloudinaryAssets.topHalterBlack.optimizedUrl,
    ],
    imageDetails: [
      cloudinaryAssets.topHalter,
      cloudinaryAssets.topHalterIvory,
      cloudinaryAssets.topHalterBlack,
    ],
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
    images: [
      cloudinaryAssets.topOffShoulder.optimizedUrl,
      cloudinaryAssets.topOffShoulderBlack.optimizedUrl,
      cloudinaryAssets.topOffShoulderIvory.optimizedUrl,
    ],
    imageDetails: [
      cloudinaryAssets.topOffShoulder,
      cloudinaryAssets.topOffShoulderBlack,
      cloudinaryAssets.topOffShoulderIvory,
    ],
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
    images: [
      cloudinaryAssets.topWrap.optimizedUrl,
      cloudinaryAssets.topWrapChocolate.optimizedUrl,
      cloudinaryAssets.topWrapBlack.optimizedUrl,
    ],
    imageDetails: [
      cloudinaryAssets.topWrap,
      cloudinaryAssets.topWrapChocolate,
      cloudinaryAssets.topWrapBlack,
    ],
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

export const products: Product[] = catalogProducts.map((product) => ({
  ...product,
  rating: 0,
  reviews: 0,
}));

export const collections = [
  {
    title: "AHAB Suits",
    copy: "Tailored two-piece suits for women, cut in Addis Ababa.",
    href: "/shop",
    filter: "suits",
    image: cloudinaryAssets.suitTaituChocolate.optimizedUrl,
    imageDetails: undefined,
  },
  {
    title: "Sleeveless",
    copy: "Square necks, halters and corsets for warm evenings.",
    href: "/shop",
    filter: "sleeveless",
    image: cloudinaryAssets.topSquareNeck.optimizedUrl,
    imageDetails: cloudinaryAssets.topSquareNeck,
  },
  {
    title: "One Shoulder",
    copy: "Diagonal necklines that do the talking.",
    href: "/shop",
    filter: "one-shoulder",
    image: cloudinaryAssets.topOneShoulder.optimizedUrl,
    imageDetails: cloudinaryAssets.topOneShoulder,
  },
  {
    title: "Long Sleeve",
    copy: "Cowl, mock neck and rib, cut close to the body.",
    href: "/shop",
    filter: "long-sleeve",
    image: cloudinaryAssets.topCowl.optimizedUrl,
    imageDetails: cloudinaryAssets.topCowl,
  },
  {
    title: "Cutouts",
    copy: "A single opening, placed to catch the eye.",
    href: "/shop",
    filter: "cutout",
    image: cloudinaryAssets.topCutout.optimizedUrl,
    imageDetails: cloudinaryAssets.topCutout,
  },
  {
    title: "Everyday Basics",
    copy: "The pieces you will buy in a second colour.",
    href: "/shop",
    filter: "basics",
    image: cloudinaryAssets.topCrew.optimizedUrl,
    imageDetails: cloudinaryAssets.topCrew,
  },
] as const;

export function formatPrice(birr: number) {
  return `ETB ${birr.toLocaleString("en-US")}`;
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
