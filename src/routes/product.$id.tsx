import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { useProduct, useProducts, useSettings } from "@/lib/firestore-hooks";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { Heart, Minus, Plus, Loader2, ShoppingBag, CheckCircle2 } from "lucide-react";
import { imageUrl } from "@/lib/firebase";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
  head: () => ({
    meta: [
      { title: "منتج | Treemass" },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">المنتج غير موجود</h1>
        <Link to="/shop" className="text-primary font-ethno uppercase">Back to shop</Link>
      </div>
    </div>
  ),
});

function ProductPage() {
  const { id } = Route.useParams();
  const { product, loading } = useProduct(id);
  const { data: allProducts, loading: productsLoading } = useProducts();
  const { settings } = useSettings();
  const { add: addToCart } = useCart();
  const { toggle: toggleWishlist, has: isInWishlist } = useWishlist();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (product?.image) {
      setActiveImg(product.image);
    }
  }, [product]);

  if (loading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) throw notFound();

  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 5);
  const currency = settings?.currency || "ل.ت";

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    }, qty);
  };

  const handleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.image];


  return (
    <div className="min-h-screen bg-background text-right" dir="rtl">
      <Header />

      <div className="bg-secondary/30 py-6 border-b">
        <div className="container mx-auto px-4 text-xs md:text-sm text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link> 
          <span>/</span> 
          <Link to="/shop" className="hover:text-primary transition-colors">المتجر</Link> 
          <span>/</span> 
          <span className="text-foreground font-medium">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square bg-secondary/20 rounded-3xl overflow-hidden border-2 border-secondary/50 shadow-inner group">
              <img 
                src={imageUrl(activeImg)} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImg(img)}
                    className={`aspect-square rounded-2xl border-2 transition-all overflow-hidden bg-white ${activeImg === img ? "border-primary shadow-lg shadow-primary/10" : "border-secondary/50 hover:border-primary/50"}`}
                  >
                    <img src={imageUrl(img)} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full w-max mb-6">
              <span className="text-[10px] font-black uppercase tracking-wider">TreeMass Kids Fashion</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black mb-4 text-foreground leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-black text-primary">{product.price} {currency}</span>
              {product.oldPrice && (
                <span className="text-xl text-muted-foreground line-through opacity-50">{product.oldPrice} {currency}</span>
              )}
            </div>

            <div className="p-6 bg-secondary/20 rounded-3xl border border-secondary/50 mb-8">
              <p className="text-muted-foreground leading-relaxed text-lg">
                {product.description || "لا يوجد وصف لهذا المنتج حالياً."}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center bg-white border-2 border-secondary rounded-2xl p-1">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-secondary rounded-xl transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-black text-xl">{qty}</span>
                  <button 
                    onClick={() => setQty(qty + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-secondary rounded-xl transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-primary-foreground font-black py-4 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
                >
                  <ShoppingBag className="w-6 h-6" />
                  أضف إلى السلة
                </button>

                <button 
                  onClick={handleWishlist}
                  className={`w-14 h-14 flex items-center justify-center rounded-2xl border-2 transition-all ${
                    isInWishlist(product.id) 
                      ? "bg-rose-50 border-rose-200 text-rose-500 shadow-rose-100" 
                      : "border-secondary hover:bg-secondary text-muted-foreground"
                  } shadow-lg`}
                >
                  <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? "fill-rose-500" : ""}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-emerald-800">متوفر في المخزن</p>
                    <p className="text-[10px] text-emerald-600">{product.inStock} قطعة متاحة</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white font-black text-[10px]">!</div>
                  <div>
                    <p className="text-xs font-bold text-amber-800">شحن سريع</p>
                    <p className="text-[10px] text-amber-600">توصيل خلال 2-4 أيام</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section Below */}
        <div className="mt-20 border-t pt-12">
          <h2 className="text-2xl font-black mb-8">تفاصيل المنتج الإضافية</h2>
          <div className="prose prose-stone max-w-none text-muted-foreground">
            <p className="text-lg leading-relaxed mb-6">
              هذا المنتج مصمم بعناية فائقة من أجل راحة أطفالكم. نستخدم أفضل الخامات القطنية الطبيعية التي تسمح لبشرة الطفل بالتنفس وتمنع التهيج.
            </p>
            <ul className="grid md:grid-cols-2 gap-4 list-none p-0">
              <li className="flex items-center gap-3 bg-secondary/10 p-4 rounded-xl">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>خامات عالية الجودة ومقاومة للغسيل المتكرر</span>
              </li>
              <li className="flex items-center gap-3 bg-secondary/10 p-4 rounded-xl">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>تصميم مريح يسمح بحرية الحركة للطفل</span>
              </li>
              <li className="flex items-center gap-3 bg-secondary/10 p-4 rounded-xl">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>ألوان ثابتة وزاهية تدوم طويلاً</span>
              </li>
              <li className="flex items-center gap-3 bg-secondary/10 p-4 rounded-xl">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>مثالي للمناسبات والاستخدام اليومي</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Related */}
        <div className="mt-24">
          <h2 className="text-2xl font-black text-center mb-12">منتجات قد تنال إعجابك</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

