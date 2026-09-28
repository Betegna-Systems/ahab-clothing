import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._slug-BBErTPvN.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "py-32 text-center",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "text-4xl",
		children: "This piece is no longer available."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/shop",
		className: "label-xs link-underline mt-8 inline-block",
		children: "Back to the shop"
	})]
});
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
