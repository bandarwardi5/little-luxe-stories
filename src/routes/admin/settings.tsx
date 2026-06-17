import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Save, Settings, Globe, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "Treemass Kids",
    siteDescription: "أفضل ملابس الأطفال في إسطنبول",
    contactEmail: "info@treemass.com.tr",
    contactPhone: "+90 507 022 2149",
    address: "إسطنبول، تركيا",
    facebook: "https://www.facebook.com/profile.php?id=61550770286748",
    instagram: "https://www.instagram.com/_treemass_",
    twitter: "",
    currency: "ل.ت",
    shippingFee: 20,
    freeShippingThreshold: 500,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings({ ...settings, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await setDoc(doc(db, "settings", "general"), {
        ...settings,
        updatedAt: serverTimestamp(),
      });
      toast.success("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      toast.error("فشل حفظ الإعدادات");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;
  }

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div>
        <h1 className="text-2xl font-black mb-1">إعدادات المتجر</h1>
        <p className="text-muted-foreground">التحكم في المعلومات الأساسية وسياسات المتجر.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <div className="bg-white rounded-3xl border p-8 space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="p-2 bg-primary/10 text-primary rounded-lg"><Globe size={20} /></div>
              <h2 className="font-black text-lg">المعلومات العامة</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold block mb-2">اسم المتجر</label>
                <input 
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-bold block mb-2">العملة</label>
                <input 
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold block mb-2">وصف المتجر (SEO)</label>
              <textarea 
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 h-24 resize-none"
              />
            </div>
          </div>

          {/* Contact & Social */}
          <div className="bg-white rounded-3xl border p-8 space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Phone size={20} /></div>
              <h2 className="font-black text-lg">التواصل والشبكات الاجتماعية</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold block mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input 
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                    className="w-full border rounded-xl pr-10 pl-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold block mb-2">رقم الهاتف</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input 
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                    className="w-full border rounded-xl pr-10 pl-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 text-left font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold block mb-2">العنوان</label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input 
                    value={settings.address}
                    onChange={(e) => setSettings({...settings, address: e.target.value})}
                    className="w-full border rounded-xl pr-10 pl-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div>
                <label className="text-sm font-bold block mb-2 flex items-center gap-2"><Facebook size={14} /> فيسبوك</label>
                <input 
                  value={settings.facebook}
                  onChange={(e) => setSettings({...settings, facebook: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2 outline-none text-left text-xs"
                />
              </div>
              <div>
                <label className="text-sm font-bold block mb-2 flex items-center gap-2"><Instagram size={14} /> انستقرام</label>
                <input 
                  value={settings.instagram}
                  onChange={(e) => setSettings({...settings, instagram: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2 outline-none text-left text-xs"
                />
              </div>
              <div>
                <label className="text-sm font-bold block mb-2 flex items-center gap-2"><Twitter size={14} /> تويتر</label>
                <input 
                  value={settings.twitter}
                  onChange={(e) => setSettings({...settings, twitter: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2 outline-none text-left text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border p-8 space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Settings size={20} /></div>
              <h2 className="font-black text-lg">الشحن والطلبات</h2>
            </div>

            <div>
              <label className="text-sm font-bold block mb-2">رسوم الشحن الثابتة</label>
              <input 
                type="number"
                value={settings.shippingFee}
                onChange={(e) => setSettings({...settings, shippingFee: Number(e.target.value)})}
                className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div>
              <label className="text-sm font-bold block mb-2">الحد الأدنى للشحن المجاني</label>
              <input 
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({...settings, freeShippingThreshold: Number(e.target.value)})}
                className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-[10px] text-muted-foreground mt-2">ضع 0 لإلغاء الشحن المجاني التلقائي</p>
            </div>

            <button 
              type="submit"
              disabled={saveLoading}
              className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 transition flex items-center justify-center gap-2 mt-4"
            >
              {saveLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />}
              حفظ جميع الإعدادات
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
