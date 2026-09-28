import { r as __toESM } from "../_runtime.mjs";
import { o as products } from "./utils-Cy3rYMGk.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-store-DCXDem3B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ShopContext = (0, import_react.createContext)(null);
var CART_KEY = "ahab.cart";
var WISH_KEY = "ahab.wishlist";
var VIEWED_KEY = "ahab.viewed";
function read(key, fallback) {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function ShopProvider({ children }) {
	const [cart, setCart] = (0, import_react.useState)([]);
	const [wishlist, setWishlist] = (0, import_react.useState)([]);
	const [recentlyViewed, setRecentlyViewed] = (0, import_react.useState)([]);
	const [cartOpen, setCartOpen] = (0, import_react.useState)(false);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setCart(read(CART_KEY, []));
		setWishlist(read(WISH_KEY, []));
		setRecentlyViewed(read(VIEWED_KEY, []));
	}, []);
	(0, import_react.useEffect)(() => {
		localStorage.setItem(CART_KEY, JSON.stringify(cart));
	}, [cart]);
	(0, import_react.useEffect)(() => {
		localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
	}, [wishlist]);
	(0, import_react.useEffect)(() => {
		localStorage.setItem(VIEWED_KEY, JSON.stringify(recentlyViewed));
	}, [recentlyViewed]);
	const addToCart = (0, import_react.useCallback)((line) => {
		setCart((prev) => {
			const i = prev.findIndex((l) => l.slug === line.slug && l.size === line.size && l.color === line.color);
			if (i === -1) return [...prev, line];
			const next = [...prev];
			next[i] = {
				...next[i],
				qty: next[i].qty + line.qty
			};
			return next;
		});
		setCartOpen(true);
	}, []);
	const removeLine = (0, import_react.useCallback)((index) => {
		setCart((prev) => prev.filter((_, i) => i !== index));
	}, []);
	const setQty = (0, import_react.useCallback)((index, qty) => {
		setCart((prev) => prev.map((l, i) => i === index ? {
			...l,
			qty: Math.max(1, Math.min(99, qty))
		} : l));
	}, []);
	const toggleWishlist = (0, import_react.useCallback)((slug) => {
		setWishlist((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
	}, []);
	const markViewed = (0, import_react.useCallback)((slug) => {
		setRecentlyViewed((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 6));
	}, []);
	const lineItems = (0, import_react.useMemo)(() => cart.map((line) => {
		const product = products.find((p) => p.slug === line.slug);
		return product ? {
			line,
			product
		} : null;
	}).filter((v) => v !== null), [cart]);
	const value = {
		cart,
		wishlist,
		recentlyViewed,
		cartOpen,
		searchOpen,
		setCartOpen,
		setSearchOpen,
		addToCart,
		removeLine,
		setQty,
		toggleWishlist,
		isWished: (slug) => wishlist.includes(slug),
		markViewed,
		cartCount: cart.reduce((n, l) => n + l.qty, 0),
		subtotal: lineItems.reduce((n, { line, product }) => n + product.price * line.qty, 0),
		lineItems,
		clearCart: () => setCart([])
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopContext.Provider, {
		value,
		children
	});
}
function useShop() {
	const ctx = (0, import_react.useContext)(ShopContext);
	if (!ctx) throw new Error("useShop must be used within ShopProvider");
	return ctx;
}
//#endregion
export { useShop as n, ShopProvider as t };
