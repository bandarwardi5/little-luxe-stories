import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/lib/products";
import pageHeader from "@/assets/page-header-baby.jpg";

export const Route = createFileRoute("/shop")({
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
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHeader title="Shop" crumbs={["Home", "Shop"]} />

      <div className="container mx-auto grid lg:grid-cols-[260px_1fr] gap-8 px-4 py-12">
        {/* Sidebar */}
        <aside className="space-y-6 text-right">
          <div className="border rounded-lg p-5">
            <h3 className="font-bold mb-4 pb-3 border-b">تصفح حسب القسم</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a className="text-primary font-bold">جميع المنتجات (24)</a></li>
              <li><a>ملابس بنات (12)</a></li>
              <li><a>ملابس أولاد (11)</a></li>
              <li><a>ملابس رضع (8)</a></li>
              <li><a>أحذية (9)</a></li>
            </ul>
          </div>
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
          <div className="border rounded-lg p-5">
            <h3 className="font-bold mb-4 pb-3 border-b">تصفية حسب اللون</h3>
            <div className="flex flex-wrap gap-2 justify-end">
              {["#3b82f6", "#8b4513", "#16a34a", "#fb923c", "#ec4899", "#a855f7", "#ef4444", "#eab308"].map((c) => (
                <button key={c} className="w-7 h-7 rounded-full border-2 border-background ring-1 ring-border" style={{ background: c }} />
              ))}
            </div>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-bold mb-4 pb-3 border-b font-ethno uppercase">Size</h3>
            <div className="flex flex-wrap gap-2 justify-end">
              {["S", "M", "L", "XL"].map((s) => (
                <button key={s} className="px-3 py-1 border rounded text-xs hover:bg-primary hover:text-primary-foreground hover:border-primary font-bold">{s}</button>
              ))}
            </div>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-bold mb-4 pb-3 border-b">السعر</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="text-primary font-bold font-ethno uppercase">ALL</li>
              <li>0 - 100 ل.ت</li>
              <li>100 - 300 ل.ت</li>
              <li>300 - 500 ل.ت</li>
              <li>+500 ل.ت</li>
            </ul>
          </div>
        </aside>

        {/* Grid */}
        <div className="text-right">
          <div className="flex items-center justify-between mb-6 flex-row-reverse">
            <p className="text-sm text-muted-foreground font-ethno">Showing 1-{products.length} of {products.length} products</p>
            <select className="border rounded px-3 py-2 text-sm bg-background font-bold outline-none">
              <option>الترتيب الافتراضي</option>
              <option>الأحدث</option>
              <option>السعر: من الأقل</option>
              <option>السعر: من الأعلى</option>
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
