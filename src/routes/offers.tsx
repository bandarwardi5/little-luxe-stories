import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { useProducts } from "@/lib/firestore-hooks";
import { Sparkles, Percent, Tag, Loader2 } from "lucide-react";
import pageHeader from "@/assets/page-header-baby.jpg";

export const Route = createFileRoute("/offers")({
  component: OffersPage,
  head: () => ({
    meta: [
      { title: "أفضل العروض | Treemass" },
      { name: "description", content: "اكتشف أفضل العروض والتخفيضات على ملابس الأطفال في Treemass." },
    ],
  }),
});

function OffersPage() {
  const { data: products, loading } = useProducts();
  const offerProducts = products.filter(p => p.oldPrice);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col text-right" dir="rtl">
      <Header />

      <div className="relative bg-banner-peach overflow-hidden">
        <img src={pageHeader} alt="عروض Treemass" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" />
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full mb-6 shadow-lg rotate-12">
            <Percent className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-ethno uppercase">Hot Offers</h1>
          <p className="text-lg max-w-2xl mx-auto text-foreground/80 font-medium">
            لا تفوت فرصة الحصول على أفضل ملابس الأطفال بأسعار مخفضة. تسوق الآن قبل نفاذ الكمية!
          </p>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">عروض حصرية لكِ</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-lg">
            <Tag className="w-4 h-4" />
            <span>{offerProducts.length} منتجات مخفضة</span>
          </div>
        </div>

        {offerProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {offerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-2">لا توجد عروض حالياً</h3>
            <p className="text-muted-foreground">تابعنا للحصول على أحدث العروض قريباً.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}