import { Link } from "@tanstack/react-router";
import type { FsProduct } from "@/lib/firestore-hooks";
import { imageUrl } from "@/lib/firebase";
import { useSettings, useCategories } from "@/lib/firestore-hooks";
import { useWishlist } from "@/lib/wishlist-context";
import { useLang, getLocalizedCurrency, tl as tlStatic } from "@/lib/i18n";
import { ShoppingBag, Heart } from "lucide-react";

type CardProduct = Pick<FsProduct, "id" | "name" | "price" | "image"> &
  Partial<Pick<FsProduct, "oldPrice" | "badge" | "category">>;

export function ProductCard({ product }: { product: CardProduct }) {
  const { settings } = useSettings();
  const { toggle: toggleWishlist, has: isInWishlist } = useWishlist();
  const { lang, tl, t, dir } = useLang();
  const { data: categories } = useCategories();

  const name = tl(product.name);
  const currency = getLocalizedCurrency(settings?.currency, lang);

  // Resolve localized category by looking up the categories collection
  const rawCategory = product.category;
  const catLabel = (() => {
    if (!rawCategory) return "";
    const arName = typeof rawCategory === "string" ? rawCategory : (rawCategory as any)?.ar;
    const match = categories.find((c) => {
      const cAr = typeof c.name === "string" ? c.name : (c.name as any)?.ar;
      return cAr && arName && cAr === arName;
    });
    if (match) return tl(match.name as any);
    return tl(rawCategory as any);
  })();


  // Calculate discount percentage
  const discount = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  const isFav = isInWishlist(product.id);

  return (
    <div className="group bg-white rounded-[24px] border border-neutral-100 p-2 sm:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full relative">
      <div>
        {/* Product Image & Badges Container */}
        <Link to="/product/$id" params={{ id: String(product.id) }} className="block relative mb-2 sm:mb-4">
          
          {/* Heart/Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2 sm:top-2.5 z-10 p-1.5 sm:p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 shadow-sm ${
              dir === "rtl" ? "left-2 sm:left-2.5" : "right-2 sm:right-2.5"
            } ${
              isFav 
                ? "bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-100/80" 
                : "bg-white/80 border-neutral-100 text-neutral-500 hover:bg-white hover:text-rose-500"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 active:scale-75 ${isFav ? "fill-rose-500 scale-110" : ""}`} />
          </button>

          {/* Badges */}
          <div className={`absolute top-2 sm:top-2.5 z-10 flex flex-col gap-1 sm:gap-1.5 ${
            dir === "rtl" ? "right-2 sm:right-2.5" : "left-2 sm:left-2.5"
          }`}>
            {product.badge && (
              <span className="bg-primary/95 text-primary-foreground text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm backdrop-blur-sm uppercase tracking-wider">
                {tl(product.badge as any)}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-rose-500 text-white text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm">
                -{discount}%
              </span>
            )}
          </div>

          {/* Image Shell */}
          <div className="aspect-[3/4] overflow-hidden rounded-[20px] bg-neutral-50 border border-neutral-100/50 relative flex items-center justify-center p-0 group-hover:bg-neutral-100/30 transition-colors duration-300">
            <img
              src={imageUrl(product.image)}
              alt={name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </Link>

        {/* Product Details */}
        <div className="px-1 text-start">
          {product.category && (
            <span className="text-[10px] font-extrabold text-primary tracking-wider uppercase mb-1 block">
              {tl(product.category as any)}
            </span>
          )}
          <Link to="/product/$id" params={{ id: String(product.id) }}>
            <h3 className="font-extrabold text-sm text-foreground/80 group-hover:text-primary transition-colors line-clamp-2 min-h-[40px] leading-tight mb-2">
              {name}
            </h3>
          </Link>
        </div>
      </div>

      {/* Pricing & Add to Cart */}
      <div className="px-1 mt-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary font-black text-sm sm:text-lg">{product.price} {currency}</span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-[10px] sm:text-xs text-muted-foreground/60 line-through font-semibold">{product.oldPrice} {currency}</span>
          )}
        </div>

        <Link
          to="/product/$id"
          params={{ id: String(product.id) }}
          className="w-full bg-secondary/80 text-foreground group-hover:bg-primary group-hover:text-primary-foreground font-extrabold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-1.5 text-xs sm:text-sm shadow-sm cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform group-hover:rotate-12" />
          {t("product.view_details")}
        </Link>
      </div>
    </div>
  );
}
