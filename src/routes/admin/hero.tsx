import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, onSnapshot, orderBy } from "firebase/firestore";
import { Plus, Edit2, Trash2, LayoutDashboard, Loader2, X, Save, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/hero")({
  component: AdminHero,
});

function AdminHero() {
  const [heroItems, setHeroItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    ctaText: "",
    ctaLink: "",
    order: 0,
  });

  useEffect(() => {
    const q = query(collection(db, "hero"), orderBy("order", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setHeroItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      subtitle: item.subtitle || "",
      image: item.image || "",
      ctaText: item.ctaText || "",
      ctaLink: item.ctaLink || "",
      order: item.order || 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العنصر؟")) return;
    try {
      await deleteDoc(doc(db, "hero", id));
      toast.success("تم الحذف بنجاح");
    } catch (error) {
      toast.error("فشل الحذف");
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

      if (editingItem) {
        await updateDoc(doc(db, "hero", editingItem.id), data);
        toast.success("تم التحديث بنجاح");
      } else {
        await addDoc(collection(db, "hero"), {
          ...data,
          createdAt: serverTimestamp(),
        });
        toast.success("تم الإضافة بنجاح");
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
    setEditingItem(null);
    setFormData({
      title: "",
      subtitle: "",
      image: "",
      ctaText: "",
      ctaLink: "",
      order: 0,
    });
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1">إدارة قسم الهيرو (الرئيسي)</h1>
          <p className="text-muted-foreground">الصور والتحكم في السلايدر العلوي للمتجر.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          إضافة عنصر جديد
        </button>
      </div>

      {loading ? (
        <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {heroItems.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="aspect-[21/9] bg-secondary relative overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={48} className="text-muted" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white text-right">
                    <h3 className="text-xl font-black">{item.title}</h3>
                    <p className="text-sm opacity-80">{item.subtitle}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex items-center justify-between">
                <div className="text-xs font-bold text-muted-foreground">ترتيب الظهور: {item.order}</div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="p-2.5 rounded-xl bg-secondary hover:bg-primary hover:text-white transition-all">
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 rounded-xl bg-secondary hover:bg-rose-500 hover:text-white transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {heroItems.length === 0 && (
            <div className="md:col-span-2 p-20 text-center border-2 border-dashed rounded-3xl text-muted-foreground">
              <LayoutDashboard size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold">لا يوجد عناصر هيرو حالياً</p>
            </div>
          )}
        </div>
      )}

      {/* Hero Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-black">{editingItem ? "تعديل الهيرو" : "إضافة هيرو جديد"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold block mb-1">العنوان الرئيسي</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold block mb-1">العنوان الفرعي</label>
                  <input 
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <ImageUpload 
                  label="صورة الخلفية"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold block mb-1">نص الزر</label>
                  <input 
                    value={formData.ctaText}
                    onChange={(e) => setFormData({...formData, ctaText: e.target.value})}
                    className="w-full border rounded-xl px-4 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold block mb-1">رابط الزر</label>
                  <input 
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({...formData, ctaLink: e.target.value})}
                    className="w-full border rounded-xl px-4 py-2 outline-none text-left font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold block mb-1">الترتيب</label>
                <input 
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: Number(e.target.value)})}
                  className="w-32 border rounded-xl px-4 py-2 outline-none"
                />
              </div>

              <div className="pt-6 border-t flex gap-3">
                <button 
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  {formLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />}
                  حفظ
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
