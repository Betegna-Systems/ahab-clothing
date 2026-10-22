import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { type Product } from "@/lib/products";
import { useAllProducts, getProductCached } from "@/lib/firestore-products";
import { MAX_CART_QUANTITY } from "@/lib/order-limits";

export type CartLine = {
  slug: string;
  size: string;
  color: string;
  qty: number;
};

type ShopState = {
  products: Product[];
  cart: CartLine[];
  wishlist: string[];
  recentlyViewed: string[];
  promoCode: string | null;
  discount: number;
  cartOpen: boolean;
  searchOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  applyPromoCode: (code: string) => number | null;
  clearPromo: () => void;
  addToCart: (line: CartLine) => void;
  removeLine: (index: number) => void;
  setQty: (index: number, qty: number) => void;
  toggleWishlist: (slug: string) => void;
  isWished: (slug: string) => boolean;
  markViewed: (slug: string) => void;
  cartCount: number;
  subtotal: number;
  lineItems: { line: CartLine; product: Product }[];
  clearCart: () => void;
};

const ShopContext = createContext<ShopState | null>(null);

const CART_KEY = "ahab.cart";
const WISH_KEY = "ahab.wishlist";
const VIEWED_KEY = "ahab.viewed";
const PROMO_KEY = "ahab.promo";
const PROMOS: Record<string, number> = { AHAB10: 0.1, MADEWITHLOVE: 0.15 };

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const { products: allProducts } = useAllProducts();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);

  useEffect(() => {
    const storedCart = read<CartLine[]>(CART_KEY, []);
    setCart(
      storedCart.map((line) => ({
        ...line,
        qty: Math.max(
          1,
          Math.min(MAX_CART_QUANTITY, Number.isFinite(line.qty) ? Math.trunc(line.qty) : 1),
        ),
      })),
    );
    setWishlist(read<string[]>(WISH_KEY, []));
    setRecentlyViewed(read<string[]>(VIEWED_KEY, []));
    const savedPromo = read<string | null>(PROMO_KEY, null);
    setPromoCode(
      savedPromo && Object.prototype.hasOwnProperty.call(PROMOS, savedPromo) ? savedPromo : null,
    );
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    localStorage.setItem(VIEWED_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);
  useEffect(() => {
    if (promoCode) localStorage.setItem(PROMO_KEY, promoCode);
    else localStorage.removeItem(PROMO_KEY);
  }, [promoCode]);

  const addToCart = useCallback((line: CartLine) => {
    setCart((prev) => {
      const i = prev.findIndex(
        (l) => l.slug === line.slug && l.size === line.size && l.color === line.color,
      );
      if (i === -1) {
        return [
          ...prev,
          { ...line, qty: Math.max(1, Math.min(MAX_CART_QUANTITY, line.qty)) },
        ];
      }
      const next = [...prev];
      const cur = next[i]!;
      next[i] = { ...cur, qty: Math.min(MAX_CART_QUANTITY, cur.qty + line.qty) };
      return next;
    });
    setCartOpen(true);
  }, []);

  const removeLine = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const setQty = useCallback((index: number, qty: number) => {
    setCart((prev) =>
      prev.map((l, i) =>
        i === index ? { ...l, qty: Math.max(1, Math.min(MAX_CART_QUANTITY, qty)) } : l,
      ),
    );
  }, []);

  const applyPromoCode = useCallback((code: string) => {
    const normalizedCode = code.trim().toUpperCase();
    if (!Object.prototype.hasOwnProperty.call(PROMOS, normalizedCode)) return null;
    setPromoCode(normalizedCode);
    return PROMOS[normalizedCode]!;
  }, []);

  const clearPromo = useCallback(() => setPromoCode(null), []);

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }, []);

  const markViewed = useCallback((slug: string) => {
    setRecentlyViewed((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 6));
  }, []);

  const lineItems = useMemo(
    () =>
      cart
        .map((line) => {
          const product =
            allProducts.find((p) => p.slug === line.slug) ??
            getProductCached(line.slug);
          return product ? { line, product } : null;
        })
        .filter((v): v is { line: CartLine; product: Product } => v !== null),
    [cart, allProducts],
  );

  const value: ShopState = {
    products: allProducts,
    cart,
    wishlist,
    recentlyViewed,
    promoCode,
    discount: promoCode ? PROMOS[promoCode]! : 0,
    cartOpen,
    searchOpen,
    setCartOpen,
    setSearchOpen,
    applyPromoCode,
    clearPromo,
    addToCart,
    removeLine,
    setQty,
    toggleWishlist,
    isWished: (slug) => wishlist.includes(slug),
    markViewed,
    cartCount: cart.reduce((n, l) => n + l.qty, 0),
    subtotal: lineItems.reduce((n, { line, product }) => n + product.price * line.qty, 0),
    lineItems,
    clearCart: () => {
      setCart([]);
      clearPromo();
    },
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
