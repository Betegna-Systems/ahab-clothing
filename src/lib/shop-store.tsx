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
import type { Promo } from "@/lib/order-pricing";
import { checkPromoCode } from "@/lib/orders.functions";
import { getVariantAvailability } from "@/lib/inventory.functions";
import { initializeSupabaseBrowser } from "@/integrations/supabase/client";
import { featureClient as supabase } from "@/lib/feature-client";
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
  /** The validated promo code in the bag (it may still be below its minimum order). */
  promo: Promo | null;
  cartOpen: boolean;
  searchOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  /** Checks a code with the server and puts it in the bag when usable. */
  applyPromoCode: (code: string) => Promise<PromoCheck>;
  clearPromo: () => void;
  addToCart: (line: CartLine) => void;
  removeLine: (index: number) => void;
  setQty: (index: number, qty: number) => void;
  toggleWishlist: (slug: string) => void;
  isWished: (slug: string) => boolean;
  markViewed: (slug: string) => void;
  /** Pieces in the bag that still exist in the catalog (what the bag shows). */
  cartCount: number;
  /** Saved pieces that still exist in the catalog (what the wishlist page shows). */
  wishlistCount: number;
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

export type PromoCheck = Awaited<ReturnType<typeof checkPromoCode>>;

const ShopContext = createContext<ShopState | null>(null);

const CART_KEY = "ahab.cart";
const WISH_KEY = "ahab.wishlist";
const VIEWED_KEY = "ahab.viewed";
const PROMO_KEY = "ahab.promo";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const { products: allProducts, live: catalogIsLive } = useAllProducts();
  const [cart, setCart] = useState<CartLine[]>([]);
  // Persisting before the saved state is read would overwrite it with the empty defaults.
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistLoaded, setWishlistLoaded] = useState(false);
  const [accountUserId, setAccountUserId] = useState<string | null>(null);
  const [accountWishlistReady, setAccountWishlistReady] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [promo, setPromo] = useState<Promo | null>(null);
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
    // A code saved on an earlier visit is re-checked; paused/expired/used-up codes are dropped.
    const savedPromo = read<string | null>(PROMO_KEY, null);
    if (typeof savedPromo === "string" && savedPromo) {
      checkPromoCode({ data: { code: savedPromo } })
        .then((result) => setPromo(result.ok ? result.promo : null))
        .catch(() => setPromo(null));
    }
    setStorageLoaded(true);
  }, []);

  useEffect(() => {
    let active = true;
    let authStateVersion = 0;
    let subscription: { unsubscribe: () => void } | undefined;

    void initializeSupabaseBrowser()
      .then((configured) => {
        if (!active) return;
        if (!configured) {
          setAccountWishlistReady(true);
          return;
        }

        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          const version = ++authStateVersion;
          if (!session) {
            setAccountUserId(null);
            setAccountWishlistReady(true);
            setWishlist(read<string[]>(WISH_KEY, []));
            return;
          }

          window.setTimeout(() => {
            void (async () => {
              try {
                if (!session.user.email_confirmed_at) {
                  if (version === authStateVersion && active) {
                    setAccountUserId(null);
                    setAccountWishlistReady(true);
                    setWishlist(read<string[]>(WISH_KEY, []));
                  }
                  return;
                }

                const { data: mfaRequired, error: settingsError } =
                  await supabase.rpc("account_mfa_is_required");
                if (settingsError) throw settingsError;
                if (mfaRequired) {
                  const { data: assurance, error: assuranceError } =
                    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
                  if (assuranceError) throw assuranceError;
                  if (assurance.currentLevel !== "aal2") {
                    if (version === authStateVersion && active) {
                      setAccountUserId(null);
                      setAccountWishlistReady(true);
                      setWishlist(read<string[]>(WISH_KEY, []));
                    }
                    return;
                  }
                }

                if (version === authStateVersion && active) {
                  setAccountUserId(session.user.id);
                  setAccountWishlistReady(false);
                }
              } catch (error) {
                console.error("Account wishlist authorization check failed:", error);
                if (version === authStateVersion && active) {
                  setAccountUserId(null);
                  setAccountWishlistReady(true);
                }
              }
            })();
          }, 0);
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
    if (storageLoaded) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, storageLoaded]);
  useEffect(() => {
    if (wishlistLoaded) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, wishlistLoaded]);
  useEffect(() => {
    if (storageLoaded) localStorage.setItem(VIEWED_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed, storageLoaded]);
  useEffect(() => {
    if (!storageLoaded) return;
    if (promo) localStorage.setItem(PROMO_KEY, JSON.stringify(promo.code));
    else localStorage.removeItem(PROMO_KEY);
  }, [promo, storageLoaded]);

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

  // Once the live catalog is known, drop bag lines for products deleted in the admin app.
  // Otherwise they'd be invisible in the bag yet still block checkout, and the bag's
  // remove/quantity buttons (which use positions) could act on the wrong line.
  useEffect(() => {
    if (!catalogIsLive || !storageLoaded) return;
    setCart((prev) => {
      const kept = prev.filter((line) => allProducts.some((p) => p.slug === line.slug));
      return kept.length === prev.length ? prev : kept;
    });
  }, [allProducts, catalogIsLive, storageLoaded]);

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

  const applyPromoCode = useCallback(async (code: string) => {
    const result = await checkPromoCode({ data: { code } });
    if (result.ok) setPromo(result.promo);
    return result;
  }, []);

  const clearPromo = useCallback(() => setPromo(null), []);

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
    promo,
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
    // Count only products that still exist: a piece deleted in the admin app stays saved
    // (it reappears if re-added) but must not inflate the badges.
    cartCount: lineItems.reduce((n, { line }) => n + line.qty, 0),
    wishlistCount: wishlist.filter((slug) => allProducts.some((p) => p.slug === slug)).length,
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
