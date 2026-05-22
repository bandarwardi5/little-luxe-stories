import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { useWishlist } from "@/lib/wishlist-context";
import { Heart, HeartCrack, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({
    meta: [
      { title: "المفضلة | Treemass" },
      { name: "description", content: "قائمة المنتجات المفضلة لديك في متجر Treemass." },
    ],
  }),
});

function WishlistPage() {
  const { items: wishlistItems, remove } = useWishlist();

  return (
    <div className="min-h-screen bg-background flex flex-col text-right" dir="rtl">
      <Header />

      <div className="bg-secondary/30 py-10 border-b">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
            <Heart className="w-6 h-6 fill-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">قائمة المفضلة</h1>
            <p className="text-sm text-muted-foreground">{wishlistItems.length} منتجات في قائمتك</p>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-12">
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <div key={product.id} className="relative group">
                <button 
                  onClick={() => remove(product.id)}
                  className="absolute top-2 left-2 z-20 w-8 h-8 bg-white/80 hover:bg-white backdrop-blur rounded-full flex items-center justify-center text-destructive shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <HeartCrack className="w-4 h-4" />
                </button>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-muted-foreground mb-6">
              <Heart className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold mb-2">قائمتك المفضلة فارغة</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              لم تقم بإضافة أي منتجات إلى قائمتك المفضلة بعد. تصفح منتجاتنا وأضف ما يعجبك هنا لسهولة الوصول إليه لاحقاً.
            </p>
            <Link to="/shop" className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-lg shadow-sm hover:opacity-90 transition inline-flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              ابدأ التسوق
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}