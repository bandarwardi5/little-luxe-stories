import { createFileRoute } from "@tanstack/react-router";
import { categories } from "@/lib/products";
import { Plus, Edit2, Trash2, MoveVertical, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1">إدارة الأقسام</h1>
          <p className="text-muted-foreground">تنظيم تصنيفات المتجر والأقسام الرئيسية.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
          <Plus size={20} />
          إضافة قسم جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, i) => (
          <div key={i} className="bg-white rounded-2xl border overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className={`h-24 ${category.color} flex items-center justify-between px-6 relative overflow-hidden`}>
              <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                <ImageIcon size={100} />
              </div>
              <h3 className="text-xl font-black relative z-10">{category.name}</h3>
              <div className="bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black relative z-10">
                {category.count} منتج
              </div>
            </div>
            
            <div className="p-6 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-white transition-all">
                  <Edit2 size={18} />
                </button>
                <button className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-rose-500 hover:text-white transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
              <button className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground cursor-grab active:cursor-grabbing hover:bg-secondary transition-all">
                <MoveVertical size={18} />
              </button>
            </div>
          </div>
        ))}

        {/* Add Category Card */}
        <button className="border-2 border-dashed border-muted rounded-2xl flex flex-col items-center justify-center p-12 gap-4 text-muted-foreground hover:border-primary hover:text-primary transition-all group">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Plus size={32} />
          </div>
          <span className="font-bold">إضافة قسم جديد</span>
        </button>
      </div>
    </div>
  );
}
