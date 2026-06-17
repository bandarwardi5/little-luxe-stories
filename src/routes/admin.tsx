import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Layers,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Sparkles,
  Loader2,
  ShieldAlert,
  Mail,
  BookOpen,
  FileText

} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { NotificationsDropdown } from "@/components/admin/NotificationsDropdown";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast.error("عذراً، لا تملك صلاحية الوصول لهذه الصفحة");
      navigate({ to: "/login" });
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-20 h-20 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">غير مصرح لك بالدخول</h1>
        <p className="text-muted-foreground mb-6">هذه المنطقة مخصصة لمديري النظام فقط.</p>
        <Link to="/" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold">العودة للرئيسية</Link>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    toast.success("تم تسجيل الخروج من لوحة التحكم");
    navigate({ to: "/login" });
  };

  const menuItems = [
    { name: "الإحصائيات", icon: LayoutDashboard, path: "/admin" },
    { name: "المنتجات", icon: Package, path: "/admin/products" },
    { name: "الأقسام", icon: Layers, path: "/admin/categories" },
    { name: "الطلبات", icon: ShoppingCart, path: "/admin/orders" },
    { name: "العملاء", icon: Users, path: "/admin/customers" },
    { name: "المقالات", icon: BookOpen, path: "/admin/blogs" },
    { name: "العروض", icon: Sparkles, path: "/admin/offers" },
    { name: "البانرز", icon: Menu, path: "/admin/banners" },
    { name: "الهيرو", icon: LayoutDashboard, path: "/admin/hero" },
    { name: "النشرة البريدية", icon: Bell, path: "/admin/newsletter" },
    { name: "الرسائل", icon: Mail, path: "/admin/contacts" },
    { name: "الإعدادات", icon: Settings, path: "/admin/settings" },
  ];


  return (
    <div className="min-h-screen bg-secondary/20 flex font-cairo" dir="rtl">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm transition-all"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 right-0 h-screen bg-white border-l z-[70] transition-all duration-300 flex flex-col shadow-xl lg:shadow-none
          ${isSidebarOpen ? "w-64 translate-x-0" : "w-0 lg:w-20 translate-x-full lg:translate-x-0 overflow-hidden lg:overflow-visible"}
        `}
      >
        <div className="p-6 flex items-center justify-between min-w-[64px]">
          {(isSidebarOpen || !isSidebarOpen) && (
            <Link to="/" className={`flex items-center gap-2 transition-opacity duration-300 ${!isSidebarOpen && "lg:opacity-0"}`}>
              <span className="text-xl font-black font-ethno uppercase">Tree<span className="text-primary">mass</span></span>
            </Link>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors hidden lg:block"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
              >
                <item.icon size={22} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform"} />
                {(isSidebarOpen || window.innerWidth < 1024) && <span className="font-bold whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={22} />
            {isSidebarOpen && <span className="font-bold">تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg bg-secondary lg:hidden"
            >
              <Menu size={20} />
            </button>
            
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="بحث في لوحة التحكم..."
                className="w-full bg-secondary/50 border-none rounded-xl pr-10 pl-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <NotificationsDropdown />
            <div className="h-10 w-10 rounded-full bg-banner-pink grid place-items-center font-bold text-primary border-2 border-primary/20 shrink-0">
              {user?.displayName?.charAt(0) || "أ"}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
