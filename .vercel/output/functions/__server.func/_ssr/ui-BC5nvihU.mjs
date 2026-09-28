import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-Cy3rYMGk.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-BC5nvihU.js
var import_jsx_runtime = require_jsx_runtime();
var ahabButton = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-500 disabled:pointer-events-none disabled:opacity-50 label-xs", {
	variants: {
		variant: {
			solid: "bg-primary text-primary-foreground hover:bg-gold hover:text-gold-foreground",
			outline: "border border-primary/40 text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground",
			ghostLight: "border border-cream/60 text-cream hover:bg-cream hover:text-foreground backdrop-blur-[2px]",
			gold: "bg-gold text-gold-foreground hover:bg-primary hover:text-primary-foreground",
			quiet: "text-foreground link-underline"
		},
		size: {
			md: "h-12 px-8",
			sm: "h-10 px-5",
			lg: "h-14 px-10",
			none: ""
		}
	},
	defaultVariants: {
		variant: "solid",
		size: "md"
	}
});
function AhabButton({ className, variant, size, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn(ahabButton({
			variant,
			size
		}), className),
		...props
	});
}
function AhabLink({ className, variant, size, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		className: cn(ahabButton({
			variant,
			size
		}), className),
		...props
	});
}
function Eyebrow({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("label-xs inline-flex items-center gap-3 text-gold", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "h-px w-8 bg-gold",
			"aria-hidden": true
		}), children]
	});
}
function SectionHeading({ eyebrow, title, copy, align = "left", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("max-w-2xl", align === "center" && "mx-auto text-center", className),
		children: [
			eyebrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: eyebrow }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-5 text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl",
				children: title
			}),
			copy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-base leading-relaxed text-muted-foreground",
				children: copy
			}) : null
		]
	});
}
//#endregion
export { SectionHeading as i, AhabLink as n, Eyebrow as r, AhabButton as t };
