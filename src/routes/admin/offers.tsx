import { createFileRoute } from "@tanstack/react-router";
import { useOffers } from "@/lib/firestore-hooks";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Plus, Edit2, Trash2, Sparkles, Loader2, X, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/offers")({
  component: AdminOffers,
});

function AdminOffers() {
  const { data: offers, loading } = useOffers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: 0,
    code: "",
    image: "",
    active: true,
  });

  const handleEdit = (offer: any) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description || "",
      discount: offer.discount || 0,
      code: offer.code || "",
      image: offer.image || "",
      active: offer.active !== undefined ? offer.active : true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العرض؟")) return;
    try {
      await deleteDoc(doc(db, "offers", id));
      toast.success("تم حذف العرض بنجاح");
    } catch (error) {
      toast.error("فشل حذف العرض");
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

      if (editingOffer) {
        await updateDoc(doc(db, "offers", editingOffer.id), data);
        toast.success("تم تحديث العرض بنجاح");
      } else {
        await addDoc(collection(db, "offers"), {
          ...data,
          createdAt: serverTimestamp(),
        });
        toast.success("تم إضافة العرض بنجاح");
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
    setEditingOffer(null);
    setFormData({
      title: "",
      description: "",
      discount: 0,
      code: "",
      image: "",
      active: true,
    });
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1">إدارة العروض</h1>
          <p className="text-muted-foreground">إدارة كوبونات الخصم والعروض الترويجية.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          إضافة عرض جديد
        </button>
      </div>

      {loading ? (
        <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-2xl border overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <Sparkles size={24} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black ${offer.active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    {offer.active ? "نشط" : "متوقف"}
                  </span>
                </div>
                
                <h3 className="text-xl font-black mb-2">{offer.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{offer.description}</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 bg-secondary/30 p-3 rounded-xl text-center">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">الخصم</p>
                    <p className="font-black text-primary">{offer.discount}%</p>
                  </div>
                  <div className="flex-1 bg-secondary/30 p-3 rounded-xl text-center border-2 border-dashed border-primary/20">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">الكود</p>
                    <p className="font-black font-mono">{offer.code || "---"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t pt-4">
                  <button 
                    onClick={() => handleEdit(offer)}
                    className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-white transition-all font-bold text-sm">
                    <Edit2 size={16} />
                    تعديل
                  </button>
                  <button 
                    onClick={() => handleDelete(offer.id)}
                    className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-rose-500 hover:text-white transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="border-2 border-dashed border-muted rounded-2xl flex flex-col items-center justify-center p-12 gap-4 text-muted-foreground hover:border-primary hover:text-primary transition-all group min-h-[250px]"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Plus size={32} />
            </div>
            <span className="font-bold">إضافة عرض جديد</span>
          </button>
        </div>
      )}

      {/* Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-black">{editingOffer ? "تعديل عرض" : "إضافة عرض جديد"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right">
              <div>
                <label className="text-sm font-bold block mb-1">عنوان العرض *</label>
                <input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-sm font-bold block mb-1">الوصف</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 h-20 resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold block mb-1">نسبة الخصم (%)</label>
                  <input 
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})}
                    className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold block mb-1">كود الخصم</label>
                  <input 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 text-left font-mono"
                  />
                </div>
              </div>

              <div>
                <ImageUpload 
                  label="صورة العرض (اختياري)"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input 
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="w-4 h-4 text-primary rounded"
                />
                <label htmlFor="active" className="text-sm font-bold">العرض نشط حالياً</label>
              </div>

              <div className="pt-4 border-t flex gap-3">
                <button 
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  {formLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />}
                  {editingOffer ? "حفظ التغييرات" : "إضافة العرض"}
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
