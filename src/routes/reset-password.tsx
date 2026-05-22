import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "استعادة كلمة المرور | Treemass" },
    ],
  }),
});

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("يرجى إدخال البريد الإلكتروني");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      toast.success("تم إرسال رابط استعادة كلمة المرور لبريدك الإلكتروني");
      navigate({ to: "/login" });
    } catch (error: any) {
      toast.error("فشل إرسال الرابط، يرجى التأكد من البريد الإلكتروني");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col text-right" dir="rtl">
      <Header />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card border rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">استعادة كلمة المرور</h1>
            <p className="text-muted-foreground text-sm">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لتعيين كلمة مرور جديدة</p>
          </div>

          <form className="space-y-6" onSubmit={handleReset}>
            <div>
              <label className="text-sm font-semibold block mb-2">البريد الإلكتروني</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com" 
                className="w-full border rounded-lg px-4 py-3 bg-background outline-none focus:border-primary transition"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-lg shadow-sm hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              إرسال الرابط
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
