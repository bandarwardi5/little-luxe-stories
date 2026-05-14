import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
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
  Sparkles
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { name: "نظرة عامة", icon: LayoutDashboard, path: "/admin" },
    { name: "المنتجات", icon: Package, path: "/admin/products" },
    { name: "الطلبات", icon: ShoppingCart, path: "/admin/orders" },
    { name: "الأقسام", icon: Layers, path: "/admin/categories" },
    { name: "العملاء", icon: Users, path: "/admin/customers" },
    { name: "الإعدادات", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-secondary/20 flex font-cairo" dir="rtl">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white border-l h-screen sticky top-0 transition-all duration-300 z-50 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-black font-ethno uppercase">Tree<span className="text-primary">mass</span></span>
            </Link>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon size={22} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform"} />
                {isSidebarOpen && <span className="font-bold">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button className="flex items-center gap-3 p-3 w-full rounded-xl text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut size={22} />
            {isSidebarOpen && <span className="font-bold">تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input 
                type="text" 
                placeholder="بحث في لوحة التحكم..." 
                className="w-full bg-secondary/50 border-none rounded-xl pr-10 pl-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-secondary transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 rounded-full bg-banner-pink grid place-items-center font-bold text-primary border-2 border-primary/20">
              أ
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
