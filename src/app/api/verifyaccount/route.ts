import { NextRequest, NextResponse } from "next/server";
import { getUserByToken,UpdateUser } from "@/lib/convex";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("k9m3p7q2r8t4v1w6x5y9z2a8b4c6d1e7f3g9h2j5k8m4n6p1q7r3t9u2v5w8x4y6z3a9b2c7d1e4f8g6h2j9k5m3");

  if (!token) {
    return NextResponse.json({ success: false, message: "Invalid or missing token." }, { status: 400 });
  }

  // 1. Look up user by token
  const user = await getUserByToken(token);
  if (!user.success || !user.user) {
    return NextResponse.json({ success: false, message: "Invalid or expired token." }, { status: 400 });
  }

  // 2. Mark user as verified in database
  await UpdateUser({ ...user.user,
        isVerified: true,
        reset_token: "",
        reset_token_expires: 0,});

  return NextResponse.redirect(new URL("/sign-in", req.url));
}