import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { useProducts, useCategories } from "@/lib/firestore-hooks";
import pageHeader from "@/assets/page-header-baby.jpg";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useLang } from "@/lib/i18n";

const shopSearchSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
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
  const { category, search } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: products, loading: productsLoading } = useProducts();
  const { data: categories, loading: categoriesLoading } = useCategories();
  const { t, tl, dir, lang } = useLang();

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  let filteredProducts = category 
    ? products.filter(p => {
        const pCat = tl(p.category);
        return pCat === category || (typeof p.category === 'string' && p.category === category);
      })
    : products;

  if (search) {
    const s = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => {
      const name = tl(p.name).toLowerCase();
      const code = p.code ? String(p.code).toLowerCase() : "";
      return name.includes(s) || code.includes(s);
    });
  }

  return (
    <div className="min-h-screen bg-background text-start" dir={dir}>
      <Header />
      <PageHeader title={tl(category) || t("shop.title")} crumbs={[t("nav.home"), t("nav.shop"), ...(category ? [tl(category)] : [])]} />

      <div className="container mx-auto grid lg:grid-cols-[260px_1fr] gap-8 px-4 py-12">
        {/* Sidebar */}
        <aside className={`space-y-6 text-start ${dir === 'rtl' ? 'order-2 lg:order-1' : 'order-2 lg:order-1'}`}>
          <div className="border rounded-lg p-5">
            <h3 className="font-bold mb-4 pb-3 border-b">{t("shop.by_category")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button 
                  onClick={() => navigate({ search: { category: undefined } })}
                  className={`${!category ? 'text-primary font-bold' : ''} hover:text-primary transition-colors`}
                >
                  {t("shop.all")} ({products.length})
                </button>
              </li>
              {categories.map((c) => {
                const catName = tl(c.name);
                const count = products.filter(p => {
                  const pCat = tl(p.category);
                  return pCat === catName || (typeof p.category === 'string' && p.category === (typeof c.name === 'string' ? c.name : (c.name as any)?.ar));
                }).length;
                
                return (
                  <li key={c.id}>
                    <button 
                      onClick={() => navigate({ search: { category: typeof c.name === "string" ? c.name : (c.name as any)?.ar || catName } })}
                      className={`${category === catName || category === (typeof c.name === "string" ? c.name : (c.name as any)?.ar) ? 'text-primary font-bold' : ''} hover:text-primary transition-colors`}
                    >
                      {catName} ({count})
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Grid */}
        <div className="text-start order-1 lg:order-2">
          <div className={`flex items-center justify-between mb-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <p className="text-sm text-muted-foreground font-ethno">
              {t("shop.showing")} 1-{filteredProducts.length} {t("shop.of")} {filteredProducts.length} {t("shop.products")}
            </p>
            <select className="border rounded px-3 py-2 text-sm bg-background font-bold outline-none">
              <option>{lang === 'ar' ? 'الترتيب الافتراضي' : lang === 'tr' ? 'Varsayılan Sıralama' : 'Default Sorting'}</option>
              <option>{lang === 'ar' ? 'الأحدث' : lang === 'tr' ? 'En Yeni' : 'Latest'}</option>
              <option>{lang === 'ar' ? 'السعر: من الأقل' : lang === 'tr' ? 'Fiyat: Düşükten Yükseğe' : 'Price: Low to High'}</option>
              <option>{lang === 'ar' ? 'السعر: من الأعلى' : lang === 'tr' ? 'Fiyat: Yüksekten Düşüğe' : 'Price: High to Low'}</option>
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
