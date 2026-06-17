import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import pageHeader from "@/assets/page-header-baby.jpg";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact Us | Treemass" },
      { name: "description", content: "Contact the Treemass team in Istanbul for questions and inquiries." },
    ],
  }),
});

function ContactPage() {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error(t("contact.validation"));
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "contacts"), { ...formData, createdAt: serverTimestamp() });
      toast.success(t("contact.success"));
      setFormData({ name: "", email: "", message: "" });
    } catch {
      toast.error(t("contact.error"));
    } finally {
      setLoading(false);
    }
  };

  const infos = [
    { icon: MapPin, titleKey: "contact.address_label", valueKey: "contact.address_value" },
    { icon: Phone,  titleKey: "contact.phone_label",   value: "+90 507 022 2149" },
    { icon: Mail,   titleKey: "contact.mail_label",    value: "info@treemass.com.tr" },
    { icon: Clock,  titleKey: "contact.hours_label",   valueKey: "contact.hours_value" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative bg-secondary overflow-hidden">
        <img src={pageHeader} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="relative container mx-auto px-4 py-14 text-center">
          <p className="text-xs text-muted-foreground mb-2 font-ethno uppercase tracking-widest">Home / Contact Us</p>
          <h1 className="text-3xl md:text-4xl font-bold font-ethno uppercase">Contact Us</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14 grid md:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden border min-h-[450px]">
          <iframe
            title="map"
            src="https://www.google.com/maps?q=Istanbul&output=embed"
            className="w-full h-full"
            loading="lazy"
          />
        </div>
        <div className="bg-secondary/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-2">{t("contact.title")}</h2>
          <p className="text-sm text-muted-foreground mb-6">{t("contact.subtitle")}</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold block mb-1.5">{t("contact.name")}</label>
              <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded px-4 py-3 bg-background outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5">{t("contact.email")}</label>
              <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border rounded px-4 py-3 bg-background outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5">{t("contact.message")}</label>
              <textarea rows={5} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full border rounded px-4 py-3 bg-background outline-none focus:border-primary" />
            </div>
            <button type="submit" disabled={loading}
              className="bg-primary text-primary-foreground font-bold uppercase px-8 py-3 rounded disabled:opacity-50">
              {loading ? t("contact.sending") : t("contact.send")}
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-secondary/40 rounded-lg p-6">
          {infos.map((c) => (
            <div key={c.titleKey} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-background grid place-items-center text-primary border">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t(c.titleKey)}</p>
                <p className="font-semibold text-sm">{c.value ?? t(c.valueKey!)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
