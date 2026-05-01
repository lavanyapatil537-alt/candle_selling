import { prisma } from "@/lib/prisma";
import EnquiriesClient from "@/components/admin/EnquiriesClient";

export default async function AdminEnquiriesPage() {
  let enquiries: { id: string; name: string; email: string; message: string; is_read: boolean; created_at: Date }[] = [];
  try {
    enquiries = await prisma.enquiry.findMany({ orderBy: { created_at: "desc" } });
  } catch { /* db not configured */ }

  const unread = enquiries.filter((e) => !e.is_read).length;

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-xl font-medium text-lexi-dark">Enquiries</h1>
        {unread > 0 && (
          <span className="bg-lexi-gold text-white text-[10px] font-medium px-2 py-0.5 rounded-full">{unread} new</span>
        )}
      </div>
      <EnquiriesClient enquiries={enquiries} />
    </div>
  );
}
