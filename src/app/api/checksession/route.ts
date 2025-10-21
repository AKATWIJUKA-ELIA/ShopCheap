import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from  "../../../lib/sessions"

export async function GET() {
   const sessionCookie = (await cookies()).get("ShopCheapSession")?.value

  if (!sessionCookie) {
    return NextResponse.json({ valid: false });
  }

  const payload = await decrypt(sessionCookie);

  if (!payload) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ valid: true, user: payload });
}
