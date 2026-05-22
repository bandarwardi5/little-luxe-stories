import { useState, useRef, useEffect, useMemo } from "react";
import { Bell, ShoppingCart, Mail, UserPlus, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useOrders, useContacts, useNewsletter } from "@/lib/firestore-hooks";

function timeAgo(d: Date) {
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `قبل ${diff} ث`;
  if (diff < 3600) return `قبل ${Math.floor(diff / 60)} د`;
  if (diff < 86400) return `قبل ${Math.floor(diff / 3600)} س`;
  return `قبل ${Math.floor(diff / 86400)} يوم`;
}

function toDate(ts: any): Date | null {
  if (!ts) return null;
  if (ts.toDate) return ts.toDate();
  if (ts.seconds) return new Date(ts.seconds * 1000);
  return null;
}

export function NotificationsDropdown() {
  const { data: orders, loading: ordersL } = useOrders();
  const { data: contacts, loading: contactsL } = useContacts();
  const { data: subs, loading: subsL } = useNewsletter();
  const [open, setOpen] = useState(false);
  const [seenKey, setSeenKey] = useState<string>(() => {
    if (typeof window === "undefined") return "0";
    return localStorage.getItem("admin_notif_seen") || "0";
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const items = useMemo(() => {
    const list: Array<{ id: string; type: "order" | "contact" | "newsletter"; title: string; subtitle: string; at: Date | null; link: string }> = [];
    orders.filter((o) => o.status === "pending").forEach((o) => {
      list.push({
        id: `o-${o.id}`,
        type: "order",
        title: `طلب جديد من ${o.customerName || "عميل"}`,
        subtitle: `${o.total || 0} ل.ت • #${o.id.slice(0, 6)}`,
        at: toDate(o.createdAt),
        link: "/admin/orders",
      });
    });
    contacts.forEach((c: any) => {
      list.push({
        id: `c-${c.id}`,
        type: "contact",
        title: `رسالة من ${c.name || "زائر"}`,
        subtitle: (c.message || "").slice(0, 60),
        at: toDate(c.createdAt),
        link: "/admin/contacts",
      });
    });
    subs.forEach((s: any) => {
      list.push({
        id: `n-${s.id}`,
        type: "newsletter",
        title: `اشتراك جديد بالنشرة`,
        subtitle: s.email || "",
        at: toDate(s.createdAt),
        link: "/admin/newsletter",
      });
    });
    list.sort((a, b) => (b.at?.getTime() || 0) - (a.at?.getTime() || 0));
    return list.slice(0, 20);
  }, [orders, contacts, subs]);

  const seenTs = Number(seenKey) || 0;
  const unread = items.filter((i) => (i.at?.getTime() || 0) > seenTs).length;
  const loading = ordersL || contactsL || subsL;

  const markRead = () => {
    const now = String(Date.now());
    setSeenKey(now);
    if (typeof window !== "undefined") localStorage.setItem("admin_notif_seen", now);
  };

  const toggle = () => {
    if (!open) markRead();
    setOpen((v) => !v);
  };

  const iconFor = (t: string) =>
    t === "order" ? ShoppingCart : t === "contact" ? Mail : UserPlus;
  const colorFor = (t: string) =>
    t === "order" ? "bg-amber-100 text-amber-600" : t === "contact" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600";

  return (
    <div ref={ref} className="relative">
      <button onClick={toggle} className="relative p-2 rounded-full hover:bg-secondary transition-colors">
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-0 left-0 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full grid place-items-center border-2 border-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute top-full mt-2 left-0 w-[340px] bg-white border rounded-2xl shadow-2xl z-[100] overflow-hidden" dir="rtl">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-black">الإشعارات</h3>
            <span className="text-xs text-muted-foreground">{items.length} عنصر</span>
          </div>
          <div className="max-h-[420px] overflow-y-auto divide-y">
            {loading ? (
              <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
            ) : items.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground text-sm">لا توجد إشعارات جديدة</div>
            ) : (
              items.map((it) => {
                const Icon = iconFor(it.type);
                return (
                  <Link
                    key={it.id}
                    to={it.link}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 p-3 hover:bg-secondary/40 transition"
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${colorFor(it.type)}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold line-clamp-1">{it.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{it.subtitle}</p>
                      {it.at && <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(it.at)}</p>}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
