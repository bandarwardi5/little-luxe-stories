import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/lib/products";
import { Plus, Search, Edit2, Trash2, ExternalLink, Filter } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1">إدارة المنتجات</h1>
          <p className="text-muted-foreground">يمكنك إضافة، تعديل أو حذف المنتجات من هنا.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
          <Plus size={20} />
          إضافة منتج جديد
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input 
            type="text" 
            placeholder="ابحث بالاسم أو الرقم التعريفي..." 
            className="w-full bg-secondary/30 border-none rounded-xl pr-10 pl-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border rounded-xl px-4 py-2.5 text-sm font-bold hover:bg-secondary transition-colors">
            <Filter size={18} />
            تصفية
          </button>
          <select className="flex-1 md:flex-none border rounded-xl px-4 py-2.5 text-sm font-bold bg-transparent outline-none">
            <option>جميع الأقسام</option>
            <option>أولاد</option>
            <option>بنات</option>
            <option>رضع</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase font-black">
              <tr>
                <th className="px-6 py-4">المنتج</th>
                <th className="px-6 py-4">القسم</th>
                <th className="px-6 py-4">السعر</th>
                <th className="px-6 py-4">المخزون</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4 text-left">العمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-secondary/50 overflow-hidden shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <div>
                        <h4 className="font-bold line-clamp-1">{product.name}</h4>
                        <p className="text-[10px] text-muted-foreground">ID: #{product.id}2026</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-muted-foreground">{product.category}</td>
                  <td className="px-6 py-4 font-bold text-primary">{product.price} ل.ت</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold">{product.inStock} قطعة</span>
                      <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${product.inStock > 20 ? "bg-emerald-500" : "bg-amber-500"}`} 
                          style={{ width: `${Math.min(product.inStock * 2, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">
                      نشط
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="معاينة">
                        <ExternalLink size={18} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors" title="تعديل">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors" title="حذف">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
