import { createFileRoute } from "@tanstack/react-router";
import { useBanners } from "@/lib/firestore-hooks";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Plus, Edit2, Trash2, Layout, Loader2, X, Save, ExternalLink, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/banners")({
  component: AdminBanners,
});

function AdminBanners() {
  const { data: banners, loading } = useBanners();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    ctaText: "",
    ctaLink: "",
    image: "",
    bgColor: "bg-blue-500",
    order: 0,
    active: true,
  });

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      ctaText: banner.ctaText || "",
      ctaLink: banner.ctaLink || "",
      image: banner.image || "",
      bgColor: banner.bgColor || "bg-blue-500",
      order: banner.order || 0,
      active: banner.active !== undefined ? banner.active : true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا البانر؟")) return;
    try {
      await deleteDoc(doc(db, "banners", id));
      toast.success("تم حذف البانر بنجاح");
    } catch (error) {
      toast.error("فشل حذف البانر");
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

      if (editingBanner) {
        await updateDoc(doc(db, "banners", editingBanner.id), data);
        toast.success("تم تحديث البانر بنجاح");
      } else {
        await addDoc(collection(db, "banners"), {
          ...data,
          createdAt: serverTimestamp(),
        });
        toast.success("تم إضافة البانر بنجاح");
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
    setEditingBanner(null);
    setFormData({
      title: "",
      subtitle: "",
      ctaText: "",
      ctaLink: "",
      image: "",
      bgColor: "bg-blue-500",
      order: 0,
      active: true,
    });
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1">إدارة البانرز</h1>
          <p className="text-muted-foreground">إدارة الإعلانات والبانرز في الصفحة الرئيسية.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          إضافة بانر جديد
        </button>
      </div>

      {loading ? (
        <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-2xl border overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row">
              <div className={`md:w-64 h-48 md:h-auto ${banner.bgColor} flex items-center justify-center p-6 relative overflow-hidden shrink-0`}>
                {banner.image ? (
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-contain relative z-10" />
                ) : (
                  <ImageIcon size={64} className="text-white/50" />
                )}
                <div className="absolute inset-0 bg-black/5"></div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${banner.active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {banner.active ? "نشط" : "متوقف"}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">ترتيب: {banner.order}</span>
                  </div>
                  <h3 className="text-xl font-black mb-1">{banner.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{banner.subtitle}</p>
                  
                  {banner.ctaText && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-xs font-bold">
                      <ExternalLink size={14} />
                      {banner.ctaText}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-6">
                  <button 
                    onClick={() => handleEdit(banner)}
                    className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-white transition-all font-bold text-sm">
                    <Edit2 size={16} />
                    تعديل البانر
                  </button>
                  <button 
                    onClick={() => handleDelete(banner.id)}
                    className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-rose-500 hover:text-white transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {banners.length === 0 && (
            <div className="p-20 text-center border-2 border-dashed rounded-3xl text-muted-foreground">
              <Layout size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold">لا يوجد بانرز حالياً</p>
            </div>
          )}
        </div>
      )}

      {/* Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-black">{editingBanner ? "تعديل بانر" : "إضافة بانر جديد"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold block mb-1">العنوان الرئيسي *</label>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold block mb-1">نص الزر</label>
                    <input 
                      value={formData.ctaText}
                      onChange={(e) => setFormData({...formData, ctaText: e.target.value})}
                      className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold block mb-1">رابط الزر</label>
                    <input 
                      value={formData.ctaLink}
                      onChange={(e) => setFormData({...formData, ctaLink: e.target.value})}
                      className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 text-left font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
              <div className="md:col-span-2">
                <ImageUpload 
                  label="صورة البانر"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold block mb-1">لون الخلفية</label>
                    <select 
                      value={formData.bgColor}
                      onChange={(e) => setFormData({...formData, bgColor: e.target.value})}
                      className="w-full border rounded-xl px-4 py-2 outline-none"
                    >
                      <option value="bg-blue-500">أزرق</option>
                      <option value="bg-emerald-500">أخضر</option>
                      <option value="bg-rose-500">وردي</option>
                      <option value="bg-amber-500">كهرماني</option>
                      <option value="bg-purple-500">بنفسجي</option>
                      <option value="bg-black">أسود</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold block mb-1">الترتيب</label>
                    <input 
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: Number(e.target.value)})}
                      className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox"
                    id="banner-active"
                    checked={formData.active}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <label htmlFor="banner-active" className="text-sm font-bold">البانر نشط</label>
                </div>
              </div>

              <div className="md:col-span-2 pt-4 border-t flex gap-3">
                <button 
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  {formLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />}
                  {editingBanner ? "حفظ التغييرات" : "إضافة البانر"}
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
