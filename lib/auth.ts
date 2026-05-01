import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return false;
  }
  return true;
}

export { authOptions };
