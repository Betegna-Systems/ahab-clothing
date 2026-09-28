import { a as images, n as collections, o as products, s as testimonials } from "./utils-Cy3rYMGk.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as SectionHeading, n as AhabLink, r as Eyebrow } from "./ui-BC5nvihU.mjs";
import { m as Instagram, y as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as lookbook_1_default, r as lookbook_2_default, t as craft_loom_default } from "./lookbook-2-ERCQ8sgj.mjs";
import { t as ProductCard } from "./ProductCard-NHEc9YUw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DFHe__4J.js
var import_jsx_runtime = require_jsx_runtime();
var founder_portrait_default = "/assets/founder-portrait-nYAbs9C7.jpg";
var newArrivals = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
var bestSellers = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
var gallery = [
	lookbook_1_default,
	images.collectionWomen,
	lookbook_2_default,
	images.collectionKids,
	images.productShawl,
	images.collectionMen
];
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative h-[calc(100svh-7.5rem)] min-h-[560px] overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: images.heroCampaign,
					alt: "Model in an ivory AHAB gown with gold tibeb border",
					width: 1600,
					height: 1920,
					className: "fade-in-slow absolute inset-0 h-full w-full object-cover object-[center_25%]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-foreground/65 via-foreground/10 to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto flex h-full max-w-[1500px] flex-col justify-end px-5 pb-16 md:px-10 md:pb-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-xs reveal-up text-cream/85",
							children: "Autumn Collection · 2026"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "reveal-up mt-5 max-w-3xl text-6xl leading-[0.95] text-cream sm:text-7xl md:text-[7.5rem]",
							children: ["Wear Your ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
								className: "italic text-gold",
								children: "Story."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "reveal-up mt-6 max-w-md text-base text-cream/85 md:text-lg",
							children: "Contemporary Ethiopian fashion crafted with love."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "reveal-up mt-10 flex flex-col gap-3 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AhabLink, {
								to: "/shop",
								variant: "gold",
								size: "lg",
								children: "Shop Collection"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AhabLink, {
								to: "/custom",
								variant: "ghostLight",
								size: "lg",
								children: "Explore Custom Designs"
							})]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "The Collections",
				title: "Five ways to wear AHAB."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid gap-4 md:grid-cols-6",
				children: collections.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: c.filter === "custom" ? "/custom" : "/shop",
					search: c.filter === "custom" ? void 0 : { category: c.filter },
					className: `group relative overflow-hidden bg-secondary ${i < 2 ? "md:col-span-3 aspect-4/5 md:aspect-5/6" : "md:col-span-2 aspect-3/4"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: c.image,
							alt: c.title,
							loading: "lazy",
							className: "absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-x-0 bottom-0 p-6 text-cream md:p-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-3xl md:text-4xl",
									children: c.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 max-w-xs text-sm text-cream/80",
									children: c.copy
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "label-xs mt-5 inline-flex items-center gap-2 text-gold",
									children: ["Discover ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 transition-transform group-hover:translate-x-1" })]
								})
							]
						})
					]
				}, c.title))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "bg-secondary py-24 md:py-32",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-[1500px] px-5 md:px-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						eyebrow: "Just Arrived",
						title: "New this season."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AhabLink, {
						to: "/shop",
						variant: "quiet",
						size: "none",
						className: "hidden md:inline-flex",
						children: "View all"
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:px-10 [scrollbar-width:none]",
				children: newArrivals.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-[23vw]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p })
				}, p.slug))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Most Loved",
				title: "The pieces they return for.",
				align: "center"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4",
				children: bestSellers.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-primary text-primary-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-[1500px] items-center gap-12 px-5 py-24 md:px-10 lg:grid-cols-2 lg:py-32",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: craft_loom_default,
					alt: "Hands weaving gold tibeb on a wooden loom",
					loading: "lazy",
					className: "aspect-4/3 w-full object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:pl-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "The Craft Behind AHAB" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mt-5 text-4xl leading-[1.05] sm:text-5xl md:text-6xl",
							children: [
								"Sixty hours. ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
									className: "italic text-gold",
									children: "One thread"
								}),
								" at a time."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 max-w-lg leading-relaxed text-primary-foreground/75",
							children: "Every tibeb border is woven by hand on wooden looms by artisans in and around Addis Ababa — a craft passed between generations, now carried into silhouettes made for today."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-12 grid grid-cols-2 gap-8",
							children: [
								["Handmade", "Woven, cut and finished by hand in our atelier."],
								["Ethiopian inspiration", "Patterns drawn from Lalibela, Aksum and Harar."],
								["Quality fabrics", "Hand-spun cotton, washed linen and pure silk."],
								["Local craftsmanship", "Fair pay for every weaver and tailor we work with."]
							].map(([t, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-serif text-2xl text-gold",
								children: t
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-2 text-sm text-primary-foreground/70",
								children: d
							})] }, t))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AhabLink, {
							to: "/about",
							variant: "ghostLight",
							className: "mt-12",
							children: "Read our story"
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "In Their Words",
				title: "Worn, and remembered.",
				align: "center"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid gap-6 md:grid-cols-3",
				children: testimonials.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "bg-card p-8 shadow-soft transition-transform duration-500 hover:-translate-y-1 md:p-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: [
								founder_portrait_default,
								images.collectionMen,
								lookbook_1_default
							][i],
							alt: t.name,
							loading: "lazy",
							className: "h-14 w-14 rounded-full object-cover object-top"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
							className: "mt-6 font-serif text-xl leading-snug",
							children: [
								"“",
								t.quote,
								"”"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "label-xs mt-6 text-muted-foreground",
							children: [
								t.name,
								" · ",
								t.city
							]
						})
					]
				}, t.name))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "pb-24 md:pb-32",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-[1500px] px-5 text-center md:px-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "@ahabclothing" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-5 text-4xl md:text-5xl",
					children: "Follow Our Journey"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid grid-cols-3 gap-1 md:grid-cols-6",
				children: gallery.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "https://instagram.com",
					target: "_blank",
					rel: "noreferrer",
					className: "group relative aspect-square overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src,
						alt: "",
						loading: "lazy",
						className: "h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute inset-0 grid place-items-center bg-foreground/0 transition-colors group-hover:bg-foreground/35",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, {
							className: "h-5 w-5 text-cream opacity-0 transition-opacity group-hover:opacity-100",
							strokeWidth: 1.25
						})
					})]
				}, i))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: lookbook_2_default,
					alt: "",
					loading: "lazy",
					className: "absolute inset-0 h-full w-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-foreground/55" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-3xl px-5 py-32 text-center text-cream md:py-44",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-xs text-gold",
							children: "AHAB · Addis Ababa"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mt-6 text-6xl leading-none md:text-8xl",
							children: ["Designed With ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
								className: "italic",
								children: "Love."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AhabLink, {
							to: "/shop",
							variant: "gold",
							size: "lg",
							className: "mt-12",
							children: "Start Shopping"
						})
					]
				})
			]
		})
	] });
}
//#endregion
export { Home as component };
