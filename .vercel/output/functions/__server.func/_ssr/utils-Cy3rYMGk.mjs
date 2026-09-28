import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-Cy3rYMGk.js
var hero_campaign_default = "/assets/hero-campaign-ByMFUuh_.jpg";
var collection_traditional_default = "/assets/collection-traditional-B_ZMvWOP.jpg";
var collection_women_default = "/assets/collection-women-Cb6t5mms.jpg";
var collection_men_default = "/assets/collection-men-DzuINEMa.jpg";
var collection_kids_default = "/assets/collection-kids-DCgkfB0T.jpg";
var collection_custom_default = "/assets/collection-custom-Bv9ha1ql.jpg";
var product_shawl_default = "/assets/product-shawl-DCLKawGi.jpg";
var product_shirt_default = "/assets/product-shirt-CDy6qruQ.jpg";
var images = {
	heroCampaign: hero_campaign_default,
	collectionTraditional: collection_traditional_default,
	collectionWomen: collection_women_default,
	collectionMen: collection_men_default,
	collectionKids: collection_kids_default,
	collectionCustom: collection_custom_default,
	productShawl: product_shawl_default,
	productShirt: product_shirt_default
};
var products = [
	{
		slug: "tibeb-wrap-gown",
		name: "Tibeb Wrap Gown",
		price: 12400,
		categories: ["women", "traditional"],
		colors: [{
			name: "Ivory",
			hex: "#F3EADB"
		}, {
			name: "Soft Gold",
			hex: "#B68A4C"
		}],
		sizes: [
			"XS",
			"S",
			"M",
			"L",
			"XL"
		],
		images: [
			collection_traditional_default,
			hero_campaign_default,
			product_shawl_default
		],
		description: "A floor-length gown in hand-spun cotton, finished with a wide tibeb border woven thread by thread in Addis Ababa. Cut to fall softly from the shoulder, it moves like something remembered.",
		fabric: "100% hand-spun Ethiopian cotton, hand-woven gold tibeb border",
		care: "Dry clean only. Store folded in the cotton bag provided, away from direct sun.",
		badge: "bestseller",
		rating: 5,
		reviews: 42,
		inStock: true,
		createdAt: "2026-08-02",
		popularity: 98
	},
	{
		slug: "meskel-linen-suit",
		name: "Meskel Linen Suit",
		price: 15800,
		categories: ["men", "modern"],
		colors: [{
			name: "Chocolate",
			hex: "#2A0D08"
		}, {
			name: "Sand",
			hex: "#EFE5D6"
		}],
		sizes: [
			"46",
			"48",
			"50",
			"52",
			"54"
		],
		images: [collection_men_default, product_shirt_default],
		description: "A relaxed two-piece in washed linen with a woven cultural trim along the collar. Tailored loosely through the shoulder so it wears as easily at a wedding as on a Saturday in Kazanchis.",
		fabric: "Washed European linen with hand-woven cotton trim",
		care: "Gentle machine wash at 30°C. Cool iron while slightly damp.",
		badge: "new",
		rating: 5,
		reviews: 17,
		inStock: true,
		createdAt: "2026-09-12",
		popularity: 81
	},
	{
		slug: "addis-draped-dress",
		name: "Addis Draped Dress",
		price: 9600,
		compareAt: 12e3,
		categories: ["women", "modern"],
		colors: [{
			name: "Champagne",
			hex: "#E8D8BE"
		}, {
			name: "Chocolate",
			hex: "#2A0D08"
		}],
		sizes: [
			"XS",
			"S",
			"M",
			"L"
		],
		images: [collection_women_default, hero_campaign_default],
		description: "Liquid silk cut on the bias, gathered at one shoulder and held with a slim hand-braided gold belt. Weightless, unlined, and quietly assured.",
		fabric: "100% sand-washed silk, braided metallic belt",
		care: "Dry clean only. Hang on a padded hanger.",
		badge: "sale",
		rating: 4,
		reviews: 28,
		inStock: true,
		createdAt: "2026-07-19",
		popularity: 90
	},
	{
		slug: "habesha-kemis-heritage",
		name: "Habesha Kemis Heritage",
		price: 18900,
		categories: ["women", "traditional"],
		colors: [{
			name: "Ivory",
			hex: "#F8F3EB"
		}],
		sizes: [
			"S",
			"M",
			"L",
			"XL"
		],
		images: [hero_campaign_default, collection_traditional_default],
		description: "Our most considered piece. Sixty hours of weaving, a full skirt of pleated cotton, and a netela edged in matching gold. Made to be worn at the moments you will talk about for years.",
		fabric: "Hand-woven Ethiopian cotton, gold-thread tibeb",
		care: "Dry clean only. Never machine wash the tibeb border.",
		badge: "bestseller",
		rating: 5,
		reviews: 61,
		inStock: true,
		createdAt: "2026-06-04",
		popularity: 99
	},
	{
		slug: "lalibela-kids-set",
		name: "Lalibela Kids Set",
		price: 4800,
		categories: ["kids", "traditional"],
		colors: [{
			name: "Cream",
			hex: "#F8F3EB"
		}],
		sizes: [
			"2Y",
			"4Y",
			"6Y",
			"8Y",
			"10Y"
		],
		images: [collection_kids_default],
		description: "A soft two-piece for small people, in gauzy cotton with a gentle gold trim. Roomy enough to run in, lovely enough for the family portrait.",
		fabric: "Double-gauze Ethiopian cotton",
		care: "Machine wash cold, tumble dry low.",
		badge: "new",
		rating: 5,
		reviews: 12,
		inStock: true,
		createdAt: "2026-09-20",
		popularity: 64
	},
	{
		slug: "gold-thread-netela",
		name: "Gold Thread Netela",
		price: 3600,
		categories: ["women", "traditional"],
		colors: [{
			name: "Ivory",
			hex: "#F3EADB"
		}, {
			name: "Soft Gold",
			hex: "#B68A4C"
		}],
		sizes: ["One size"],
		images: [product_shawl_default, collection_traditional_default],
		description: "A fine shawl to finish everything. Light as breath, edged with a narrow band of gold tibeb, and endlessly wearable over both our traditional and modern pieces.",
		fabric: "Hand-spun cotton gauze with gold tibeb border",
		care: "Hand wash cold, dry flat in shade.",
		rating: 5,
		reviews: 34,
		inStock: true,
		createdAt: "2026-08-25",
		popularity: 87
	},
	{
		slug: "entoto-linen-shirt",
		name: "Entoto Linen Shirt",
		price: 5400,
		categories: ["men", "modern"],
		colors: [{
			name: "Cream",
			hex: "#F8F3EB"
		}, {
			name: "Clay",
			hex: "#B68A4C"
		}],
		sizes: [
			"S",
			"M",
			"L",
			"XL",
			"XXL"
		],
		images: [product_shirt_default, collection_men_default],
		description: "An easy oversized shirt with a hand-embroidered placket. Worn open over a tee or buttoned for the evening — the piece our customers come back for in a second colour.",
		fabric: "Garment-washed linen, hand-embroidered placket",
		care: "Machine wash 30°C. Line dry.",
		rating: 4,
		reviews: 23,
		inStock: true,
		createdAt: "2026-09-01",
		popularity: 76
	},
	{
		slug: "atelier-bridal-commission",
		name: "Atelier Bridal Commission",
		price: 42e3,
		categories: ["women", "traditional"],
		colors: [{
			name: "Ivory",
			hex: "#F8F3EB"
		}],
		sizes: ["Made to measure"],
		images: [collection_custom_default, hero_campaign_default],
		description: "A commission, not a purchase. Three fittings in our Addis Ababa atelier, a fabric chosen with you, and a silhouette drawn for your body alone.",
		fabric: "Chosen with you — silk, hand-woven cotton or blended organza",
		care: "Dry clean only. Preservation boxing available.",
		rating: 5,
		reviews: 9,
		inStock: true,
		createdAt: "2026-05-10",
		popularity: 70
	}
];
var collections = [
	{
		title: "Traditional",
		copy: "Habesha kemis, netela and tibeb, woven by hand.",
		href: "/shop",
		filter: "traditional",
		image: collection_traditional_default
	},
	{
		title: "Women",
		copy: "Silk, linen and cotton cut for movement.",
		href: "/shop",
		filter: "women",
		image: collection_women_default
	},
	{
		title: "Men",
		copy: "Relaxed tailoring with cultural detail.",
		href: "/shop",
		filter: "men",
		image: collection_men_default
	},
	{
		title: "Kids",
		copy: "Soft gauze pieces for the youngest.",
		href: "/shop",
		filter: "kids",
		image: collection_kids_default
	},
	{
		title: "Custom Designs",
		copy: "Commissioned in our atelier, for you alone.",
		href: "/custom",
		filter: "custom",
		image: collection_custom_default
	}
];
var testimonials = [
	{
		name: "Selam T.",
		city: "Addis Ababa",
		quote: "I wore my kemis to my sister's wedding and three people asked me where it was from before the ceremony even started. The weaving is extraordinary."
	},
	{
		name: "Yonas G.",
		city: "Bahir Dar",
		quote: "The linen suit fits like it was drawn for me. I ordered a second one in sand two weeks later."
	},
	{
		name: "Hiwot A.",
		city: "London",
		quote: "They took my measurements over video, sent fabric photos every few days, and the dress arrived perfect. Worth every birr."
	}
];
function formatPrice(birr) {
	return `ETB ${birr.toLocaleString("en-US")}`;
}
function getProduct(slug) {
	return products.find((p) => p.slug === slug);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
export { images as a, getProduct as i, collections as n, products as o, formatPrice as r, testimonials as s, cn as t };
