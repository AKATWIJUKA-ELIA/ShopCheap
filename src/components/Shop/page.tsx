"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Star,
  MapPin,
  Clock,
  Grid,
  List,
  Search,
  Heart,
  ShoppingCart,
  MessageCircle,
  Share2,
  Award,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HeroCard from "../HeroCards/page"
import { Product } from "@/lib/types"
import { ShopData,Review } from "@/lib/types"
import useGetProductsByOwnerApproved from "@/hooks/useGetProductsByOwnerApproved"
import {getReviewsByProduct} from "@/lib/convex"
import Image from "next/image"
import Link from "next/link"


interface Seller {
  id: string
  name: string
  avatar: string
  coverImage: string
  rating: number
  reviewCount: number
  location: string
  joinedDate: string
  description: string
  totalProducts: number
  totalSales: number
  responseTime: string
  badges: string[]
  policies: {
    shipping: string
    returns: string
    warranty: string
  }
}

// Mock data
const mockSeller: Seller = {
  id: "seller-1",
  name: "TechGear Pro",
  avatar: "/placeholder.svg?height=100&width=100&text=TG",
  coverImage: "/placeholder.svg?height=300&width=1200&text=Shop+Cover",
  rating: 4.8,
  reviewCount: 2847,
  location: "San Francisco, CA",
  joinedDate: "2020-03-15",
  description:
    "Premium electronics and gadgets store specializing in cutting-edge technology. We pride ourselves on quality products and exceptional customer service.",
  totalProducts: 156,
  totalSales: 12450,
  responseTime: "Within 2 hours",
  badges: ["Verified Seller", "Top Rated", "Fast Shipping"],
  policies: {
    shipping: "Free shipping on orders over $50",
    returns: "30-day return policy",
    warranty: "1-year warranty on all products",
  },
}
interface ProductWithReviews extends Product {
  reviews: Review[];
}       
interface ShopProps {
        shop: ShopData;
}


const categories = ["All", "Audio", "Wearables", "Accessories", "Gaming"]

const Shop:React.FC<ShopProps> = ({shop} ) =>{
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const { data: SameSellerProducts } = useGetProductsByOwnerApproved(shop?.owner_id ?? "");
      const [productsWithReviews, setProductsWithReviews] = useState<ProductWithReviews[]>([]);
    
    useEffect(() => {
        const fetchReviews = async () => {
            if (!SameSellerProducts?.length) return;
            
            const enhanced = await Promise.all(
                SameSellerProducts.map(async (product) => {
                    const reviewData = await getReviewsByProduct(product._id);
                    return {
                        ...product,
                        reviews: reviewData.data || []
                    };
                })
            );
            
            setProductsWithReviews(enhanced);
        };
        
        fetchReviews();
    }, [SameSellerProducts]);
    
  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = productsWithReviews?.filter((product) => {
      const matchesSearch =
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.product_description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "All" || product.product_cartegory === selectedCategory

      return matchesSearch && matchesCategory
    })

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered?.sort((a, b) => Number(a.product_price) - Number(b.product_price))
        break
      case "price-high":
        filtered?.sort((a, b) => Number(b.product_price) - Number(a.product_price))
        break
      default:
      
    }

    return filtered
  }, [productsWithReviews,searchQuery, selectedCategory, sortBy])


  const ProductListItem = ({ product }: { product: Product }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-shrink-0">
                <Link href={`/product/${product._id}`}>
                 <Image
                 fill
              src={product.product_image[0] || "/placeholder.svg"}
              alt={product.product_name}
              className="w-24 h-24 object-cover rounded-lg"
            />
                </Link>
            {/* {product.discount && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs">
                -{product.discount}%
              </Badge>
            )} */}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors cursor-pointer">
                {product.product_name}
              </h3>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2">{product.product_description}</p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.product_likes||0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                {/* <span className="text-sm text-gray-600">({product.reviewCount})</span> */}
              </div>

              <Badge variant="outline">{product.product_cartegory}</Badge>

              {/* {product.isNew && <Badge className="bg-green-500">New</Badge>} */}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl">Ugx: {product.product_price}</span>
                {/* {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                )} */}
              </div>

              <Button className="bg-gold" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Shop Header */}
      <div className="relative">
        <div className="h-60 mt-32 bg-gradient-to-r from-blue-600 to-purple-600 ">
                <Image src={shop.cover_image || "/placeholder.svg?height=300&width=1200&text=Shop+Cover"}  fill alt={shop.shop_name} priority/>
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative -mt-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={shop.profile_image || "/placeholder.svg"} alt={shop.shop_name} />
                <AvatarFallback className="text-2xl font-bold">
                  {shop.shop_name
                  .toUpperCase()
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold">{shop.shop_name}</h1>
                      <div className="flex gap-1">
                        {mockSeller.badges.map((badge, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{mockSeller.rating}</span>
                        <span>({mockSeller.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{mockSeller.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Responds {mockSeller.responseTime}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl">{mockSeller.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>
                    <Button>
                      <Heart className="h-4 w-4 mr-2" />
                      Follow Shop
                    </Button>
                  </div>
                </div>

                {/* Shop Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{productsWithReviews?.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{mockSeller.totalSales.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {new Date().getFullYear() - new Date(mockSeller.joinedDate).getFullYear()}y
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Policies */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-3">
            <Truck className="h-8 w-8 text-blue-600" />
            <div>
              <div className="font-medium">Shipping</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{mockSeller.policies.shipping}</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-3">
            <RotateCcw className="h-8 w-8 text-green-600" />
            <div>
              <div className="font-medium">Returns</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{mockSeller.policies.returns}</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-3">
            <Shield className="h-8 w-8 text-purple-600" />
            <div>
              <div className="font-medium">Warranty</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{mockSeller.policies.warranty}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products ({productsWithReviews?.length})</TabsTrigger>
            <TabsTrigger value="about">About Shop</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({mockSeller.reviewCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {productsWithReviews?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts?.map((product) =>
                  viewMode === "grid" ? (
                    <HeroCard key={product._id} product={product} />
                  ) : (
                    <ProductListItem key={product._id} product={product} />
                  ),
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">About {mockSeller.name}</h3>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">{mockSeller.description}</p>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Shop Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Joined:</span>
                          <span>{new Date(mockSeller.joinedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Location:</span>
                          <span>{mockSeller.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
                          <span>{mockSeller.responseTime}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Shop Policies</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Shipping: </span>
                          <span>{mockSeller.policies.shipping}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Returns: </span>
                          <span>{mockSeller.policies.returns}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Warranty: </span>
                          <span>{mockSeller.policies.warranty}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Star className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Reviews Coming Soon</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Customer reviews and ratings will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
export default Shop