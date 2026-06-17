import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Save, Loader2, Plus, Trash2, MessageSquareQuote, LayoutGrid, Megaphone } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MultiLangInput } from "@/components/admin/MultiLangInput";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/site-content")({
  component: AdminSiteContent,
});

type ML = { ar?: string; tr?: string; en?: string };
type Collection = { title?: ML; description?: ML; badge?: ML; image?: string; link?: string; featured?: boolean };
type Testimonial = { name?: ML; role?: ML; text?: ML };

function AdminSiteContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [topBar, setTopBar] = useState<ML>({ ar: "", tr: "", en: "" });
  const [collections, setCollections] = useState<Collection[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "general"));
        if (snap.exists()) {
          const d = snap.data() as any;
          if (d.topBar) setTopBar(typeof d.topBar === "string" ? { ar: d.topBar } : d.topBar);
          if (Array.isArray(d.collections)) setCollections(d.collections);
          if (Array.isArray(d.testimonials)) setTestimonials(d.testimonials);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(
        doc(db, "settings", "general"),
        { topBar, collections, testimonials, updatedAt: serverTimestamp() },
        { merge: true }
      );
      toast.success("تم حفظ محتوى الموقع");
    } catch (e) {
      console.error(e);
      toast.error("فشل الحفظ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;
  }

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black mb-1">محتوى الموقع</h1>
          <p className="text-muted-foreground">إدارة الشريط العلوي، التشكيلات، وآراء العملاء.</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={18} />}
          حفظ التغييرات
        </button>
      </div>

      {/* Top Bar */}
      <section className="bg-white rounded-3xl border p-6 md:p-8 space-y-5">
        <div className="flex items-center gap-3 border-b pb-4">
          <div className="p-2 bg-primary/10 text-primary rounded-lg"><Megaphone size={20} /></div>
          <h2 className="font-black text-lg">الشريط العلوي (Top Bar)</h2>
        </div>
        <p className="text-xs text-muted-foreground">اترك الحقول فارغة لاستخدام نص الشحن الافتراضي.</p>
        <MultiLangInput
          label="نص الشريط العلوي"
          value={topBar}
          onChange={(v) => setTopBar(v)}
          placeholder="مثال: شحن مجاني لجميع الطلبات!"
        />
      </section>

      {/* Collections */}
      <section className="bg-white rounded-3xl border p-6 md:p-8 space-y-5">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><LayoutGrid size={20} /></div>
            <h2 className="font-black text-lg">التشكيلات (Collections)</h2>
          </div>
          <button
            type="button"
            onClick={() => setCollections([...collections, { title: { ar: "" }, link: "/shop" }])}
            className="bg-secondary text-foreground px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition"
          >
            <Plus size={16} /> إضافة تشكيلة
          </button>
        </div>

        {collections.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">لا توجد تشكيلات. سيتم استخدام التشكيلات الافتراضية.</p>
        )}

        <div className="space-y-6">
          {collections.map((c, i) => (
            <div key={i} className="border rounded-2xl p-5 space-y-4 bg-secondary/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">تشكيلة #{i + 1}</span>
                <button
                  type="button"
                  onClick={() => setCollections(collections.filter((_, idx) => idx !== i))}
                  className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <MultiLangInput label="العنوان" value={c.title} onChange={(v) => {
                  const arr = [...collections]; arr[i] = { ...c, title: v }; setCollections(arr);
                }} />
                <MultiLangInput label="الشارة (Badge)" value={c.badge} onChange={(v) => {
                  const arr = [...collections]; arr[i] = { ...c, badge: v }; setCollections(arr);
                }} />
              </div>
              <MultiLangInput label="الوصف" multiline rows={2} value={c.description} onChange={(v) => {
                const arr = [...collections]; arr[i] = { ...c, description: v }; setCollections(arr);
              }} />
              <div className="grid md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="text-sm font-bold block mb-2">رابط التشكيلة</label>
                  <input
                    value={c.link || ""}
                    onChange={(e) => {
                      const arr = [...collections]; arr[i] = { ...c, link: e.target.value }; setCollections(arr);
                    }}
                    placeholder="/shop"
                    className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 text-left"
                  />
                </div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={!!c.featured}
                    onChange={(e) => {
                      const arr = collections.map((x, idx) => ({ ...x, featured: idx === i ? e.target.checked : false }));
                      setCollections(arr);
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-bold">تشكيلة مميزة (Hero)</span>
                </label>
              </div>
              <ImageUpload label="صورة التشكيلة" value={c.image || ""} onChange={(url) => {
                const arr = [...collections]; arr[i] = { ...c, image: url }; setCollections(arr);
              }} />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white rounded-3xl border p-6 md:p-8 space-y-5">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><MessageSquareQuote size={20} /></div>
            <h2 className="font-black text-lg">آراء العملاء</h2>
          </div>
          <button
            type="button"
            onClick={() => setTestimonials([...testimonials, { name: { ar: "" }, role: { ar: "" }, text: { ar: "" } }])}
            className="bg-secondary text-foreground px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition"
          >
            <Plus size={16} /> إضافة رأي
          </button>
        </div>

        {testimonials.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">لا توجد آراء. سيتم استخدام الآراء الافتراضية.</p>
        )}

        <div className="space-y-6">
          {testimonials.map((tt, i) => (
            <div key={i} className="border rounded-2xl p-5 space-y-4 bg-secondary/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">رأي #{i + 1}</span>
                <button
                  type="button"
                  onClick={() => setTestimonials(testimonials.filter((_, idx) => idx !== i))}
                  className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <MultiLangInput label="الاسم" value={tt.name} onChange={(v) => {
                  const arr = [...testimonials]; arr[i] = { ...tt, name: v }; setTestimonials(arr);
                }} />
                <MultiLangInput label="الصفة" value={tt.role} onChange={(v) => {
                  const arr = [...testimonials]; arr[i] = { ...tt, role: v }; setTestimonials(arr);
                }} />
              </div>
              <MultiLangInput label="نص الرأي" multiline rows={3} value={tt.text} onChange={(v) => {
                const arr = [...testimonials]; arr[i] = { ...tt, text: v }; setTestimonials(arr);
              }} />
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={18} />}
          حفظ التغييرات
        </button>
      </div>
    </div>
  );
}
