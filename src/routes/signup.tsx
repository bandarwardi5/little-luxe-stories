import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { User, Lock, Mail, Loader2 } from "lucide-react";
import pageHeader from "@/assets/page-header-baby.jpg";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Create Account | Treemass" },
      { name: "description", content: "Create a new account at Treemass and enjoy all the benefits." },
    ],
  }),
});

function SignupPage() {
  const { t, dir } = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signInGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error(t("signup.error_fields")); return; }
    setLoading(true);
    try {
      await signUp(name, email, password);
      toast.success(t("signup.success"));
      navigate({ to: "/" });
    } catch (error: any) {
      toast.error(error.message || t("signup.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInGoogle();
      toast.success(t("signup.success"));
      navigate({ to: "/" });
    } catch {
      toast.error(t("signup.error_google"));
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={dir}>
      <Header />
      <div className="flex-1 flex">
        <div className="hidden lg:block w-1/2 relative bg-banner-mint overflow-hidden">
          <img src={pageHeader} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent flex flex-col justify-center p-16">
            <h2 className="text-4xl font-extrabold mb-6 text-foreground font-ethno uppercase">Join Treemass Family</h2>
            <p className="text-lg text-muted-foreground max-w-md">{t("signup.welcome")}</p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-2">{t("signup.title")}</h1>
              <p className="text-muted-foreground">{t("signup.subtitle")}</p>
            </div>

            <form className="space-y-5" onSubmit={handleSignup}>
              <div>
                <label className="text-sm font-semibold block mb-2">{t("signup.name")}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                    <User className="w-5 h-5" />
                  </div>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder={t("signup.name")}
                    className="w-full border rounded-lg pl-4 pr-11 py-3 bg-background outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">{t("signup.email")}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full border rounded-lg pl-4 pr-11 py-3 bg-background outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">{t("signup.password")}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border rounded-lg pl-4 pr-11 py-3 bg-background outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-lg shadow-sm hover:opacity-90 transition flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {t("signup.btn")}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-muted"></div></div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">{t("signup.or")}</span>
              </div>
            </div>

            <button type="button" onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-2 border rounded-lg py-2.5 hover:bg-secondary/50 transition font-medium">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>{t("signup.google")}</span>
            </button>

            <p className="text-center text-sm text-muted-foreground mt-8">
              {t("signup.have_account")} <Link to="/login" className="text-primary font-bold hover:underline">{t("signup.login")}</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
