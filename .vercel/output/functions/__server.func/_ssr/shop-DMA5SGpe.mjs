import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-DMA5SGpe.js
function seo(title, description) {
	const full = `${title} — AHAB Clothing`;
	return { meta: [
		{ title: full },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: full
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] };
}
var CATS = [
	"women",
	"men",
	"kids",
	"traditional",
	"modern"
];
var $$splitComponentImporter = () => import("./shop-F2nwVluS.mjs");
var Route = createFileRoute("/shop")({
	validateSearch: (s) => ({ category: CATS.includes(s.category) ? s.category : void 0 }),
	head: () => seo("Shop", "Shop traditional and modern Ethiopian clothing for women, men and kids — handmade in Addis Ababa."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as n, seo as r, CATS as t };
