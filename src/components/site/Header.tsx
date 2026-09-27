import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";
import { SearchDialog } from "./SearchDialog";
import { CartDrawer } from "./CartDrawer";

const nav = [
  { label: "Shop", to: "/shop" },
  { label: "Lookbook", to: "/lookbook" },
  { label: "Custom Designs", to: "/custom" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export function Header() {
  const { cartCount, wishlist, setCartOpen, setSearchOpen } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="label-xs bg-primary py-2.5 text-center text-primary-foreground">
        Free delivery in Addis Ababa on orders over ETB 5,000
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          scrolled ? "bg-cream/95 shadow-soft backdrop-blur-md" : "bg-cream",
        )}
      >
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 md:px-10">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1.25} />
          </button>

          <nav className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="label-xs link-underline text-foreground/80 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-center">
            <span className="font-serif text-3xl tracking-[0.3em] md:text-[2rem]">AHAB</span>
            <span className="label-xs block text-[0.55rem] tracking-[0.42em] text-gold">
              Made With Love
            </span>
          </Link>

          <div className="flex items-center gap-5">
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search className="h-5 w-5" strokeWidth={1.25} />
            </button>
            <Link to="/wishlist" aria-label="Wishlist" className="relative hidden sm:block">
              <Heart className="h-5 w-5" strokeWidth={1.25} />
              {wishlist.length > 0 ? (
                <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-gold text-[0.6rem] text-gold-foreground">
                  {wishlist.length}
                </span>
              ) : null}
            </Link>
            <Link to="/account" aria-label="Account" className="hidden sm:block">
              <User className="h-5 w-5" strokeWidth={1.25} />
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.25} />
              {cartCount > 0 ? (
                <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-gold text-[0.6rem] text-gold-foreground">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-cream transition-opacity duration-500 lg:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex h-20 items-center justify-between px-5">
          <span className="font-serif text-2xl tracking-[0.3em]">AHAB</span>
          <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>
        <nav className="flex flex-col gap-2 px-6 pt-10">
          {[{ label: "Home", to: "/" }, ...nav].map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              className="border-b border-border py-5 font-serif text-3xl"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-8 flex gap-6">
            <Link to="/wishlist" className="label-xs">
              Wishlist
            </Link>
            <Link to="/account" className="label-xs">
              Account
            </Link>
          </div>
        </nav>
      </div>

      <SearchDialog />
      <CartDrawer />
    </>
  );
}
