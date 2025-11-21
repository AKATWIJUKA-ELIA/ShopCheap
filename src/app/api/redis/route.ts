import { NextResponse, NextRequest } from "next/server"
import { z } from "zod"
import { setCache } from "@/lib/redis"

const cacheSchema = z.object({
  key: z.string().min(1),
  products: z.array(z.unknown()),
  ttlSeconds: z.number().int().positive().default(3600),
})

export async function POST(request: NextRequest) {
  try {
    const parsed = cacheSchema.parse(await request.json())
    await setCache(parsed.key, JSON.stringify(parsed.products), parsed.ttlSeconds)

    return NextResponse.json(
      {
        key: parsed.key,
        ttl: parsed.ttlSeconds,
        itemCount: parsed.products.length,
      },
      { status: 201 },
    )
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to cache products",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 400 },
    )
  }
}