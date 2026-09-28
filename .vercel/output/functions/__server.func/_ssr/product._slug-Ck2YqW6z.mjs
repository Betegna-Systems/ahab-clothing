import { i as getProduct } from "./utils-Cy3rYMGk.mjs";
import { M as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._slug-Ck2YqW6z.js
var $$splitComponentImporter = () => import("./product._slug-Bm2O7EKv.mjs");
var $$splitNotFoundComponentImporter = () => import("./product._slug-BBErTPvN.mjs");
var Route = createFileRoute("/product/$slug")({
	loader: ({ params }) => {
		const product = getProduct(params.slug);
		if (!product) throw notFound();
		return { product };
	},
	head: ({ loaderData }) => {
		const p = loaderData?.product;
		if (!p) return {};
		const title = `${p.name} — AHAB Clothing`;
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: p.description.slice(0, 155)
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: p.description.slice(0, 155)
				},
				{
					property: "og:type",
					content: "product"
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				}
			],
			scripts: [{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "Product",
					name: p.name,
					description: p.description,
					brand: {
						"@type": "Brand",
						name: "AHAB Clothing"
					},
					aggregateRating: {
						"@type": "AggregateRating",
						ratingValue: p.rating,
						reviewCount: p.reviews
					},
					offers: {
						"@type": "Offer",
						priceCurrency: "ETB",
						price: p.price,
						availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder"
					}
				})
			}]
		};
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
