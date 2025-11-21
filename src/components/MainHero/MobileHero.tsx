"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { MdAddShoppingCart } from "react-icons/md"
import useGetSponsored from "@/hooks/useGetSponsored"
import useAddToCart from "@/hooks/useAddToCart"
// import { useData } from "@/app/DataContext"
// import Recommended from "../Recommended/page"
import { Id } from "../../../convex/_generated/dataModel"

interface Product {
  approved: boolean
  product_cartegory: string
  product_condition: "new" | "used" | "refurbished"
  product_description: string
  product_image: string[]
  product_name: string
  product_owner_id: string
  product_price: string
  _creationTime: number
  _id: Id<"products">
  product_sponsorship?: {
    type?: string
    status?: string
  }
}

// function useCountdown(target: Date) {
//   const [now, setNow] = useState(() => new Date())
//   useEffect(() => {
//     const t = setInterval(() => setNow(new Date()), 1000)
//     return () => clearInterval(t)
//   }, [])
//   const diff = Math.max(0, target.getTime() - now.getTime())
//   const s = Math.floor(diff / 1000)
//   const d = Math.floor(s / 86400)
//   const h = Math.floor((s % 86400) / 3600)
//   const m = Math.floor((s % 3600) / 60)
//   const sec = s % 60
//   return { d, h, m, s: sec, done: diff === 0 }
// }

const MobileHero: React.FC = () => {
  // Only show on mobile/tablet
  // Hide on large (lg+) screens so it does not conflict with existing MainHero
//   const saleEnd = useMemo(() => {
//     const t = new Date()
//     t.setHours(23, 59, 59, 999)
//     return t
//   }, [])

//   const { d, h, m, s, done } = useCountdown(saleEnd)
  const autoplayFast = Autoplay({ delay: 3800 })
  const autoplaySlow = Autoplay({ delay: 5200 })

  const { sponsored } = useGetSponsored()
  const [products, setProducts] = useState<Product[]>([])
  const HandleAddToCart = useAddToCart()
//   const { data } = useData()

  useEffect(() => {
    if (sponsored && sponsored.length > 0) {
      setProducts(
        sponsored.filter(
          (p)=> p !== null && p.product_sponsorship?.type === "platinum"
        )
      )
    }
  }, [sponsored])

  return (
    <div className="lg:hidden w-full flex flex-col gap-4 mt-40 px-3">
      {/* Categories strip */}
      {/* <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 rounded-md bg-gray-100 dark:bg-gray-800">
        {data.Categories
          ? data.Categories.categories.slice(0, 12).map(({ _id, cartegory }) => (
              <Link
                key={_id}
                href={`/category/${encodeURIComponent(cartegory)}`}
                className="flex-shrink-0 px-3 py-1.5 text-xs bg-white dark:bg-gray-700 rounded-full shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                {cartegory}
              </Link>
            ))
          : Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-16 h-6 animate-pulse bg-gray-300 dark:bg-gray-600 rounded-full"
              />
            ))}
      </div> */}

      {/* Primary hero carousel */}
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[autoplaySlow]}
        className="w-full rounded-lg overflow-hidden"
      >
        <CarouselContent>
          {products.length > 0
            ? products.map((product) => (
                <CarouselItem
                  key={product._id}
                  className="relative h-[260px] sm:h-[400px]"
                >
                  <div
                    className="w-full h-full bg-black/50"
                    style={{
                      backgroundImage: `url("${product.product_image[0] ?? ""}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/40 to-transparent" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/category/${product.product_cartegory}`}
                          className="inline-block text-[11px] uppercase tracking-wide bg-white/20 backdrop-blur px-2 py-1 rounded text-white"
                        >
                          {product.product_cartegory}
                        </Link>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="flex flex-col gap-1">
                          <h2 className="text-white text-lg font-semibold leading-tight line-clamp-2">
                            {product.product_name}
                          </h2>
                          <span className="text-gold text-xl font-bold">
                            Ugx:{" "}
                            {(parseFloat(product.product_price) || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-xs"
                          >
                            <Link
                              href={`/product/${product._id}`}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" /> View
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gold hover:bg-yellow-600 text-xs"
                            onClick={() =>
                              HandleAddToCart({ _id: product._id as Id<"products"> })
                            }
                          >
                            <MdAddShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <CarouselItem
                  key={i}
                  className="h-[240px] sm:h-[300px] animate-pulse bg-gray-300 dark:bg-gray-700 rounded-lg"
                />
              ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      {/* Secondary mini product scroller */}
      <h3 className="text-sm font-semibold">You may also Like</h3>
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[autoplayFast]}
        className="w-full bg-gradient-to-r from-green-600 to-green-500 rounded-lg overflow-hidden p-2"
      >
        <CarouselContent>
          {(products.length > 0 ? products.slice(0, 10) : []).map((product) => (
            <CarouselItem
              key={product._id}
              className="basis-[55%] xs:basis-[45%] sm:basis-[38%]"
            >
              <Card className="bg-white dark:bg-gray-800 shadow-sm">
                <CardContent className="p-2 flex flex-col gap-2">
                  <div className="relative w-full h-32 rounded-md overflow-hidden">
                    <Image
                      src={product.product_image[0] ?? ""}
                      alt={product.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Link
                    href={`/product/${product._id}`}
                    className="text-xs font-medium line-clamp-2"
                  >
                    {product.product_name}
                  </Link>
                  <span className="text-[11px] font-semibold text-gold">
                    Ugx:{" "}
                    {(parseFloat(product.product_price) || 0).toLocaleString()}
                  </span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Countdown + recommended */}
      {/* <div className="w-full rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">You may also Like</h3>
          <div className="flex items-center gap-1 font-mono text-xs">
            {[{ v: d, l: "D" }, { v: h, l: "H" }, { v: m, l: "M" }, { v: s, l: "S" }].map(
              (t) => (
                <div
                  key={t.l}
                  className="bg-white/20 px-2 py-1 rounded text-[10px] font-semibold"
                >
                  {String(t.v).padStart(2, "0")}
                  <span className="ml-1 opacity-75">{t.l}</span>
                </div>
              )
            )}
          </div>
        </div> 
        {done && <div className="text-[10px]">Sale ended</div>}
        <div className="grid  gap-3">
          <Recommended type="view" />
        </div>
        <div className="text-right text-[11px]">
          <Link
            href="/collections/featured"
            className="underline underline-offset-4 decoration-white/60"
          >
            See all deals →
          </Link>
        </div>
      </div> */}
    </div>
  )
}

export default MobileHero