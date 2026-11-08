import { createFileRoute } from "@tanstack/react-router";
import { useAllProducts } from "@/lib/firestore-products";
import { useShop } from "@/lib/shop-store";
import { seo } from "@/lib/seo";
import { ProductCard } from "@/components/site/ProductCard";
import { AhabLink } from "@/components/site/ui";
import { headT, useT } from "@/lib/i18n";

export const Route = createFileRoute("/wishlist")({
  head: ({ match }) => {
    const { t, locale } = headT(match.context);
    return seo(t("Wishlist"), t("Your saved AHAB pieces."), {
      path: "/wishlist",
      index: false,
      locale,
    });
  },
  component: Wishlist,
});

function Wishlist() {
  const { wishlist } = useShop();
  const { products } = useAllProducts();
  const t = useT();
  const items = products.filter((p) => wishlist.includes(p.slug));
  return (
    <div className="mx-auto max-w-[1500px] px-5 py-20 md:px-10">
      <h1 className="text-center text-5xl md:text-6xl">{t("Your wishlist")}</h1>
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">
            {t("Tap the heart on any piece to save it here.")}
          </p>
          <AhabLink to="/shop" className="mt-8">
            {t("Discover the collection")}
          </AhabLink>
        </div>
      ) : (
        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.slug} product={product} showPurchaseOptions />
          ))}
        </div>
      )}
    </div>
  );
}
