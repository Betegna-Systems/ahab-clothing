import { r as __toESM } from "../_runtime.mjs";
import { o as products, r as formatPrice, t as cn } from "./utils-Cy3rYMGk.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as AhabLink } from "./ui-BC5nvihU.mjs";
import { d as Minus, g as Facebook, h as Heart, l as Plus, m as Instagram, n as User, o as ShoppingBag, p as Menu, s as Search, t as X, u as Music2 } from "../_libs/lucide-react.mjs";
import { n as useShop, t as ShopProvider } from "./shop-store-DCXDem3B.mjs";
import { t as Route$4 } from "./product._slug-Ck2YqW6z.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as Route$5, r as seo } from "./shop-DMA5SGpe.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BSNxhhDD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CNR9JXtB.css";
function SearchDialog() {
	const { searchOpen, setSearchOpen } = useShop();
	const [q, setQ] = (0, import_react.useState)("");
	const results = (0, import_react.useMemo)(() => {
		const term = q.trim().toLowerCase();
		if (!term) return [];
		return products.filter((p) => [
			p.name,
			...p.categories,
			...p.colors.map((c) => c.name),
			p.fabric
		].join(" ").toLowerCase().includes(term)).slice(0, 6);
	}, [q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("fixed inset-0 z-[70] transition-opacity duration-400", searchOpen ? "opacity-100" : "pointer-events-none opacity-0"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-foreground/30 backdrop-blur-sm",
			onClick: () => setSearchOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-3xl bg-cream px-6 py-8 shadow-lift sm:px-10 sm:py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 border-b border-border pb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							className: "h-5 w-5 text-muted-foreground",
							strokeWidth: 1.25
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							autoFocus: searchOpen,
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search dresses, linen, gold, traditional…",
							className: "w-full bg-transparent font-serif text-2xl outline-hidden placeholder:text-muted-foreground/70"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSearchOpen(false),
							"aria-label": "Close search",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								className: "h-5 w-5",
								strokeWidth: 1.25
							})
						})
					]
				}),
				q && results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pt-8 text-sm text-muted-foreground",
					children: "Nothing matched. Try “kemis”, “linen” or “gold”."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: results.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/product/$slug",
						params: { slug: p.slug },
						onClick: () => setSearchOpen(false),
						className: "flex items-center gap-5 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.images[0],
								alt: "",
								loading: "lazy",
								className: "h-20 w-16 object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-serif text-lg",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-xs text-muted-foreground",
									children: p.categories.join(" · ")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: formatPrice(p.price)
							})
						]
					}) }, p.slug))
				}),
				!q ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-xs text-muted-foreground",
						children: "Popular searches"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap gap-3",
						children: [
							"Habesha kemis",
							"Linen suit",
							"Netela",
							"Bridal",
							"Kids"
						].map((term) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setQ(term),
							className: "label-xs border border-border px-4 py-2 transition-colors hover:border-gold hover:text-gold",
							children: term
						}, term))
					})]
				}) : null
			]
		})]
	});
}
var FREE_SHIPPING = 5e3;
var PROMOS = {
	AHAB10: .1,
	MADEWITHLOVE: .15
};
function CartDrawer() {
	const { cartOpen, setCartOpen, lineItems, removeLine, setQty, subtotal } = useShop();
	const [promo, setPromo] = (0, import_react.useState)("");
	const [discount, setDiscount] = (0, import_react.useState)(0);
	const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : 250;
	const total = Math.round(subtotal * (1 - discount)) + shipping;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("fixed inset-0 z-[70] transition-opacity duration-500", cartOpen ? "opacity-100" : "pointer-events-none opacity-0"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-foreground/35 backdrop-blur-sm",
			onClick: () => setCartOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: cn("absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream transition-transform duration-500 ease-out", cartOpen ? "translate-x-0" : "translate-x-full"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border px-6 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Your bag"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCartOpen(false),
					"aria-label": "Close cart",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "h-5 w-5",
						strokeWidth: 1.25
					})
				})]
			}), lineItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-2xl",
						children: "Your bag is empty."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Begin with the pieces our customers return for."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AhabLink, {
						to: "/shop",
						onClick: () => setCartOpen(false),
						children: "Shop the collection"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto px-6",
				children: [subtotal < FREE_SHIPPING ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "border-b border-border py-4 text-xs text-muted-foreground",
					children: [
						"Add ",
						formatPrice(FREE_SHIPPING - subtotal),
						" for free Addis Ababa delivery."
					]
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: lineItems.map(({ line, product }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-4 py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: product.images[0],
							alt: product.name,
							loading: "lazy",
							className: "h-28 w-22 object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-1 flex-col",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/product/$slug",
										params: { slug: product.slug },
										onClick: () => setCartOpen(false),
										className: "font-serif text-lg leading-tight",
										children: product.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => removeLine(i),
										"aria-label": "Remove item",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
											className: "h-4 w-4 text-muted-foreground",
											strokeWidth: 1.25
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "label-xs mt-1 text-muted-foreground",
									children: [
										line.size,
										" · ",
										line.color
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-auto flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center border border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setQty(i, line.qty - 1),
												"aria-label": "Decrease quantity",
												className: "grid h-9 w-9 place-items-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {
													className: "h-3 w-3",
													strokeWidth: 1.5
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-8 text-center text-sm",
												children: line.qty
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setQty(i, line.qty + 1),
												"aria-label": "Increase quantity",
												className: "grid h-9 w-9 place-items-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
													className: "h-3 w-3",
													strokeWidth: 1.5
												})
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm",
										children: formatPrice(product.price * line.qty)
									})]
								})
							]
						})]
					}, `${line.slug}-${line.size}-${line.color}`))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border px-6 py-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: promo,
							onChange: (e) => setPromo(e.target.value),
							placeholder: "Promo code",
							className: "label-xs h-11 flex-1 border border-border bg-transparent px-4 outline-hidden focus:border-gold"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								const rate = PROMOS[promo.trim().toUpperCase()];
								if (rate) {
									setDiscount(rate);
									toast.success(`${rate * 100}% applied`);
								} else toast.error("That code isn't recognised");
							},
							className: "label-xs h-11 border border-primary px-5 transition-colors hover:bg-primary hover:text-primary-foreground",
							children: "Apply"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-5 space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Subtotal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatPrice(subtotal) })]
							}),
							discount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-gold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Discount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: ["−", formatPrice(Math.round(subtotal * discount))] })]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Estimated delivery"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: shipping === 0 ? "Free" : formatPrice(shipping) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between border-t border-border pt-3 font-serif text-lg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatPrice(total) })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AhabLink, {
						to: "/checkout",
						onClick: () => setCartOpen(false),
						className: "mt-5 w-full",
						size: "lg",
						children: "Checkout"
					})
				]
			})] })]
		})]
	});
}
var nav = [
	{
		label: "Shop",
		to: "/shop"
	},
	{
		label: "Lookbook",
		to: "/lookbook"
	},
	{
		label: "Custom Designs",
		to: "/custom"
	},
	{
		label: "About",
		to: "/about"
	},
	{
		label: "Contact",
		to: "/contact"
	}
];
function Header() {
	const { cartCount, wishlist, setCartOpen, setSearchOpen } = useShop();
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => setMenuOpen(false), [pathname]);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "label-xs bg-primary py-2.5 text-center text-primary-foreground",
			children: "Free delivery in Addis Ababa on orders over ETB 5,000"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: cn("sticky top-0 z-50 transition-all duration-500", scrolled ? "bg-cream/95 shadow-soft backdrop-blur-md" : "bg-cream"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 md:px-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setMenuOpen(true),
						"aria-label": "Open menu",
						className: "lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
							className: "h-5 w-5",
							strokeWidth: 1.25
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden items-center gap-9 lg:flex",
						children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							className: "label-xs link-underline text-foreground/80 hover:text-foreground",
							children: item.label
						}, item.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "absolute left-1/2 -translate-x-1/2 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif text-3xl tracking-[0.3em] md:text-[2rem]",
							children: "AHAB"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-xs block text-[0.55rem] tracking-[0.42em] text-gold",
							children: "Made With Love"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSearchOpen(true),
								"aria-label": "Search",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
									className: "h-5 w-5",
									strokeWidth: 1.25
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/wishlist",
								"aria-label": "Wishlist",
								className: "relative hidden sm:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
									className: "h-5 w-5",
									strokeWidth: 1.25
								}), wishlist.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-gold text-[0.6rem] text-gold-foreground",
									children: wishlist.length
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/account",
								"aria-label": "Account",
								className: "hidden sm:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
									className: "h-5 w-5",
									strokeWidth: 1.25
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setCartOpen(true),
								"aria-label": "Open cart",
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {
									className: "h-5 w-5",
									strokeWidth: 1.25
								}), cartCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-gold text-[0.6rem] text-gold-foreground",
									children: cartCount
								}) : null]
							})
						]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("fixed inset-0 z-[60] bg-cream transition-opacity duration-500 lg:hidden", menuOpen ? "opacity-100" : "pointer-events-none opacity-0"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-20 items-center justify-between px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-serif text-2xl tracking-[0.3em]",
					children: "AHAB"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMenuOpen(false),
					"aria-label": "Close menu",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "h-5 w-5",
						strokeWidth: 1.25
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex flex-col gap-2 px-6 pt-10",
				children: [[{
					label: "Home",
					to: "/"
				}, ...nav].map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					className: "border-b border-border py-5 font-serif text-3xl",
					style: { animationDelay: `${i * 60}ms` },
					children: item.label
				}, item.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/wishlist",
						className: "label-xs",
						children: "Wishlist"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/account",
						className: "label-xs",
						children: "Account"
					})]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialog, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {})
	] });
}
var columns = [
	{
		title: "Shop",
		links: [
			{
				label: "All pieces",
				to: "/shop"
			},
			{
				label: "Lookbook",
				to: "/lookbook"
			},
			{
				label: "Custom designs",
				to: "/custom"
			},
			{
				label: "Wishlist",
				to: "/wishlist"
			}
		]
	},
	{
		title: "Customer care",
		links: [
			{
				label: "Contact us",
				to: "/contact"
			},
			{
				label: "Size guide",
				to: "/size-guide"
			},
			{
				label: "Shipping & delivery",
				to: "/shipping"
			},
			{
				label: "Returns",
				to: "/returns"
			}
		]
	},
	{
		title: "The house",
		links: [
			{
				label: "About AHAB",
				to: "/about"
			},
			{
				label: "Privacy policy",
				to: "/privacy"
			},
			{
				label: "Terms of service",
				to: "/terms"
			}
		]
	}
];
function Footer() {
	const [email, setEmail] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "bg-primary text-primary-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1500px] px-5 py-20 md:px-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-14 lg:grid-cols-[1.4fr_2fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-serif text-4xl tracking-[0.3em]",
						children: "AHAB"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-xs mt-2 text-gold",
						children: "Made With Love"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-sm text-sm leading-relaxed text-primary-foreground/70",
						children: "An independent Ethiopian house designing traditional and modern clothing in Addis Ababa. Woven, cut and finished by hand."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-10 max-w-sm",
						onSubmit: (e) => {
							e.preventDefault();
							if (!email.includes("@")) {
								toast.error("Please enter a valid email address");
								return;
							}
							toast.success("Welcome to AHAB", { description: "Look out for first access to new collections." });
							setEmail("");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "label-xs text-primary-foreground/60",
							htmlFor: "newsletter",
							children: "New collections, first"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex border-b border-primary-foreground/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "newsletter",
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "Your email",
								className: "h-11 flex-1 bg-transparent text-sm outline-hidden placeholder:text-primary-foreground/40"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "label-xs px-2 text-gold",
								children: "Join"
							})]
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-10 sm:grid-cols-3",
					children: columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "label-xs text-gold",
						children: col.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-5 space-y-3",
						children: col.links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: link.to,
							className: "text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground",
							children: link.label
						}) }, link.to))
					})] }, col.title))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-16 flex flex-col gap-6 border-t border-primary-foreground/15 pt-8 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "label-xs text-primary-foreground/50",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" AHAB Clothing · Addis Ababa, Ethiopia"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://instagram.com",
							"aria-label": "Instagram",
							className: "hover:text-gold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, {
								className: "h-4 w-4",
								strokeWidth: 1.25
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://tiktok.com",
							"aria-label": "TikTok",
							className: "hover:text-gold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music2, {
								className: "h-4 w-4",
								strokeWidth: 1.25
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://facebook.com",
							"aria-label": "Facebook",
							className: "hover:text-gold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, {
								className: "h-4 w-4",
								strokeWidth: 1.25
							})
						})
					]
				})]
			})]
		})
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[60vh] items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "This page has wandered off."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "label-xs mt-8 inline-block bg-primary px-8 py-4 text-primary-foreground",
					children: "Return home"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl",
				children: "This page didn't load"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					router.invalidate();
					reset();
				},
				className: "label-xs mt-6 bg-primary px-8 py-4 text-primary-foreground",
				children: "Try again"
			})]
		})
	});
}
var Route$3 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "AHAB Clothing — Made With Love in Addis Ababa" },
			{
				name: "description",
				content: "Contemporary Ethiopian fashion crafted with love."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$3.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ShopProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "min-h-[60vh]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "bottom-center" })
		] })
	});
}
var $$splitComponentImporter$2 = () => import("./routes-DFHe__4J.mjs");
var Route$2 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "AHAB Clothing — Wear Your Story | Ethiopian Luxury Fashion" },
		{
			name: "description",
			content: "Contemporary Ethiopian fashion crafted with love in Addis Ababa. Traditional, modern and custom pieces for women, men and kids."
		},
		{
			property: "og:title",
			content: "AHAB Clothing — Wear Your Story"
		},
		{
			property: "og:description",
			content: "Contemporary Ethiopian fashion crafted with love."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./custom-DQ-j_dK0.mjs");
var Route$1 = createFileRoute("/custom")({
	head: () => seo("Custom Designs", "Commission a one-of-a-kind AHAB piece — bridal, ceremony and made-to-measure clothing from our Addis Ababa atelier."),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./lookbook-CWpjxTS0.mjs");
var Route = createFileRoute("/lookbook")({
	head: () => seo("Lookbook — Autumn 2026", "An editorial journey through AHAB's Autumn 2026 collection, photographed in Addis Ababa."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$2.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	CustomRoute: Route$1.update({
		id: "/custom",
		path: "/custom",
		getParentRoute: () => Route$3
	}),
	LookbookRoute: Route.update({
		id: "/lookbook",
		path: "/lookbook",
		getParentRoute: () => Route$3
	}),
	ShopRoute: Route$5.update({
		id: "/shop",
		path: "/shop",
		getParentRoute: () => Route$3
	}),
	ProductSlugRoute: Route$4.update({
		id: "/product/$slug",
		path: "/product/$slug",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
