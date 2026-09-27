import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "@/lib/products";

export type CartLine = {
  slug: string;
  size: string;
  color: string;
  qty: number;
};

type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  recentlyViewed: string[];
  cartOpen: boolean;
  searchOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
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

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setCart(read<CartLine[]>(CART_KEY, []));
    setWishlist(read<string[]>(WISH_KEY, []));
    setRecentlyViewed(read<string[]>(VIEWED_KEY, []));
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

  const addToCart = useCallback((line: CartLine) => {
    setCart((prev) => {
      const i = prev.findIndex(
        (l) => l.slug === line.slug && l.size === line.size && l.color === line.color,
      );
      if (i === -1) return [...prev, line];
      const next = [...prev];
      next[i] = { ...next[i], qty: next[i].qty + line.qty };
      return next;
    });
    setCartOpen(true);
  }, []);

  const removeLine = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const setQty = useCallback((index: number, qty: number) => {
    setCart((prev) =>
      prev.map((l, i) => (i === index ? { ...l, qty: Math.max(1, Math.min(99, qty)) } : l)),
    );
  }, []);

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
          const product = products.find((p) => p.slug === line.slug);
          return product ? { line, product } : null;
        })
        .filter((v): v is { line: CartLine; product: Product } => v !== null),
    [cart],
  );

  const value: ShopState = {
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
    clearCart: () => setCart([]),
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
