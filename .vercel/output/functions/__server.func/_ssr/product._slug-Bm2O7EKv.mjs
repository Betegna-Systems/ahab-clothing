import { r as __toESM } from "../_runtime.mjs";
import { o as products, r as formatPrice, t as cn } from "./utils-Cy3rYMGk.mjs";
import { a as Trigger2, c as require_react, i as Root2, n as Header, r as Item, s as require_jsx_runtime, t as Content2 } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AhabButton } from "./ui-BC5nvihU.mjs";
import { _ as ChevronDown, c as RotateCw, f as MessageCircle, h as Heart, i as Star } from "../_libs/lucide-react.mjs";
import { n as useShop } from "./shop-store-DCXDem3B.mjs";
import { t as Route } from "./product._slug-Ck2YqW6z.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ProductCard } from "./ProductCard-NHEc9YUw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._slug-Bm2O7EKv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var rows = [
	{
		size: "XS",
		bust: [80, 84],
		waist: [62, 66],
		hips: [86, 90]
	},
	{
		size: "S",
		bust: [84, 88],
		waist: [66, 70],
		hips: [90, 94]
	},
	{
		size: "M",
		bust: [88, 94],
		waist: [70, 76],
		hips: [94, 100]
	},
	{
		size: "L",
		bust: [94, 100],
		waist: [76, 82],
		hips: [100, 106]
	},
	{
		size: "XL",
		bust: [100, 108],
		waist: [82, 90],
		hips: [106, 114]
	}
];
function SizeChart({ compact }) {
	const [unit, setUnit] = (0, import_react.useState)("cm");
	const [picked, setPicked] = (0, import_react.useState)(null);
	const f = (n) => unit === "cm" ? n : Math.round(n / 2.54);
	const fmt = ([a, b]) => `${f(a)}–${f(b)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-2",
			children: ["cm", "in"].map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setUnit(u),
				className: cn("label-xs border px-3 py-1.5", unit === u ? "border-primary bg-primary text-primary-foreground" : "border-border"),
				children: u
			}, u))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "mt-4 w-full text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "label-xs text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2",
						children: "Size"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Bust" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Waist" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Hips" })
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				onClick: () => setPicked(r.size),
				className: cn("cursor-pointer border-t border-border transition-colors hover:bg-secondary", picked === r.size && "bg-secondary"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 font-medium",
						children: r.size
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: fmt(r.bust) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: fmt(r.waist) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: fmt(r.hips) })
				]
			}, r.size)) })]
		}),
		!compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 grid gap-6 sm:grid-cols-3",
			children: [
				["Bust", "Measure around the fullest part of your chest, keeping the tape level under your arms."],
				["Waist", "Measure around your natural waistline — the narrowest part of your torso."],
				["Hips", "Stand with feet together and measure around the fullest part of your hips."]
			].map(([t, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-serif text-2xl",
				children: t
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: d
			})] }, t))
		}) : null
	] });
}
var Accordion = Root2;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger2, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = Trigger2.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = Content2.displayName;
var reviews = [
	{
		name: "Meron K.",
		rating: 5,
		text: "The weaving is even more beautiful in person. It fit exactly as the size guide said."
	},
	{
		name: "Liya B.",
		rating: 5,
		text: "Arrived beautifully wrapped within two days in Addis. I felt like I'd been given a gift."
	},
	{
		name: "Dawit M.",
		rating: 4,
		text: "Wonderful quality. I sized up for a more relaxed fit and I'm glad I did."
	}
];
function ProductPage() {
	const { product } = Route.useLoaderData();
	const { addToCart, toggleWishlist, isWished, markViewed, recentlyViewed, setCartOpen } = useShop();
	const [active, setActive] = (0, import_react.useState)(0);
	const [size, setSize] = (0, import_react.useState)(product.sizes.length === 1 ? product.sizes[0] : null);
	const [color, setColor] = (0, import_react.useState)(product.colors[0].name);
	const [zoom, setZoom] = (0, import_react.useState)(null);
	const [spinning, setSpinning] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		markViewed(product.slug);
		setActive(0);
		setSize(product.sizes.length === 1 ? product.sizes[0] : null);
		setColor(product.colors[0].name);
	}, [product.slug]);
	(0, import_react.useEffect)(() => {
		if (!spinning) return;
		const t = setInterval(() => setActive((a) => (a + 1) % product.images.length), 700);
		return () => clearInterval(t);
	}, [spinning, product.images.length]);
	const add = (open = true) => {
		if (!size) {
			toast.error("Please choose a size");
			return false;
		}
		addToCart({
			slug: product.slug,
			size,
			color,
			qty: 1
		});
		if (!open) setCartOpen(false);
		return true;
	};
	const related = products.filter((p) => p.slug !== product.slug && p.categories.some((c) => product.categories.includes(c))).slice(0, 4);
	const viewed = recentlyViewed.filter((s) => s !== product.slug).map((s) => products.find((p) => p.slug === s)).filter(Boolean).slice(0, 4);
	const wished = isWished(product.slug);
	const whatsapp = `https://wa.me/251911000000?text=${encodeURIComponent(`Hello AHAB, I'd like to order the ${product.name} (size ${size ?? "?"}, ${color}).`)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1500px] px-5 py-10 md:px-10 md:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "label-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "link-underline",
						children: "Shop"
					}),
					" / ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: product.name
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col-reverse gap-4 md:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-3 md:flex-col",
						children: product.images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setSpinning(false);
								setActive(i);
							},
							className: cn("w-16 overflow-hidden border md:w-20", active === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src,
								alt: "",
								loading: "lazy",
								className: "aspect-3/4 w-full object-cover"
							})
						}, i))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 cursor-zoom-in overflow-hidden bg-secondary",
						onMouseMove: (e) => {
							const r = e.currentTarget.getBoundingClientRect();
							setZoom({
								x: (e.clientX - r.left) / r.width * 100,
								y: (e.clientY - r.top) / r.height * 100
							});
						},
						onMouseLeave: () => setZoom(null),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: product.images[active],
							alt: product.name,
							className: "fade-in-slow aspect-3/4 w-full object-cover transition-transform duration-300",
							style: zoom ? {
								transform: "scale(1.8)",
								transformOrigin: `${zoom.x}% ${zoom.y}%`
							} : void 0
						}, active), product.images.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSpinning((s) => !s),
							className: "label-xs absolute bottom-4 left-4 flex items-center gap-2 bg-cream/90 px-4 py-2.5 backdrop-blur-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, {
									className: cn("h-3.5 w-3.5", spinning && "animate-spin"),
									strokeWidth: 1.5
								}),
								" ",
								spinning ? "Stop" : "360° view"
							]
						}) : null]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:sticky lg:top-28 lg:self-start",
					children: [
						product.badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-xs text-gold",
							children: product.badge === "bestseller" ? "Best Seller" : product.badge === "new" ? "New Arrival" : "On Sale"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 text-4xl leading-tight md:text-5xl",
							children: product.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg",
								children: formatPrice(product.price)
							}), product.compareAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground line-through",
								children: formatPrice(product.compareAt)
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-2 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex",
									children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("h-3.5 w-3.5", i < product.rating ? "fill-gold text-gold" : "text-border") }, i))
								}),
								product.reviews,
								" reviews"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 leading-relaxed text-muted-foreground",
							children: product.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "label-xs",
								children: ["Colour — ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: color
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex gap-3",
								children: product.colors.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setColor(c.name),
									"aria-label": c.name,
									className: cn("h-9 w-9 rounded-full border-2", color === c.name ? "border-gold" : "border-border"),
									style: { backgroundColor: c.hex }
								}, c.name))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label-xs",
									children: "Size"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex flex-wrap gap-2",
									children: product.sizes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setSize(s),
										className: cn("label-xs min-w-12 border px-4 py-3 transition-colors", size === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"),
										children: s
									}, s))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs text-muted-foreground",
									children: product.inStock ? "In stock — ships in 2–3 days" : "Made to order — 3 weeks"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 grid gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AhabButton, {
										size: "lg",
										className: "flex-1",
										onClick: () => add(),
										children: "Add to Cart"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => toggleWishlist(product.slug),
										"aria-label": "Wishlist",
										className: "grid h-14 w-14 place-items-center border border-border hover:border-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
											className: cn("h-5 w-5", wished && "fill-gold text-gold"),
											strokeWidth: 1.25
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AhabButton, {
									size: "lg",
									variant: "gold",
									onClick: () => {
										if (add(false)) window.location.assign("/checkout");
									},
									children: "Buy Now"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: whatsapp,
									target: "_blank",
									rel: "noreferrer",
									className: "label-xs flex h-14 items-center justify-center gap-2 border border-primary/40 transition-colors hover:bg-secondary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
										className: "h-4 w-4",
										strokeWidth: 1.25
									}), " Order via WhatsApp"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Accordion, {
							type: "single",
							collapsible: true,
							className: "mt-10 border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
									value: "fabric",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
										className: "label-xs",
										children: "Fabric"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
										className: "text-muted-foreground",
										children: product.fabric
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
									value: "care",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
										className: "label-xs",
										children: "Care"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
										className: "text-muted-foreground",
										children: product.care
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
									value: "size",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
										className: "label-xs",
										children: "Size guide"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SizeChart, { compact: true }) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
									value: "delivery",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
										className: "label-xs",
										children: "Delivery"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionContent, {
										className: "space-y-2 text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: "Addis Ababa:"
											}), " 1–2 days, free over ETB 5,000."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: "Across Ethiopia:"
											}), " 3–6 days via trusted courier."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: "International:"
											}), " coming soon — message us to arrange."] })
										]
									})]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-28",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-4xl",
					children: "Reviews"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-6 md:grid-cols-3",
					children: reviews.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border pt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex",
								children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("h-3.5 w-3.5", i < r.rating ? "fill-gold text-gold" : "text-border") }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 font-serif text-xl leading-snug",
								children: [
									"“",
									r.text,
									"”"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "label-xs mt-4 text-muted-foreground",
								children: [r.name, " · Verified buyer"]
							})
						]
					}, r.name))
				})]
			}),
			related.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-28",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-4xl",
					children: "You may also love"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4",
					children: related.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
				})]
			}) : null,
			viewed.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-28",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-4xl",
					children: "Recently viewed"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4",
					children: viewed.map((p) => p && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
				})]
			}) : null
		]
	});
}
//#endregion
export { ProductPage as component };
