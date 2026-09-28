import { r as formatPrice, t as cn } from "./utils-Cy3rYMGk.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as Heart, l as Plus } from "../_libs/lucide-react.mjs";
import { n as useShop } from "./shop-store-DCXDem3B.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProductCard-NHEc9YUw.js
var import_jsx_runtime = require_jsx_runtime();
var badgeLabel = {
	new: "New",
	sale: "Sale",
	bestseller: "Best Seller"
};
function ProductCard({ product, priority }) {
	const { toggleWishlist, isWished, addToCart } = useShop();
	const wished = isWished(product.slug);
	const second = product.images[1] ?? product.images[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/product/$slug",
				params: { slug: product.slug },
				className: "block overflow-hidden bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-3/4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.images[0],
						alt: product.name,
						loading: priority ? "eager" : "lazy",
						className: "absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-out group-hover:scale-[1.03] group-hover:opacity-0"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: second,
						alt: "",
						"aria-hidden": true,
						loading: "lazy",
						className: "absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-[1200ms] ease-out group-hover:scale-[1.03] group-hover:opacity-100"
					})]
				})
			}),
			product.badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-xs absolute left-4 top-4 bg-cream px-3 py-1.5 text-foreground",
				children: badgeLabel[product.badge]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					toggleWishlist(product.slug);
					toast(wished ? "Removed from wishlist" : "Saved to wishlist", { description: product.name });
				},
				"aria-label": wished ? "Remove from wishlist" : "Save to wishlist",
				className: "absolute right-4 top-4 grid h-10 w-10 place-items-center bg-cream/85 text-foreground backdrop-blur-sm transition-colors hover:bg-cream",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
					className: cn("h-4 w-4", wished && "fill-gold text-gold"),
					strokeWidth: 1.25
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => addToCart({
					slug: product.slug,
					size: product.sizes[0],
					color: product.colors[0].name,
					qty: 1
				}),
				className: "label-xs absolute inset-x-0 bottom-0 flex h-12 translate-y-full items-center justify-center gap-2 bg-primary text-primary-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
					className: "h-3.5 w-3.5",
					strokeWidth: 1.5
				}), " Quick add"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex items-baseline justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-xl leading-tight",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/product/$slug",
						params: { slug: product.slug },
						children: product.name
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground",
					children: product.inStock ? "In stock" : "Made to order"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: formatPrice(product.price)
					}), product.compareAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground line-through",
						children: formatPrice(product.compareAt)
					}) : null]
				})]
			})
		]
	});
}
//#endregion
export { ProductCard as t };
