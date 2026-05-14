import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
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
            src={product.image}
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
      <div className="flex items-center gap-0.5 my-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${i < (product.rating ?? 5) ? "fill-star text-star" : "text-muted"}`}
          />
        ))}
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        {product.oldPrice && (
          <span className="text-xs text-muted-foreground line-through">{product.oldPrice} ل.ت</span>
        )}
        <span className="text-primary font-bold">{product.price} ل.ت</span>
      </div>
      <button className="w-full text-xs font-semibold uppercase tracking-wide bg-secondary hover:bg-primary hover:text-primary-foreground transition py-2.5 rounded">
        أضف إلى السلة
      </button>
    </div>
  );
}
