import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useBlog, useBlogs } from "@/lib/firestore-hooks";
import { Calendar, User, ArrowRight, Loader2, BookOpen, Clock } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/blog/$id")({
  component: BlogDetailPage,
  head: () => ({
    meta: [
      { title: "تفاصيل المقالة | Treemass" },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-foreground">المقالة غير موجودة</h1>
        <p className="text-muted-foreground">عذراً، لم نتمكن من العثور على هذه المقالة.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-primary/10">
          <ArrowRight className="w-5 h-5" />
          العودة للمدونة
        </Link>
      </div>
    </div>
  ),
});

function parseMarkdown(text: string) {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("###")) {
      return (
        <h3 key={idx} className="text-2xl font-bold mt-8 mb-4 text-foreground text-right">
          {trimmed.replace("###", "").trim()}
        </h3>
      );
    }
    if (trimmed.startsWith("##")) {
      return (
        <h2 key={idx} className="text-3xl font-black mt-10 mb-6 text-foreground text-right border-r-4 border-primary pr-3">
          {trimmed.replace("##", "").trim()}
        </h2>
      );
    }
    if (trimmed.startsWith("#")) {
      return (
        <h1 key={idx} className="text-4xl font-black mt-12 mb-8 text-foreground text-right">
          {trimmed.replace("#", "").trim()}
        </h1>
      );
    }
    if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
      return (
        <li key={idx} className="mr-6 list-disc text-muted-foreground text-lg leading-relaxed mb-2 text-right">
          {trimmed.substring(1).trim()}
        </li>
      );
    }
    if (trimmed === "") {
      return <div key={idx} className="h-4" />;
    }
    return (
      <p key={idx} className="text-muted-foreground text-lg leading-relaxed mb-6 text-right font-medium">
        {trimmed}
      </p>
    );
  });
}

function BlogDetailPage() {
  const { id } = Route.useParams();
  const { blog, loading } = useBlog(id);
  const { data: recentBlogs, loading: recentLoading } = useBlogs();
  const { t, tl, lang } = useLang();

  if (loading || recentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!blog) throw notFound();

  const titleText = tl(blog.title);
  const contentText = tl(blog.content);
  const excerptText = tl(blog.excerpt);

  const related = recentBlogs.filter((b) => b.id !== blog.id).slice(0, 3);
  const isRtl = lang === "ar";

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      {/* Hero Banner */}
      <div className="relative aspect-[21/9] w-full bg-secondary/30 overflow-hidden border-b">
        <img 
          src={blog.image} 
          alt={titleText} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl text-right">
            <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-black shadow-sm mb-4 inline-block">
              {blog.category}
            </span>
            <h1 className="text-2xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-md">
              {titleText}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{blog.readTime || "5 دقائق"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="text-sm text-muted-foreground flex items-center gap-2 mb-10 text-right justify-start">
          <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-primary transition-colors">المدونة</Link>
          <span>/</span>
          <span className="text-foreground font-bold line-clamp-1">{titleText}</span>
        </div>

        {/* Excerpt callout */}
        {excerptText && (
          <div className="p-6 md:p-8 bg-primary/5 border-r-4 border-primary rounded-l-2xl mb-12 text-right">
            <p className="text-lg md:text-xl font-bold text-primary leading-relaxed">
              {excerptText}
            </p>
          </div>
        )}

        {/* Main Article Body */}
        <article className="prose prose-stone max-w-none mb-20">
          {parseMarkdown(contentText)}
        </article>

        {/* Share / Tags section */}
        <div className="border-t border-b py-6 my-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-muted-foreground">الكاتب:</span>
            <div className="flex items-center gap-2 bg-secondary/50 px-4 py-1.5 rounded-xl">
              <User className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm">{blog.author}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-muted-foreground">التصنيف:</span>
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-xl font-bold text-sm">
              {blog.category}
            </span>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl md:text-3xl font-black mb-12 text-right flex items-center gap-2 justify-start">
              <BookOpen className="text-primary" />
              مقالات أخرى قد تهمك
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((post) => (
                <article key={post.id} className="group bg-card border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                  <Link to="/blog/$id" params={{ id: post.id }} className="relative aspect-[4/3] overflow-hidden bg-secondary/50 block">
                    <img 
                      src={post.image} 
                      alt={tl(post.title)} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold rounded-full text-primary">
                      {post.category}
                    </span>
                  </Link>
                  
                  <div className="p-6 flex-1 flex flex-col text-right">
                    <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      <Link to="/blog/$id" params={{ id: post.id }}>{tl(post.title)}</Link>
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                      {tl(post.excerpt)}
                    </p>
                    <Link to="/blog/$id" params={{ id: post.id }} className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors mr-auto w-max">
                      اقرأ المزيد
                      <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
