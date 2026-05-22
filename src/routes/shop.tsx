import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { useProducts, useCategories } from "@/lib/firestore-hooks";
import pageHeader from "@/assets/page-header-baby.jpg";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const shopSearchSchema = z.object({
  category: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: (search) => shopSearchSchema.parse(search),
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "المتجر | Treemass" },
      { name: "description", content: "تسوق جميع منتجات ملابس الأطفال من البنات والأولاد والرضع في Treemass إسطنبول." },
    ],
  }),
});

function PageHeader({ title, crumbs }: { title: string; crumbs: string[] }) {
  return (
    <div className="relative bg-secondary overflow-hidden">
      <img src={pageHeader} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
      <div className="relative container mx-auto px-4 py-14 text-center">
        <p className="text-xs text-muted-foreground mb-2 font-ethno uppercase tracking-widest">{crumbs.join(" / ")}</p>
        <h1 className="text-3xl md:text-4xl font-bold font-ethno uppercase">{title}</h1>
      </div>
    </div>
  );
}

function ShopPage() {
  const { category } = Route.useSearch();
  const { data: products, loading: productsLoading } = useProducts();
  const { data: categories, loading: categoriesLoading } = useCategories();

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const filteredProducts = category 
    ? products.filter(p => p.category === category)
    : products;

  return (
    <div className="min-h-screen bg-background text-right" dir="rtl">
      <Header />
      <PageHeader title={category || "Shop"} crumbs={["Home", "Shop", ...(category ? [category] : [])]} />

      <div className="container mx-auto grid lg:grid-cols-[260px_1fr] gap-8 px-4 py-12">
        {/* Sidebar */}
        <aside className="space-y-6 text-right order-2 lg:order-1">
          <div className="border rounded-lg p-5">
            <h3 className="font-bold mb-4 pb-3 border-b">تصفح حسب القسم</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button 
                  onClick={() => Route.useNavigate()({ search: { category: undefined } })}
                  className={`${!category ? 'text-primary font-bold' : ''} hover:text-primary transition-colors`}
                >
                  جميع المنتجات ({products.length})
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button 
                    onClick={() => Route.useNavigate()({ search: { category: c.name } })}
                    className={`${category === c.name ? 'text-primary font-bold' : ''} hover:text-primary transition-colors`}
                  >
                    {c.name} ({products.filter(p => p.category === c.name).length})
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* ... بقية الـ Sidebar ... */}
          <div className="border rounded-lg p-5">
            <h3 className="font-bold mb-4 pb-3 border-b">المميز</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="text-primary font-bold">جميع المنتجات</li>
              <li>الأكثر مبيعًا</li>
              <li>وصل حديثًا</li>
              <li>التخفيضات</li>
              <li>منتجات مميزة</li>
            </ul>
          </div>

        </aside>

        {/* Grid */}
        <div className="text-right order-1 lg:order-2">
          <div className="flex items-center justify-between mb-6 flex-row-reverse">
            <p className="text-sm text-muted-foreground font-ethno">Showing 1-{filteredProducts.length} of {filteredProducts.length} products</p>
            <select className="border rounded px-3 py-2 text-sm bg-background font-bold outline-none">
              <option>الترتيب الافتراضي</option>
              <option>الأحدث</option>
              <option>السعر: من الأقل</option>
              <option>السعر: من الأعلى</option>
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
