import { r as __toESM } from "../_runtime.mjs";
import { a as images } from "./utils-Cy3rYMGk.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as AhabLink, r as Eyebrow, t as AhabButton } from "./ui-BC5nvihU.mjs";
import { r as Upload, v as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/custom-DQ-j_dK0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var field = "h-12 w-full border-b border-border bg-transparent text-base outline-hidden transition-colors focus:border-gold placeholder:text-muted-foreground/60";
var label = "label-xs text-muted-foreground";
function Custom() {
	const [done, setDone] = (0, import_react.useState)(null);
	const [files, setFiles] = (0, import_react.useState)([]);
	const submit = (e) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		setDone(String(data.get("name") || "").split(" ")[0] || "there");
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-5 py-32 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold text-gold-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "h-6 w-6",
					strokeWidth: 1.25
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-8 text-5xl",
				children: [
					"Thank you, ",
					done,
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-muted-foreground",
				children: "Your request is with our atelier. A designer will contact you within two working days to talk through fabrics, fittings and timing."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AhabLink, {
				to: "/shop",
				className: "mt-10",
				children: "Continue browsing"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: images.collectionCustom,
			alt: "Atelier mannequin draped in ivory silk",
			className: "aspect-4/5 w-full object-cover lg:aspect-auto lg:h-full"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col justify-center px-5 py-16 md:px-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "The Atelier" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-6 text-5xl leading-[1.02] md:text-7xl",
					children: ["Made for you. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
						className: "italic text-gold",
						children: "Only you."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-md leading-relaxed text-muted-foreground",
					children: "Bridal gowns, ceremony wear, matching family sets — designed from a conversation, cut to your measurements, and finished by hand over three fittings."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-10 space-y-5",
					children: [
						"Share your vision below",
						"Consultation with a designer",
						"Fabric selection & sketch",
						"Three fittings, then delivery"
					].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-baseline gap-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-serif text-2xl text-gold",
							children: ["0", i + 1]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s })]
					}, s))
				})
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-5 py-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-center text-4xl md:text-5xl",
			children: "Begin your commission"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "mt-14 grid gap-10 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: label,
						children: "Full name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						name: "name",
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: label,
						children: "Phone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						name: "phone",
						type: "tel",
						placeholder: "+251",
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: label,
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						name: "email",
						type: "email",
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: label,
						children: "Occasion"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						name: "occasion",
						className: field,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Wedding" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Engagement" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Holiday / Meskel / Timket" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Graduation" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Everyday" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Other" })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: label,
						children: "Clothing type"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						name: "type",
						className: field,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Habesha kemis" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Modern dress" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Men's suit / shirt" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Kids' set" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Family matching set" })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: label,
						children: "Preferred colour"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "color",
						placeholder: "Ivory with gold tibeb",
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1 sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: label,
						children: "Budget"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						name: "budget",
						className: field,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "ETB 5,000 – 15,000" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "ETB 15,000 – 30,000" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "ETB 30,000 – 60,000" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "ETB 60,000+" })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: label,
						children: "Measurements (cm) — optional, we can take them at your fitting"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 grid grid-cols-2 gap-6 sm:grid-cols-4",
						children: [
							"Bust / Chest",
							"Waist",
							"Hips",
							"Height"
						].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: m,
							placeholder: m,
							inputMode: "numeric",
							className: field
						}, m))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "sm:col-span-2 flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-border px-6 py-10 text-center transition-colors hover:border-gold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
							className: "h-5 w-5 text-gold",
							strokeWidth: 1.25
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-xs",
							children: "Upload inspiration images"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: files.length ? files.map((f) => f.name).join(", ") : "JPG or PNG, up to 5 images"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							multiple: true,
							className: "sr-only",
							onChange: (e) => setFiles(Array.from(e.target.files ?? []).slice(0, 5))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1 sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: label,
						children: "Additional notes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						name: "notes",
						rows: 4,
						className: "w-full border-b border-border bg-transparent py-2 outline-hidden focus:border-gold"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AhabButton, {
					type: "submit",
					size: "lg",
					className: "sm:col-span-2",
					children: "Send my request"
				})
			]
		})]
	})] });
}
//#endregion
export { Custom as component };
