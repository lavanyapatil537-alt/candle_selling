import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function requireAdmin(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  return true;
}

export { authOptions };
