"use client";

import { useState } from "react";

interface Enquiry { id: string; name: string; email: string; message: string; is_read: boolean; created_at: Date }

export default function EnquiriesClient({ enquiries }: { enquiries: Enquiry[] }) {
  const [list, setList] = useState(enquiries);

  const markRead = async (id: string) => {
    await fetch("/api/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setList((prev) => prev.map((e) => e.id === id ? { ...e, is_read: true } : e));
  };

  if (list.length === 0) return <p className="text-lexi-muted text-sm">No enquiries yet.</p>;

  return (
    <div className="space-y-3">
      {list.map((e) => (
        <div key={e.id} className={`bg-white border p-5 ${e.is_read ? "border-lexi-border" : "border-lexi-gold"}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-medium text-lexi-dark text-sm">{e.name}</span>
                {!e.is_read && <span className="text-[10px] bg-lexi-gold text-white px-2 py-0.5 rounded-full font-medium">NEW</span>}
              </div>
              <p className="text-xs text-lexi-muted mb-3">{e.email} · {new Date(e.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              <p className="text-sm text-lexi-dark leading-relaxed">{e.message}</p>
            </div>
            {!e.is_read && (
              <button onClick={() => markRead(e.id)} className="text-xs text-lexi-muted hover:text-lexi-gold transition-colors flex-shrink-0">
                Mark read
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
