import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/lib/products";
import { Star, Heart, Minus, Plus, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
  head: ({ params }) => {
    const p = products.find((x) => String(x.id) === params.id);
    return {
      meta: [
        { title: p ? `${p.name} | Treemass` : "منتج | Treemass" },
        { name: "description", content: p?.description ?? "" },
      ],
    };
  },
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
  const product = products.find((p) => String(p.id) === id);
  if (!product) throw notFound();

  const related = products.filter((p) => String(p.id) !== String(product.id)).slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="bg-secondary py-6">
        <div className="container mx-auto px-4 text-sm text-muted-foreground">
          <Link to="/">الرئيسية</Link> / <Link to="/shop">المتجر</Link> / <span>{product.category}</span> / <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <div className="space-y-3">
              {[product.image, product.image, product.image, product.image].map((img, i) => (
                <div key={i} className="aspect-square border rounded overflow-hidden bg-secondary/40">
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
            <div className="aspect-square border rounded-lg overflow-hidden bg-secondary/30">
              <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-primary font-bold mb-2 font-ethno">BRAND: TREEMASS</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-primary">{product.price} ل.ت</span>
              {product.oldPrice && <span className="text-muted-foreground line-through">{product.oldPrice} ل.ت</span>}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < (product.rating ?? 5) ? "fill-star text-star" : "text-muted"}`} />
                ))}
                <span className="text-xs text-muted-foreground mr-1">(تقييم 1)</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">🔥 تم بيع 3 منتجات في آخر 20 ساعة</p>
            <p className="leading-relaxed mb-6">{product.description}</p>

            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">اللون:</p>
              <div className="flex gap-2">
                {["#f59e0b", "#0ea5e9", "#ec4899"].map((c) => (
                  <button key={c} className="w-10 h-10 rounded border-2 border-background ring-1 ring-border" style={{ background: c }} />
                ))}
              </div>
            </div>

            <div className="inline-block bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded mb-6">
              {product.inStock} متوفر في المخزن
            </div>

            <div className="flex items-stretch gap-3 mb-3">
              <div className="flex items-center border rounded">
                <button className="px-3"><Minus className="h-4 w-4" /></button>
                <span className="px-4 font-semibold">1</span>
                <button className="px-3"><Plus className="h-4 w-4" /></button>
              </div>
              <button className="flex-1 bg-primary text-primary-foreground font-bold uppercase tracking-wide rounded py-3">
                أضف إلى السلة
              </button>
            </div>
            <button className="w-full bg-foreground text-background font-bold uppercase tracking-wide rounded py-3 mb-5">
              اشتري الآن
            </button>

            <div className="flex items-center gap-5 text-sm text-muted-foreground">
              <button className="flex items-center gap-1.5"><BarChart3 className="h-4 w-4" /> قارن</button>
              <button className="flex items-center gap-1.5"><Heart className="h-4 w-4" /> أضف للمفضلة</button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="border-b flex gap-8 text-sm">
            <button className="pb-3 border-b-2 border-primary text-primary font-semibold">الوصف</button>
            <button className="pb-3 text-muted-foreground">معلومات إضافية</button>
            <button className="pb-3 text-muted-foreground">التقييمات (1)</button>
            <button className="pb-3 text-muted-foreground">الشحن والإرجاع</button>
          </div>
          <div className="py-8 max-w-3xl">
            <h3 className="font-bold mb-4">عن هذا المنتج</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {product.description} مصنوع من خامات عالية الجودة وآمنة على بشرة طفلك. الألوان ثابتة لا تبهت مع الغسيل المتكرر، والقصة مدروسة لتمنح طفلك راحة كاملة طوال اليوم.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              يتميز المنتج بسهولة الغسيل والعناية، ويأتي ضمن مجموعتنا الجديدة المستوحاة من أحدث صيحات موضة الأطفال العالمية. مثالي للاستخدام اليومي والمناسبات.
            </p>
          </div>
        </div>

        {/* Related */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">قد يعجبك أيضًا</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
