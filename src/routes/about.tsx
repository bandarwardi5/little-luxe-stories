import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import pageHeader from "@/assets/page-header-baby.jpg";
import { Heart, ShieldCheck, Star, Smile } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us | Treemass" },
      { name: "description", content: "Learn about Treemass kids fashion store in Istanbul." },
    ],
  }),
});

function AboutPage() {
  const { t } = useLang();

  const values = [
    { icon: ShieldCheck, titleKey: "about.val1_title", descKey: "about.val1_desc" },
    { icon: Smile,       titleKey: "about.val2_title", descKey: "about.val2_desc" },
    { icon: Heart,       titleKey: "about.val3_title", descKey: "about.val3_desc" },
    { icon: Star,        titleKey: "about.val4_title", descKey: "about.val4_desc" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-banner-pink overflow-hidden">
        <img src={pageHeader} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />
        <div className="relative container mx-auto px-4 py-20 md:py-32 text-center">
          <p className="text-sm font-bold tracking-widest text-primary mb-4 uppercase font-ethno">{t("about.pretitle")}</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">{t("about.title")}</h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            {t("about.subtitle")}
          </p>
        </div>
      </div>

      {/* Story & Vision */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold mb-6 relative inline-block">
              {t("about.how_title")}
              <span className="absolute -bottom-2 right-0 w-12 h-1.5 bg-primary rounded-full"></span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{t("about.story_p1")}</p>
              <p>{t("about.story_p2")}</p>
            </div>
          </div>
          <div className="bg-secondary/50 p-8 rounded-2xl border">
            <h3 className="text-2xl font-bold mb-4">{t("about.vision_title")}</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-12 h-12 shrink-0 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">{t("about.vision_label")}</h4>
                  <p className="text-sm text-muted-foreground">{t("about.vision_text")}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-12 h-12 shrink-0 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">{t("about.mission_label")}</h4>
                  <p className="text-sm text-muted-foreground">{t("about.mission_text")}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">{t("about.values_title")}</h2>
            <p className="text-muted-foreground">{t("about.values_subtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {values.map((value, i) => (
              <div key={i} className="bg-background p-6 rounded-2xl border text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">{t(value.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(value.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
