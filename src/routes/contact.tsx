import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import pageHeader from "@/assets/page-header-baby.jpg";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "اتصل بنا | Treemass" },
      { name: "description", content: "تواصل مع فريق متجر Treemass في إسطنبول للأسئلة والاستفسارات." },
    ],
  }),
});

function ContactPage() {
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
          <h2 className="text-2xl font-bold mb-2">تواصل معنا</h2>
          <p className="text-sm text-muted-foreground mb-6">إذا أردت التواصل معنا مباشرة، الرجاء تعبئة النموذج أدناه:</p>
          <form className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-1.5">الاسم</label>
              <input className="w-full border rounded px-4 py-3 bg-background outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5">البريد الإلكتروني</label>
              <input type="email" className="w-full border rounded px-4 py-3 bg-background outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5">رسالتك (اختياري)</label>
              <textarea rows={5} className="w-full border rounded px-4 py-3 bg-background outline-none focus:border-primary" />
            </div>
            <button type="button" className="bg-primary text-primary-foreground font-bold uppercase px-8 py-3 rounded">
              إرسال
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-secondary/40 rounded-lg p-6">
          {[
            { icon: MapPin, title: "العنوان:", text: "إسطنبول، تركيا" },
            { icon: Phone, title: "اتصل بنا:", text: "‎+90 507 022 2149" },
            { icon: Mail, title: "البريد:", text: "treemass4a@gmail.com" },
            { icon: Clock, title: "وقت العمل:", text: "10 صباحًا - 6 مساءً" },
          ].map((c) => (
            <div key={c.title} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-background grid place-items-center text-primary border">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{c.title}</p>
                <p className="font-semibold text-sm">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
