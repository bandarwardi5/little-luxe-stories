import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import pageHeader from "@/assets/page-header-baby.jpg";
import { Heart, ShieldCheck, Star, Smile } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "من نحن | Treemass" },
      { name: "description", content: "تعرف على قصة متجر Treemass ورؤيتنا في تقديم أفضل المنتجات لأطفالكم في إسطنبول." },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-banner-pink overflow-hidden">
        <img src={pageHeader} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />
        <div className="relative container mx-auto px-4 py-20 md:py-32 text-center">
          <p className="text-sm font-bold tracking-widest text-primary mb-4 uppercase font-ethno">OUR STORY</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">عالم من الأناقة لأطفالكم</h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            في Treemass، نؤمن بأن كل طفل يستحق أن يتألق بأجمل الملابس التي تعكس شخصيته البريئة وتمنحه الراحة والثقة.
          </p>
        </div>
      </div>

      {/* Story & Vision */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold mb-6 relative inline-block">
              كيف بدأنا؟
              <span className="absolute -bottom-2 right-0 w-12 h-1.5 bg-primary rounded-full"></span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                بدأت رحلة Treemass من شغفنا بتقديم خيارات ملابس عصرية ومريحة للأطفال، حيث لاحظنا حاجة السوق في إسطنبول إلى تصاميم تجمع بين الجودة العالية، الألوان المبهجة، والأسعار المناسبة للعائلات.
              </p>
              <p>
                منذ اليوم الأول، كان هدفنا هو تسهيل تجربة التسوق للآباء والأمهات، من خلال متجر إلكتروني يوفر تشكيلات واسعة تلبي جميع احتياجات الطفل من سن الولادة وحتى المراهقة.
              </p>
            </div>
          </div>
          <div className="bg-secondary/50 p-8 rounded-2xl border">
            <h3 className="text-2xl font-bold mb-4">رؤيتنا ومهمتنا</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-12 h-12 shrink-0 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">الرؤية</h4>
                  <p className="text-sm text-muted-foreground">أن نكون الوجهة الأولى والمفضلة لتسوق ملابس الأطفال في العالم العربي.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-12 h-12 shrink-0 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">المهمة</h4>
                  <p className="text-sm text-muted-foreground">توفير منتجات عالية الجودة بتصاميم عصرية تواكب أحدث صيحات الموضة.</p>
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
            <h2 className="text-3xl font-bold mb-4">قيمنا التي نعتز بها</h2>
            <p className="text-muted-foreground">نعمل بجد لنضمن تقديم تجربة تسوق استثنائية مبنية على أسس وقيم واضحة.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: ShieldCheck, title: "جودة لا تضاهى", desc: "نختار الأقمشة بعناية لتناسب بشرة طفلك الحساسة." },
              { icon: Smile, title: "رضا العملاء", desc: "سعادة طفلك وراحتك هي غايتنا الأولى." },
              { icon: Heart, title: "شغف بالتفاصيل", desc: "نهتم بأدق التفاصيل في كل قطعة نعرضها." },
              { icon: Star, title: "تصاميم حصرية", desc: "نقدم موديلات فريدة تميز طفلك عن الجميع." },
            ].map((value, i) => (
              <div key={i} className="bg-background p-6 rounded-2xl border text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
