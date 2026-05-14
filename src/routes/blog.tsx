import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import pageHeader from "@/assets/page-header-baby.jpg";
import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import { Calendar, User, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "المدونة | Treemass" },
      { name: "description", content: "مقالات ونصائح حول العناية بالأطفال واختيار ملابسهم من خبراء Treemass في إسطنبول." },
    ],
  }),
});

function BlogPage() {
  const posts = [
    { 
      id: 1, 
      title: "كيف تختارين الملابس المناسبة لطفلك في فصل الصيف؟", 
      date: "10 مايو 2026", 
      author: "سارة أحمد",
      category: "نصائح",
      image: p1,
      excerpt: "نصائح هامة لاختيار الأقمشة والتصاميم التي تضمن راحة طفلك في الأيام الحارة، وكيفية حمايتهم من أشعة الشمس مع الحفاظ على أناقتهم." 
    },
    { 
      id: 2, 
      title: "أحدث صيحات الموضة للأطفال لعام 2026", 
      date: "5 مايو 2026", 
      author: "فريق Treemass",
      category: "موضة",
      image: p2,
      excerpt: "تعرفي على ألوان وتصاميم الموسم الجديد لتجعلي طفلك مواكباً لأحدث صيحات الموضة العالمية، من الألوان الترابية إلى النقشات الجريئة." 
    },
    { 
      id: 3, 
      title: "دليلك الشامل لاختيار مقاس الحذاء الصحيح لطفلك", 
      date: "28 أبريل 2026", 
      author: "د. خالد محمد",
      category: "دليل التسوق",
      image: p3,
      excerpt: "كيف تقيسين قدم طفلك بشكل صحيح وتتأكدين من اختيار المقاس المناسب لنمو قدميه وتجنب المشاكل الصحية المستقبلية." 
    },
    { 
      id: 4, 
      title: "أهمية الملابس القطنية لبشرة حديثي الولادة", 
      date: "15 أبريل 2026", 
      author: "سارة أحمد",
      category: "صحة الطفل",
      image: pageHeader,
      excerpt: "لماذا ينصح الأطباء دائماً بالملابس القطنية 100% للرضع؟ وما هي الفوائد التي تعود على صحة ونوم طفلك." 
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative bg-banner-mint overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 mix-blend-multiply"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-ethno uppercase">Treemass Blog</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            نشاركك أحدث النصائح، صيحات الموضة، وكل ما يهمك لراحة وأناقة طفلك.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <span className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold cursor-pointer shadow-sm">الكل</span>
          <span className="bg-secondary hover:bg-secondary/80 text-foreground px-6 py-2 rounded-full text-sm font-semibold cursor-pointer transition">نصائح</span>
          <span className="bg-secondary hover:bg-secondary/80 text-foreground px-6 py-2 rounded-full text-sm font-semibold cursor-pointer transition">موضة</span>
          <span className="bg-secondary hover:bg-secondary/80 text-foreground px-6 py-2 rounded-full text-sm font-semibold cursor-pointer transition">دليل التسوق</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="group bg-card border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
              <Link to="/blog" className="relative aspect-[4/3] overflow-hidden bg-secondary/50 block">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold rounded-full text-primary">
                  {post.category}
                </span>
              </Link>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{post.author}</span>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  <Link to="/blog">{post.title}</Link>
                </h2>
                
                <p className="text-muted-foreground mb-6 line-clamp-3 text-sm flex-1">
                  {post.excerpt}
                </p>
                
                <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors w-max">
                  اقرأ المزيد 
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
