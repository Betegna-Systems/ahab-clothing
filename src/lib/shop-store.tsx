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
import { getVariantAvailability } from "@/lib/inventory.functions";
import { initializeSupabaseBrowser, supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  inventoryStatus: "loading" | "ready" | "error";
  isVariantAvailable: (slug: string, color: string, size: string) => boolean;
  hasAvailableColor: (product: Product, color: string) => boolean;
  isProductAvailable: (product: Product) => boolean;
  hasUnavailableCartLines: boolean;
  refreshInventory: () => Promise<void>;
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
  const [wishlistLoaded, setWishlistLoaded] = useState(false);
  const [accountUserId, setAccountUserId] = useState<string | null>(null);
  const [accountWishlistReady, setAccountWishlistReady] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [inventoryStatus, setInventoryStatus] = useState<"loading" | "ready" | "error">("loading");
  const [availableVariants, setAvailableVariants] = useState<Set<string>>(() => new Set());

  const refreshInventory = useCallback(async () => {
    setInventoryStatus("loading");
    try {
      const variants = await getVariantAvailability({ data: {} });
      setAvailableVariants(
        new Set(
          variants.map((variant) =>
            JSON.stringify([variant.product_slug, variant.color, variant.size]),
          ),
        ),
      );
      setInventoryStatus("ready");
    } catch (error) {
      console.error("Variant availability lookup failed:", error);
      setInventoryStatus("error");
      toast.error("Stock availability couldn't be checked. Please try again later.");
    }
  }, []);

  useEffect(() => {
    void refreshInventory();
  }, [refreshInventory]);

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
    setWishlistLoaded(true);
    setRecentlyViewed(read<string[]>(VIEWED_KEY, []));
    const savedPromo = read<string | null>(PROMO_KEY, null);
    setPromoCode(
      savedPromo && Object.prototype.hasOwnProperty.call(PROMOS, savedPromo) ? savedPromo : null,
    );
  }, []);

  useEffect(() => {
    let active = true;
    let subscription: { unsubscribe: () => void } | undefined;

    void initializeSupabaseBrowser()
      .then((configured) => {
        if (!active) return;
        if (!configured) {
          setAccountWishlistReady(true);
          return;
        }

        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          const nextUserId = session?.user.id ?? null;
          setAccountUserId(nextUserId);
          setAccountWishlistReady(!nextUserId);
          if (!nextUserId) setWishlist(read<string[]>(WISH_KEY, []));
        });
        subscription = data.subscription;
      })
      .catch((error: unknown) => {
        console.error("Supabase browser configuration lookup failed:", error);
        if (active) setAccountWishlistReady(true);
      });

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!wishlistLoaded || !accountUserId) return;
    let active = true;
    setAccountWishlistReady(false);

    const loadWishlist = async () => {
      const { data, error } = await supabase
        .from("account_wishlist")
        .select("product_slug")
        .eq("user_id", accountUserId);
      if (error) {
        console.error("Account wishlist lookup failed:", error.message);
        toast.error("Your saved wishlist couldn't be synced.");
        return;
      }

      const localWishlist = read<string[]>(WISH_KEY, []);
      const remoteWishlist = data.map((item) => item.product_slug);
      const mergedWishlist = Array.from(new Set([...remoteWishlist, ...localWishlist]));
      if (!active) return;
      setWishlist(mergedWishlist);
      setAccountWishlistReady(true);

      const localOnly = localWishlist.filter((slug) => !remoteWishlist.includes(slug));
      if (localOnly.length > 0) {
        const { error: saveError } = await supabase
          .from("account_wishlist")
          .insert(localOnly.map((product_slug) => ({ user_id: accountUserId, product_slug })));
        if (saveError) {
          console.error("Local wishlist migration failed:", saveError.message);
          toast.error("Some saved pieces couldn't be added to your account wishlist.");
        }
      }
    };

    void loadWishlist();
    return () => {
      active = false;
    };
  }, [accountUserId, wishlistLoaded]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    if (wishlistLoaded) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, wishlistLoaded]);
  useEffect(() => {
    localStorage.setItem(VIEWED_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);
  useEffect(() => {
    if (promoCode) localStorage.setItem(PROMO_KEY, promoCode);
    else localStorage.removeItem(PROMO_KEY);
  }, [promoCode]);

  const isVariantAvailable = useCallback(
    (slug: string, color: string, size: string) =>
      inventoryStatus === "ready" && availableVariants.has(JSON.stringify([slug, color, size])),
    [availableVariants, inventoryStatus],
  );

  const hasAvailableColor = useCallback(
    (product: Product, color: string) =>
      product.sizes.some((size) => isVariantAvailable(product.slug, color, size)),
    [isVariantAvailable],
  );

  const isProductAvailable = useCallback(
    (product: Product) => product.colors.some((color) => hasAvailableColor(product, color.name)),
    [hasAvailableColor],
  );

  const addToCart = useCallback(
    (line: CartLine) => {
      if (inventoryStatus !== "ready") {
        toast.error("Stock availability is still being checked. Please try again.");
        return;
      }
      if (!isVariantAvailable(line.slug, line.color, line.size)) {
        toast.error("That size and color are currently unavailable.");
        return;
      }

      setCart((prev) => {
        const i = prev.findIndex(
          (l) => l.slug === line.slug && l.size === line.size && l.color === line.color,
        );
        if (i === -1) {
          return [...prev, { ...line, qty: Math.max(1, Math.min(MAX_CART_QUANTITY, line.qty)) }];
        }
        const next = [...prev];
        const cur = next[i]!;
        next[i] = { ...cur, qty: Math.min(MAX_CART_QUANTITY, cur.qty + line.qty) };
        return next;
      });
      setCartOpen(true);
    },
    [inventoryStatus, isVariantAvailable],
  );

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

  const toggleWishlist = useCallback(
    (slug: string) => {
      const removing = wishlist.includes(slug);
      setWishlist((prev) =>
        prev.includes(slug) ? prev.filter((savedSlug) => savedSlug !== slug) : [...prev, slug],
      );
      if (!accountUserId || !accountWishlistReady) return;

      const request = removing
        ? supabase
            .from("account_wishlist")
            .delete()
            .eq("user_id", accountUserId)
            .eq("product_slug", slug)
        : supabase.from("account_wishlist").insert({ user_id: accountUserId, product_slug: slug });
      void request.then(({ error }) => {
        if (error) {
          console.error("Account wishlist update failed:", error.message);
          toast.error("Your account wishlist couldn't be updated.");
        }
      });
    },
    [accountUserId, accountWishlistReady, wishlist],
  );

  const markViewed = useCallback((slug: string) => {
    setRecentlyViewed((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 6));
  }, []);

  const lineItems = useMemo(
    () =>
      cart
        .map((line) => {
          const product =
            allProducts.find((p) => p.slug === line.slug) ?? getProductCached(line.slug);
          return product ? { line, product } : null;
        })
        .filter((v): v is { line: CartLine; product: Product } => v !== null),
    [cart, allProducts],
  );
  const hasUnavailableCartLines =
    inventoryStatus !== "ready" ||
    cart.length !== lineItems.length ||
    lineItems.some(({ line }) => !isVariantAvailable(line.slug, line.color, line.size));

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
    inventoryStatus,
    isVariantAvailable,
    hasAvailableColor,
    isProductAvailable,
    hasUnavailableCartLines,
    refreshInventory,
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
