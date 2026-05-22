import { createFileRoute } from "@tanstack/react-router";
import { useCategories } from "@/lib/firestore-hooks";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Plus, Edit2, Trash2, MoveVertical, Loader2, X, Save, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const { data: categories, loading } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    color: "bg-blue-100",
    count: 0
  });

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      image: category.image || "",
      color: category.color || "bg-blue-100",
      count: category.count || 0
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;
    try {
      await deleteDoc(doc(db, "categories", id));
      toast.success("تم حذف القسم بنجاح");
    } catch (error) {
      toast.error("فشل حذف القسم");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const data = {
        ...formData,
        updatedAt: serverTimestamp(),
      };

      if (editingCategory) {
        await updateDoc(doc(db, "categories", editingCategory.id), data);
        toast.success("تم تحديث القسم بنجاح");
      } else {
        await addDoc(collection(db, "categories"), {
          ...data,
          createdAt: serverTimestamp(),
        });
        toast.success("تم إضافة القسم بنجاح");
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      image: "",
      color: "bg-blue-100",
      count: 0
    });
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1">إدارة الأقسام</h1>
          <p className="text-muted-foreground">تنظيم تصنيفات المتجر والأقسام الرئيسية.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          إضافة قسم جديد
        </button>
      </div>

      {loading ? (
        <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl border overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className={`h-32 ${category.color || 'bg-secondary'} flex items-center justify-between px-6 relative overflow-hidden`}>
                <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12 w-24 h-24">
                  {category.image ? <img src={category.image} className="w-full h-full object-contain" /> : <ImageIcon size={80} />}
                </div>
                <h3 className="text-xl font-black relative z-10">{category.name}</h3>
                <div className="bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black relative z-10">
                  {category.count || 0} منتج
                </div>
              </div>
              
              <div className="p-6 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(category)}
                    className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-white transition-all">
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-rose-500 hover:text-white transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Category Card */}
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="border-2 border-dashed border-muted rounded-2xl flex flex-col items-center justify-center p-12 gap-4 text-muted-foreground hover:border-primary hover:text-primary transition-all group min-h-[200px]"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Plus size={32} />
            </div>
            <span className="font-bold">إضافة قسم جديد</span>
          </button>
        </div>
      )}

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-black">{editingCategory ? "تعديل قسم" : "إضافة قسم جديد"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 text-right">
              <div>
                <label className="text-sm font-bold block mb-2">اسم القسم *</label>
                <input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="md:col-span-2">
                <ImageUpload 
                  label="أيقونة القسم"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>

              <div>
                <label className="text-sm font-bold block mb-2">لون الخلفية (Tailwind class)</label>
                <select 
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 outline-none text-right"
                >
                  <option value="bg-blue-100">أزرق فاتح</option>
                  <option value="bg-emerald-100">أخضر فاتح</option>
                  <option value="bg-rose-100">وردي فاتح</option>
                  <option value="bg-amber-100">كهرماني فاتح</option>
                  <option value="bg-purple-100">بنفسجي فاتح</option>
                  <option value="bg-secondary">رمادي فاتح</option>
                </select>
              </div>

              <div className="pt-6 border-t flex gap-3">
                <button 
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  {formLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />}
                  {editingCategory ? "حفظ التغييرات" : "إضافة القسم"}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
