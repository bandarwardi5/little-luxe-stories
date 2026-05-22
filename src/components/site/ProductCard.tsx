import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";
import { imageUrl } from "@/lib/firebase";
import { useSettings } from "@/lib/firestore-hooks";
import { useCart } from "@/lib/cart-context";

export function ProductCard({ product }: { product: Product }) {
  const { settings } = useSettings();
  const { add: addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <div className="group bg-card border rounded-lg p-4 transition hover:shadow-lg">
      <Link to="/product/$id" params={{ id: String(product.id) }} className="block relative">
        {product.badge && (
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-[11px] font-bold px-2 py-1 rounded z-10">
            {product.badge}
          </span>
        )}
        <div className="aspect-square overflow-hidden rounded-md bg-secondary/40 mb-4">
          <img
            src={imageUrl(product.image)}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
          />
        </div>
      </Link>
      <Link to="/product/$id" params={{ id: String(product.id) }}>
        <h3 className="text-sm font-medium line-clamp-2 min-h-10 hover:text-primary">
          {product.name}
        </h3>
      </Link>

      <div className="flex items-baseline gap-2 mb-3">
        {product.oldPrice && (
          <span className="text-xs text-muted-foreground line-through">{product.oldPrice} {settings?.currency || "ل.ت"}</span>
        )}
        <span className="text-primary font-bold">{product.price} {settings?.currency || "ل.ت"}</span>
      </div>
      <button 
        onClick={handleAdd}
        className="w-full text-xs font-semibold uppercase tracking-wide bg-secondary hover:bg-primary hover:text-primary-foreground transition py-2.5 rounded active:scale-95"
      >
        أضف إلى السلة
      </button>
    </div>
  );
}

