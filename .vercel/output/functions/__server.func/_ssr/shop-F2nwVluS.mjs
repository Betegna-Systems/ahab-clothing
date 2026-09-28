import { r as __toESM } from "../_runtime.mjs";
import { o as products, t as cn } from "./utils-Cy3rYMGk.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as SlidersHorizontal, t as X } from "../_libs/lucide-react.mjs";
import { t as ProductCard } from "./ProductCard-NHEc9YUw.mjs";
import { n as Route, t as CATS } from "./shop-DMA5SGpe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-F2nwVluS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var allSizes = Array.from(new Set(products.flatMap((p) => p.sizes)));
var allColors = Array.from(new Map(products.flatMap((p) => p.colors).map((c) => [c.name, c])).values());
function Shop() {
	const { category } = Route.useSearch();
	const navigate = useNavigate({ from: "/shop" });
	const [sizes, setSizes] = (0, import_react.useState)([]);
	const [colors, setColors] = (0, import_react.useState)([]);
	const [maxPrice, setMaxPrice] = (0, import_react.useState)(45e3);
	const [sort, setSort] = (0, import_react.useState)("newest");
	const [filtersOpen, setFiltersOpen] = (0, import_react.useState)(false);
	const list = (0, import_react.useMemo)(() => {
		const r = products.filter((p) => (!category || p.categories.includes(category)) && (sizes.length === 0 || p.sizes.some((s) => sizes.includes(s))) && (colors.length === 0 || p.colors.some((c) => colors.includes(c.name))) && p.price <= maxPrice);
		const sorters = {
			newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
			popular: (a, b) => b.popularity - a.popularity,
			"price-asc": (a, b) => a.price - b.price,
			"price-desc": (a, b) => b.price - a.price,
			rated: (a, b) => b.rating - a.rating || b.reviews - a.reviews
		};
		return [...r].sort(sorters[sort]);
	}, [
		category,
		sizes,
		colors,
		maxPrice,
		sort
	]);
	const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
	const Filters = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "label-xs text-muted-foreground",
				children: "Size"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: allSizes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => toggle(sizes, setSizes, s),
					className: cn("label-xs min-w-11 border px-3 py-2 transition-colors", sizes.includes(s) ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"),
					children: s
				}, s))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "label-xs text-muted-foreground",
				children: "Colour"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-3",
				children: allColors.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => toggle(colors, setColors, c.name),
					title: c.name,
					"aria-label": c.name,
					className: cn("h-8 w-8 rounded-full border-2 transition-all", colors.includes(c.name) ? "border-gold scale-110" : "border-border"),
					style: { backgroundColor: c.hex }
				}, c.name))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "label-xs text-muted-foreground",
				children: ["Up to ETB ", maxPrice.toLocaleString()]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "range",
				min: 3e3,
				max: 45e3,
				step: 500,
				value: maxPrice,
				onChange: (e) => setMaxPrice(Number(e.target.value)),
				className: "mt-4 w-full accent-gold"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "label-xs link-underline",
				onClick: () => {
					setSizes([]);
					setColors([]);
					setMaxPrice(45e3);
					navigate({ search: {} });
				},
				children: "Clear all"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-xs text-gold",
					children: "The Collection"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-5xl capitalize md:text-7xl",
					children: category ?? "All pieces"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mt-12 flex justify-center gap-6 overflow-x-auto border-b border-border pb-4 md:gap-10",
				children: [void 0, ...CATS].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => navigate({ search: c ? { category: c } : {} }),
					className: cn("label-xs whitespace-nowrap pb-1 transition-colors", category === c ? "border-b border-primary text-foreground" : "text-muted-foreground hover:text-foreground"),
					children: c ?? "All"
				}, c ?? "all"))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setFiltersOpen(true),
						className: "label-xs flex items-center gap-2 lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, {
							className: "h-4 w-4",
							strokeWidth: 1.25
						}), " Filter"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "label-xs hidden text-muted-foreground lg:block",
						children: [list.length, " pieces"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: sort,
						onChange: (e) => setSort(e.target.value),
						className: "label-xs bg-transparent outline-hidden",
						"aria-label": "Sort by",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "newest",
								children: "Newest"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "popular",
								children: "Popular"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "price-asc",
								children: "Price: low to high"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "price-desc",
								children: "Price: high to low"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "rated",
								children: "Best rated"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-12 lg:grid-cols-[220px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden lg:block",
					children: Filters
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3",
					children: [list.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
						product: p,
						priority: i < 3
					}, p.slug)), list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "col-span-full py-20 text-center font-serif text-2xl text-muted-foreground",
						children: "No pieces match — try clearing a filter."
					}) : null]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("fixed inset-0 z-[70] bg-cream p-6 transition-transform duration-500 lg:hidden", filtersOpen ? "translate-y-0" : "translate-y-full"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-10 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-3xl",
							children: "Filter"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setFiltersOpen(false),
							"aria-label": "Close filters",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								className: "h-5 w-5",
								strokeWidth: 1.25
							})
						})]
					}),
					Filters,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setFiltersOpen(false),
						className: "label-xs mt-12 h-14 w-full bg-primary text-primary-foreground",
						children: [
							"Show ",
							list.length,
							" pieces"
						]
					})
				]
			})
		]
	});
}
//#endregion
export { Shop as component };
