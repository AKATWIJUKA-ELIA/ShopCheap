import type { MetadataRoute } from "next";
import useGetAllProducts from "@/hooks/useGetAllProducts";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL!

const base = SITE_URL.replace(/\/+$/, "");

type AnyRecord = Record<string, unknown>;

// async function safeFetch<T = unknown>(path: string): Promise<T | null> {
//   try {
//     const url = path.startsWith("http") ? path : `${base}${path}`;
//     const res = await fetch(url, { next: { revalidate: 3600 } });
//     if (!res.ok) return null;
//     return (await res.json()) as T;
//   } catch {
//     return null;
//   }
// }

function toSitemapItem(
  path: string,
  opts?: {
    lastModified?: string | Date;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority?: number;
  }
): MetadataRoute.Sitemap[number] {
  return {
    url: `${base}${path}`,
    lastModified: opts?.lastModified ? new Date(opts.lastModified) : new Date(),
    changeFrequency: opts?.changeFrequency ?? "daily",
    priority: opts?.priority ?? 0.7,
  };
}

// Known public categories (extend as needed)
const categories = [
  "electronics",
  "fashion",
  "clothing",
  "beauty products",
  "home decor",
  "sports gear",
  "shoes",
  "accessories",
  "mobile phones",
  "laptops",
  "kitchen appliances",
  "furniture",
] as const;

export default function Sitemap(): MetadataRoute.Sitemap {
  // Static top-level routes
  const staticRoutes: MetadataRoute.Sitemap = [
    toSitemapItem("/", { priority: 1, changeFrequency: "daily" }),
    toSitemapItem("/shops", { priority: 0.9, changeFrequency: "daily" }),
    toSitemapItem("/categories", { priority: 0.6, changeFrequency: "weekly" }),
//     toSitemapItem("/about", { priority: 0.3, changeFrequency: "yearly" }),
//     toSitemapItem("/contact", { priority: 0.3, changeFrequency: "yearly" }),
//     toSitemapItem("/terms", { priority: 0.2, changeFrequency: "yearly" }),
//     toSitemapItem("/privacy", { priority: 0.2, changeFrequency: "yearly" }),
  ];

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) =>
    toSitemapItem(`/category/${encodeURIComponent(c)}`, {
      priority: 0.6,
      changeFrequency: "weekly",
    })
  );

  // Attempt to fetch dynamic product slugs (fallbacks baked in)
  // Replace these endpoints with your actual ones if different.
  const {data:productsData} = useGetAllProducts()
//   const [ shopsData] = await Promise.all([
//     safeFetch<AnyRecord[] | { items: AnyRecord[] }>("/api/public/shops-slugs"),
//   ]);

//   const normalizeList = (data: AnyRecord[] | { items: AnyRecord[] } | null) =>
//     Array.isArray(data) ? data : Array.isArray((data as any)?.items) ? (data as any).items : [];

//   const products = normalizeList(productsData);
//   const shops = normalizeList(shopsData);

const productRoutes: MetadataRoute.Sitemap = ((productsData ?? []) as AnyRecord[]).reduce<
  MetadataRoute.Sitemap
>((acc, p) => {
  const slug =
    p ?.slug ??
        p?._id ??
    p ?.id ??
    null;
  if (!slug) return acc;

  const updatedAt =
    (p)?.updatedAt ?? p?._updatedAt ?? undefined;

  acc.push(
    toSitemapItem(`/product/${encodeURIComponent(String(slug))}`, {
      lastModified: updatedAt as Date ,
      priority: 0.8,
      changeFrequency: "daily",
    })
  );

  return acc;
}, []);

//   const shopRoutes: MetadataRoute.Sitemap = shops
//     .map((s) => {
//       const slug =
//         (s as any)?.slug ??
//         (s as any)?.shop_name ??
//         (s as any)?.name ??
//         null;
//       if (!slug) return null;
//       const updatedAt = (s as any)?.updatedAt || (s as any)?._updatedAt || undefined;
//       return toSitemapItem(`/shop/${encodeURIComponent(String(slug))}`, {
//         lastModified: updatedAt,
//         priority: 0.6,
//         changeFrequency: "weekly",
//       });
//     })
//     .filter((x): x is MetadataRoute.Sitemap[number] => x !== null);

  // Deduplicate by URL
  const all = [...staticRoutes, ...categoryRoutes, ...productRoutes];
  const seen = new Set<string>();
  const deduped = all.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  return deduped;
}