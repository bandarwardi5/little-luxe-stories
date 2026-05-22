import { createFileRoute } from "@tanstack/react-router";
import { useProducts, useCategories } from "@/lib/firestore-hooks";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Plus, Search, Edit2, Trash2, ExternalLink, Filter, Loader2, X, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { MultiLangInput } from "@/components/admin/MultiLangInput";
import { tl } from "@/lib/i18n";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const { data: products, loading } = useProducts();
  const { data: categories } = useCategories();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsMenuOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: { ar: "", tr: "", en: "" },
    price: 0,
    oldPrice: 0,
    category: "",
    inStock: 10,
    description: { ar: "", tr: "", en: "" },
    image: "",
    images: [] as string[],
  });

  const filteredProducts = products.filter(p =>
    tl(p.name as any, "ar").toLowerCase().includes(search.toLowerCase()) ||
    tl(p.category as any, "ar").toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: typeof product.name === "string" ? { ar: product.name } : product.name || { ar: "" },
      price: product.price,
      oldPrice: product.oldPrice || 0,
      category: product.category,
      inStock: product.inStock,
      description: typeof product.description === "string" ? { ar: product.description } : product.description || { ar: "" },
      image: product.image,
      images: product.images || [],
    });
    setIsMenuOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("تم حذف المنتج بنجاح");
    } catch (error) {
      toast.error("فشل حذف المنتج");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        oldPrice: Number(formData.oldPrice),
        inStock: Number(formData.inStock),
        updatedAt: serverTimestamp(),
      };

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), data);
        toast.success("تم تحديث المنتج بنجاح");
      } else {
        await addDoc(collection(db, "products"), {
          ...data,
          createdAt: serverTimestamp(),
        });
        toast.success("تم إضافة المنتج بنجاح");
      }
      setIsMenuOpen(false);
      resetForm();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: { ar: "", tr: "", en: "" },
      price: 0,
      oldPrice: 0,
      category: categories[0] ? tl(categories[0].name as any, "ar") : "",
      inStock: 10,
      description: { ar: "", tr: "", en: "" },
      image: "",
      images: [],
    });
  };


  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1">إدارة المنتجات</h1>
          <p className="text-muted-foreground">يمكنك إضافة، تعديل أو حذف المنتجات من هنا.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsMenuOpen(true); }}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو القسم..." 
            className="w-full bg-secondary/30 border-none rounded-xl pr-10 pl-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-right"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="flex-1 md:flex-none border rounded-xl px-4 py-2.5 text-sm font-bold bg-transparent outline-none text-right">
            <option>جميع الأقسام</option>
            {categories.map(c => <option key={c.id} value={tl(c.name as any, "ar")}>{tl(c.name as any, "ar")}</option>)}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase font-black">
                <tr>
                  <th className="px-6 py-4">المنتج</th>
                  <th className="px-6 py-4">القسم</th>
                  <th className="px-6 py-4">السعر</th>
                  <th className="px-6 py-4">المخزون</th>
                  <th className="px-6 py-4 text-left">العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-secondary/50 overflow-hidden shrink-0">
                          <img src={product.image} alt={tl(product.name as any, "ar")} className="w-full h-full object-contain p-1" />
                        </div>
                        <div>
                          <h4 className="font-bold line-clamp-1">{tl(product.name as any, "ar")}</h4>
                          <p className="text-[10px] text-muted-foreground">ID: #{product.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-muted-foreground">{tl(product.category as any, "ar")}</td>
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
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors" title="تعديل">
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors" title="حذف">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-black">{editingProduct ? "تعديل منتج" : "إضافة منتج جديد"}</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-right">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <MultiLangInput
                    label="اسم المنتج"
                    required
                    value={formData.name}
                    onChange={(v) => setFormData({ ...formData, name: v })}
                  />
                </div>

                <div>
                  <label className="text-sm font-bold block mb-2">القسم *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full border rounded-xl px-4 py-2.5 outline-none text-right"
                  >
                    <option value="">اختر قسماً</option>
                    {categories.map(c => <option key={c.id} value={tl(c.name as any, "ar")}>{tl(c.name as any, "ar")}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold block mb-2">المخزون *</label>
                  <input 
                    type="number"
                    required
                    value={formData.inStock}
                    onChange={(e) => setFormData({...formData, inStock: Number(e.target.value)})}
                    className="w-full border rounded-xl px-4 py-2.5 outline-none text-right"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold block mb-2">السعر الحالي (ل.ت) *</label>
                  <input 
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full border rounded-xl px-4 py-2.5 outline-none text-right font-bold text-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold block mb-2">السعر قبل الخصم (اختياري)</label>
                  <input 
                    type="number"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({...formData, oldPrice: Number(e.target.value)})}
                    className="w-full border rounded-xl px-4 py-2.5 outline-none text-right text-muted-foreground line-through"
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">صور المنتج الإضافية</h3>
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, images: [...formData.images, ""] })}
                      className="text-xs bg-secondary px-3 py-1 rounded-lg font-bold hover:bg-primary hover:text-white transition-colors"
                    >
                      + إضافة صورة
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <ImageUpload 
                      label="الصورة الرئيسية (الغلاف)"
                      value={formData.image}
                      onChange={(url) => setFormData({ ...formData, image: url })}
                    />
                    
                    {formData.images.map((img: string, idx: number) => (
                      <div key={idx} className="relative p-4 border rounded-2xl bg-secondary/10">
                        <button 
                          type="button"
                          onClick={() => {
                            const newImages = [...formData.images];
                            newImages.splice(idx, 1);
                            setFormData({ ...formData, images: newImages });
                          }}
                          className="absolute top-2 left-2 p-1 bg-rose-500 text-white rounded-full hover:scale-110 transition-transform z-10"
                        >
                          <X size={14} />
                        </button>
                        <ImageUpload 
                          label={`صورة إضافية ${idx + 1}`}
                          value={img}
                          onChange={(url) => {
                            const newImages = [...formData.images];
                            newImages[idx] = url;
                            setFormData({ ...formData, images: newImages });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <MultiLangInput
                    label="الوصف"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={(v) => setFormData({ ...formData, description: v })}
                  />
                </div>
              </div>

              <div className="pt-6 border-t flex gap-3">
                <button 
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  {formLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />}
                  {editingProduct ? "حفظ التغييرات" : "إضافة المنتج"}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 bg-secondary text-foreground font-bold py-3 rounded-xl hover:bg-secondary/80 transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
