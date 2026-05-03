import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) return <>{children}</>;

  return (
    <div className="min-h-screen bg-lexi-cream flex">
      {/* Sidebar */}
      <aside className="w-52 bg-white border-r border-lexi-border flex flex-col flex-shrink-0">
        <div className="px-6 py-6 border-b border-lexi-border">
          <p className="font-serif text-sm tracking-[0.2em] text-lexi-gold">LEXI ADMIN</p>
          <p className="text-[10px] tracking-widest text-lexi-muted mt-0.5">MANAGEMENT SUITE</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { href: "/admin/dashboard", label: "Dashboard" },
            { href: "/admin/orders", label: "Orders" },
            { href: "/admin/products", label: "Products" },
            { href: "/admin/enquiries", label: "Enquiries" },
            { href: "/admin/settings", label: "Settings" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-lexi-muted hover:text-lexi-gold hover:bg-lexi-cream rounded transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 pb-6">
          <Link href="/api/auth/signout" className="flex items-center gap-2 px-3 py-2 text-xs text-lexi-muted hover:text-red-500 transition-colors">
            ← Logout
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
