import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";
import { SearchDialog } from "./SearchDialog";
import { CartDrawer } from "./CartDrawer";

const nav = [
  { label: "Suits", to: "/shop", search: { category: "suits" } },
  { label: "Tops", to: "/shop", search: { category: "tops" } },
  { label: "Shop", to: "/shop" },
  { label: "Lookbook", to: "/lookbook" },
  { label: "Custom", to: "/custom" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

// Desktop nav is split around the centred logo so links never run underneath it.
const leftNav = nav.slice(0, 4);
const rightNav = nav.slice(4);

function NavLinks({ items }: { items: readonly (typeof nav)[number][] }) {
  return (
    <nav className="hidden items-center gap-7 xl:flex 2xl:gap-9">
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          {...("search" in item ? { search: item.search } : {})}
          className="label-xs link-underline whitespace-nowrap text-foreground/80 hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

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
      <div className="label-xs bg-primary px-4 py-2.5 text-center text-primary-foreground">
        <span className="sm:hidden">Free Addis delivery over ETB 5,000</span>
        <span className="hidden sm:inline">
          Free delivery in Addis Ababa on orders over ETB 5,000
        </span>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          scrolled ? "bg-cream/95 shadow-soft backdrop-blur-md" : "bg-cream",
        )}
      >
        {/* Three columns: the equal outer columns keep the logo centred without overlap. */}
        <div className="mx-auto grid h-20 max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 md:px-10">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="xl:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.25} />
            </button>
            <NavLinks items={leftNav} />
          </div>

          <Link to="/" className="flex items-center gap-1.5 text-center sm:gap-3">
            <img
              src="/ahab-logo.png"
              alt="AHAB Clothing"
              className="hidden h-10 w-10 rounded-full object-contain sm:block"
            />
            <div className="flex flex-col items-start leading-none">
              <span className="font-serif text-xl tracking-[0.18em] sm:text-2xl sm:tracking-[0.25em] md:text-[1.85rem]">
                AHAB
              </span>
              <span className="label-xs hidden text-[0.52rem] tracking-[0.38em] text-gold sm:block">
                Made With Love
              </span>
            </div>
          </Link>

          <div className="flex items-center justify-end gap-2 sm:gap-5 xl:gap-7 2xl:gap-9">
            <NavLinks items={rightNav} />
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search className="h-5 w-5" strokeWidth={1.25} />
            </button>
            <Link to="/wishlist" aria-label="Wishlist" className="relative">
              <Heart className="h-5 w-5" strokeWidth={1.25} />
              {wishlist.length > 0 ? (
                <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-gold text-[0.6rem] text-gold-foreground">
                  {wishlist.length}
                </span>
              ) : null}
            </Link>
            <Link to="/account" aria-label="Account">
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
          "fixed inset-0 z-[60] bg-cream transition-opacity duration-500 xl:hidden",
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
              key={item.label}
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
